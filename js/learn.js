const DEFAULT_LESSONS = [
  {id:'l1',icon:'☕',title:'Java Dasar',desc:'Variabel, tipe data, perulangan',content:'<p>Java adalah bahasa OOP.</p>',quiz:[
    {q:'Tipe data bilangan bulat?',o:['String','int','boolean','double'],c:1},
    {q:'Keyword perulangan?',o:['if','switch','for','try'],c:2},
    {q:'Method untuk mencetak ke console?',o:['print()','System.out.println()','console.log()','echo'],c:1}]},
  {id:'l2',icon:'📱',title:'Android Activity',desc:'Siklus hidup Activity',content:'<p>Activity = satu layar.</p>',quiz:[
    {q:'Method pertama dipanggil?',o:['onStart','onCreate','onResume','onDestroy'],c:1},
    {q:'Method saat app ke background?',o:['onPause','onDestroy','onCreate','onClick'],c:0}]},
  {id:'l3',icon:'🎨',title:'Layout XML',desc:'LinearLayout, ConstraintLayout',content:'<p>Layout mengatur UI.</p>',quiz:[
    {q:'Layout paling fleksibel?',o:['Linear','Frame','Constraint','Relative'],c:2},
    {q:'Atribut untuk lebar?',o:['width','layout_width','android:width','size'],c:1}]},
  {id:'l4',icon:'🔨',title:'Build APK',desc:'Gradle, signing, zipalign',content:'<p>Build APK pakai Gradle.</p>',quiz:[
    {q:'Perintah build debug?',o:['buildDebug','assembleDebug','make','create'],c:1},
    {q:'File keystore berekstensi?',o:['.key','.jks','.pem','.sign'],c:1}]},
  {id:'l5',icon:'🌐',title:'WebView',desc:'Tampilkan website di app',content:'<p>WebView = browser mini.</p>',quiz:[
    {q:'Permission wajib WebView?',o:['CAMERA','INTERNET','GPS','CONTACT'],c:1},
    {q:'Method load URL?',o:['openUrl','loadUrl','goUrl','getUrl'],c:1}]},
  {id:'l6',icon:'🔐',title:'Keamanan',desc:'Keystore, signing',content:'<p>Keystore disimpan aman.</p>',quiz:[
    {q:'Keystore sebaiknya?',o:['diganti','disimpan aman','dihapus','dibagikan'],c:1},
    {q:'Obfuscate kode pakai?',o:['ProGuard','Zipalign','Apktool','Dex2jar'],c:0}]},
  {id:'l7',icon:'🟣',title:'Kotlin Dasar',desc:'Bahasa modern Android',content:'<p>Kotlin resmi 2017.</p>',quiz:[
    {q:'val vs var?',o:['sama','val immutable','var immutable','bebas'],c:1},
    {q:'Function di Kotlin pakai?',o:['def','func','fun','function'],c:2}]},
  {id:'l8',icon:'🐙',title:'Version Control',desc:'Track perubahan kode',content:'<p>git init, add, commit.</p>',quiz:[
    {q:'Perintah commit?',o:['git save','git commit','git store','git push'],c:1},
    {q:'Buat branch baru?',o:['git new','git branch -c','git checkout -b','git fork'],c:2}]},
  {id:'l9',icon:'✨',title:'UI/UX Design',desc:'Prinsip desain',content:'<p>Konsisten, hierarki, feedback.</p>',quiz:[
    {q:'Prinsip utama UI?',o:['rumit','konsisten','acak','warna banyak'],c:1},
    {q:'Feedback UI contoh?',o:['diam','ripple saat klik','tidak ada respon','error'],c:1}]},
  {id:'l10',icon:'🚀',title:'Optimasi Performa',desc:'Bikin app ngebut',content:'<p>Hindari kerja di main thread.</p>',quiz:[
    {q:'Kerja berat sebaiknya di?',o:['main thread','background thread','UI','layout'],c:1},
    {q:'ListView vs RecyclerView?',o:['ListView cepat','RecyclerView efisien','sama','ListView baru'],c:1}]}
];

