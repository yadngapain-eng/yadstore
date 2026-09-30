
/* ============================================
   VOICE RECOGNITION — Untuk pelajaran Bahasa Jawa
   ============================================ */
(function() {
  'use strict';

  window.VoiceJawa = window.VoiceJawa || {};

  var Voice = VoiceJawa;

  // ===== STATE =====
  Voice.recognition = null;
  Voice.isRecording = false;
  Voice.currentCallback = null;
  Voice.transcript = '';
  Voice.confidence = 0;

  // ===== CHECK SUPPORT =====
  Voice.isSupported = function() {
    return 'webkitSpeechRecognition' in window ||
           'SpeechRecognition' in window;
  };

  // ===== INIT =====
  Voice.init = function() {
    if (!Voice.isSupported()) {
      console.warn('[VoiceJawa] Speech Recognition tidak didukung');
      return false;
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    Voice.recognition = new SpeechRecognition();

    // Config untuk Bahasa Jawa (id-ID sebagai base)
    Voice.recognition.lang = 'id-ID'; // Bahasa Indonesia (paling dekat)
    Voice.recognition.continuous = false;
    Voice.recognition.interimResults = true;
    Voice.recognition.maxAlternatives = 3;

    // Event handlers
    Voice.recognition.onstart = function() {
      Voice.isRecording = true;
      console.log('[VoiceJawa] Recording started');
      Voice.updateUI('recording');
    };

    Voice.recognition.onresult = function(event) {
      var interim = '';
      var final = '';

      for (var i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        var confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          final += transcript;
          Voice.transcript = transcript;
          Voice.confidence = confidence;
        } else {
          interim += transcript;
        }
      }

      Voice.updateLiveTranscript(final || interim);
    };

    Voice.recognition.onerror = function(event) {
      console.warn('[VoiceJawa] Error:', event.error);
      Voice.isRecording = false;
      Voice.updateUI('error');
      Voice.showError(event.error);
    };

    Voice.recognition.onend = function() {
      Voice.isRecording = false;
      Voice.updateUI('stopped');
      console.log('[VoiceJawa] Recording stopped');

      if (Voice.currentCallback && Voice.transcript) {
        Voice.currentCallback(Voice.transcript, Voice.confidence);
        Voice.currentCallback = null;
      }
    };

    console.log('[VoiceJawa] Init OK — lang:', Voice.recognition.lang);
    return true;
  };

  // ===== START RECORDING =====
  Voice.start = function(onResult) {
    if (!Voice.recognition) {
      if (!Voice.init()) {
        alert('Browser kamu tidak support voice recognition. Pakai Chrome atau Kiwi Browser ya!');
        return false;
      }
    }

    if (Voice.isRecording) {
      Voice.stop();
      return false;
    }

    Voice.transcript = '';
    Voice.confidence = 0;
    Voice.currentCallback = onResult;

    try {
      Voice.recognition.start();
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(20);
      if (typeof UI !== 'undefined' && UI.sound) UI.sound('click');
      return true;
    } catch (e) {
      console.warn('[VoiceJawa] Start error:', e);
      // Retry sekali lagi
      setTimeout(function() {
        try { Voice.recognition.start(); } catch(e2) {}
      }, 300);
      return false;
    }
  };

  // ===== STOP RECORDING =====
  Voice.stop = function() {
    if (Voice.recognition && Voice.isRecording) {
      try {
        Voice.recognition.stop();
      } catch (e) {}
    }
  };

  // ===== COMPARE TRANSCRIPT WITH TARGET =====
  Voice.compare = function(transcript, target) {
    if (!transcript || !target) return { score: 0, match: false };

    // Normalize
    var normTranscript = Voice.normalize(transcript);
    var normTarget = Voice.normalize(target);

    // Split into words
    var tWords = normTranscript.split(/\s+/).filter(function(w) { return w.length > 0; });
    var targetWords = normTarget.split(/\s+/).filter(function(w) { return w.length > 0; });

    // Count matching words
    var matches = 0;
    targetWords.forEach(function(tw) {
      if (tWords.indexOf(tw) !== -1) matches++;
    });

    // Calculate score
    var wordScore = targetWords.length > 0 ? (matches / targetWords.length) * 70 : 0;

    // Bonus untuk urutan yang benar
    var orderBonus = 0;
    if (normTranscript.indexOf(normTarget) !== -1) {
      orderBonus = 30;
    } else if (Voice.similarity(normTranscript, normTarget) > 0.7) {
      orderBonus = 20;
    } else if (Voice.similarity(normTranscript, normTarget) > 0.5) {
      orderBonus = 10;
    }

    var totalScore = Math.min(100, Math.round(wordScore + orderBonus));

    return {
      score: totalScore,
      match: totalScore >= 60,
      wordMatches: matches,
      totalWords: targetWords.length,
      transcript: transcript,
      target: target,
    };
  };

  // ===== NORMALIZE TEXT =====
  Voice.normalize = function(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s]/g, '')  // Hapus tanda baca
      .replace(/\s+/g, ' ')     // Normalize spasi
      .trim();
  };

  // ===== SIMILARITY (Levenshtein) =====
  Voice.similarity = function(s1, s2) {
    var longer = s1.length > s2.length ? s1 : s2;
    var shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    var editDistance = Voice.levenshtein(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  Voice.levenshtein = function(s1, s2) {
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) costs[i] = i;
    for (var i = 1; i <= s2.length; i++) {
      costs[0] = i;
      var nw = i - 1;
      for (var j = 1; j <= s1.length; j++) {
        var cj = Math.min(
          1 + costs[j],
          1 + costs[j - 1],
          s1.charAt(j - 1) === s2.charAt(i - 1) ? nw : nw + 1
        );
        nw = costs[j];
        costs[j] = cj;
      }
    }
    return costs[s1.length];
  };

  // ===== UI HELPERS =====
  Voice.updateUI = function(status) {
    var el = document.getElementById('voice-status');
    if (!el) return;

    var statusMap = {
      recording: { text: '🎤 Merekam...', color: '#ff4b4b' },
      stopped: { text: '✓ Selesai', color: '#58cc02' },
      error: { text: '❌ Error', color: '#ff4b4b' },
    };

    var s = statusMap[status] || statusMap.stopped;
    el.textContent = s.text;
    el.style.color = s.color;
  };

  Voice.updateLiveTranscript = function(text) {
    var el = document.getElementById('voice-transcript');
    if (el) el.textContent = text;
  };

  Voice.showError = function(error) {
    var msg = 'Error: ' + error;
    if (error === 'not-allowed') {
      msg = '❌ Izin mikrofon ditolak. Aktifkan di pengaturan browser.';
    } else if (error === 'no-speech') {
      msg = '🔇 Tidak ada suara. Coba lagi.';
    } else if (error === 'audio-capture') {
      msg = '🎤 Mikrofon tidak terdeteksi.';
    } else if (error === 'network') {
      msg = '🌐 Butuh internet untuk voice recognition.';
    }

    if (typeof Animate !== 'undefined') {
      Animate.toast(msg, 'error');
    }
  };

  // ===== SPEAK TEXT (Text-to-Speech) =====
  Voice.speak = function(text, lang) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || 'id-ID';
    utter.rate = 0.9;
    utter.pitch = 1.0;

    // Cari voice Indonesia
    var voices = window.speechSynthesis.getVoices();
    var idVoice = voices.find(function(v) {
      return v.lang.indexOf('id') === 0;
    });
    if (idVoice) utter.voice = idVoice;

    window.speechSynthesis.speak(utter);
  };

  Voice.stopSpeak = function() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  console.log('[VoiceJawa] Loaded — supported:', Voice.isSupported());
  window.VoiceJawa = Voice;
})();