function ensureLessons(){ if(!DB.get('lessons',null)) DB.set('lessons',DEFAULT_LESSONS); return DB.get('lessons',[]) }

function renderLessons(){
  const grid = document.getElementById('lessonGrid');
  if (!grid) return;
  const lessons = ensureLessons();
  grid.innerHTML = lessons.map(l => '<div class="lesson-card" onclick="openQuiz(\''+l.id+'\')">' +
    '<div class="lesson-icon">'+l.icon+'</div><h3>'+l.title+'</h3><p>'+l.desc+'</p>' +
    '<div class="lesson-meta"><span>📝 '+(l.quiz||[]).length+' soal</span><span>Mulai →</span></div></div>').join('');
}

let currentLesson=null, currentQ=0, score=0;

function openQuiz(id){
  const lessons = ensureLessons();
  currentLesson = lessons.find(l => l.id === id);
  if (!currentLesson) return;
  trackView('lesson', id);
  currentQ = 0; score = 0;
  document.getElementById('quizModal').classList.add('open');
  renderQuiz();
  setTimeout(() => {
    if (typeof initQuizStickman === 'function') initQuizStickman();
  }, 100);
}
function closeQuiz(){
  document.getElementById('quizModal').classList.remove('open');
  if (quizAnimFrame) cancelAnimationFrame(quizAnimFrame);
}

function renderQuiz(){
  const box = document.getElementById('quizContent');
  const quiz = currentLesson.quiz || [];
  if (currentQ >= quiz.length){
    const pct = Math.round(score / quiz.length * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    if (typeof setQuizState === 'function') {
      setQuizState(pct >= 60 ? 'happy' : 'sad');
    }
    box.innerHTML = '<h2 style="text-align:center">'+emoji+' Selesai!</h2>' +
      '<canvas id="quizStickman" style="width:100%;height:180px;margin:16px 0"></canvas>' +
      '<p style="font-size:22px;margin:16px 0;text-align:center">Skor: <b>'+score+'/'+quiz.length+'</b> ('+pct+'%)</p>' +
      '<div style="text-align:center"><button class="btn btn-primary" onclick="openQuiz(\''+currentLesson.id+'\')">🔄 Ulangi</button> ' +
      '<button class="btn btn-secondary" onclick="closeQuiz()">Tutup</button></div>';
    setTimeout(() => {
      if (typeof initQuizStickman === 'function') initQuizStickman();
    }, 100);
    return;
  }
  const q = quiz[currentQ];
  if (typeof setQuizState === 'function') setQuizState('thinking');

  box.innerHTML =
    '<div class="quiz-progress"><span>Soal '+(currentQ+1)+' dari '+quiz.length+'</span><span>Skor: '+score+'</span></div>' +
    '<canvas id="quizStickman" style="width:100%;height:160px;margin:8px 0 16px"></canvas>' +
    '<h3 class="quiz-q" style="text-align:center">'+q.q+'</h3>' +
    q.o.map((opt,i) => '<button class="quiz-option" onclick="answerQuiz('+i+')">'+String.fromCharCode(65+i)+'. '+opt+'</button>').join('');

  setTimeout(() => {
    if (typeof initQuizStickman === 'function') initQuizStickman();
  }, 100);
}

function answerQuiz(idx){
  const q = currentLesson.quiz[currentQ];
  const isCorrect = idx === q.c;
  if (typeof setQuizState === 'function') {
    setQuizState(isCorrect ? 'happy' : 'sad');
  }
  document.querySelectorAll('.quiz-option').forEach((el,i) => {
    if (i === q.c) el.classList.add('correct');
    else if (i === idx) el.classList.add('wrong');
    el.disabled = true;
  });
  if (isCorrect) score++;
  setTimeout(() => { currentQ++; renderQuiz() }, 1800);
}

document.addEventListener('DOMContentLoaded', renderLessons);
