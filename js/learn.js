const DEFAULT_LESSONS = [
  {id:'l1',icon:'☕',title:'Java Dasar',desc:'Variabel, tipe data, perulangan',content:'<p>Java adalah bahasa OOP.</p>',quiz:[
    {q:'Tipe data bilangan bulat?',o:['String','int','boolean','double'],c:1},
    {q:'Keyword perulangan?',o:['if','switch','for','try'],c:2}]},
  {id:'l2',icon:'📱',title:'Android Activity',desc:'Siklus hidup Activity',content:'<p>Activity = satu layar.</p>',quiz:[
    {q:'Method pertama?',o:['onStart','onCreate','onResume','onDestroy'],c:1}]},
  {id:'l3',icon:'🎨',title:'Layout XML',desc:'LinearLayout, ConstraintLayout',content:'<p>Layout mengatur UI.</p>',quiz:[
    {q:'Layout paling fleksibel?',o:['Linear','Frame','Constraint','Relative'],c:2}]},
  {id:'l4',icon:'🔨',title:'Build APK',desc:'Gradle, signing, zipalign',content:'<p>Build APK pakai Gradle.</p>',quiz:[
    {q:'Build debug?',o:['buildDebug','assembleDebug','make','create'],c:1}]},
  {id:'l5',icon:'🌐',title:'WebView',desc:'Tampilkan website di app',content:'<p>WebView = browser mini.</p>',quiz:[
    {q:'Permission wajib?',o:['CAMERA','INTERNET','GPS','CONTACT'],c:1}]},
  {id:'l6',icon:'🔐',title:'Keamanan',desc:'Keystore, signing',content:'<p>Keystore disimpan aman.</p>',quiz:[
    {q:'Keystore sebaiknya?',o:['diganti','disimpan aman','dihapus','dibagikan'],c:1}]},
  {id:'l7',icon:'🟣',title:'Kotlin Dasar',desc:'Bahasa modern Android',content:'<p>Kotlin resmi 2017.</p>',quiz:[
    {q:'val vs var?',o:['sama','val immutable','var immutable','bebas'],c:1}]},
  {id:'l8',icon:'🐙',title:'Version Control',desc:'Track perubahan kode',content:'<p>git init, add, commit.</p>',quiz:[
    {q:'Perintah commit?',o:['git save','git commit','git store','git push'],c:1}]},
  {id:'l9',icon:'✨',title:'UI/UX Design',desc:'Prinsip desain',content:'<p>Konsisten, hierarki, feedback.</p>',quiz:[
    {q:'Prinsip utama?',o:['rumit','konsisten','acak','warna banyak'],c:1}]},
  {id:'l10',icon:'🚀',title:'Optimasi Performa',desc:'Bikin app ngebut',content:'<p>Hindari kerja di main thread.</p>',quiz:[
    {q:'Kerja berat di?',o:['main thread','background thread','UI','layout'],c:1}]}
];

function ensureLessons(){ if(!DB.get('lessons',null)) DB.set('lessons',DEFAULT_LESSONS); return DB.get('lessons',[]) }

function renderLessons(){
  const grid = document.getElementById('lessonGrid');
  if (!grid) return;
  const lessons = ensureLessons();
  grid.innerHTML = lessons.map(l=>'<div class="lesson-card" onclick="openQuiz(\''+l.id+'\')">'+
    '<div class="lesson-icon">'+l.icon+'</div><h3>'+l.title+'</h3><p>'+l.desc+'</p>'+
    '<div class="lesson-meta"><span>📝 '+(l.quiz||[]).length+' soal</span><span>Mulai →</span></div></div>').join('');
}

let currentLesson=null, currentQ=0, score=0;

function openQuiz(id){
  const lessons = ensureLessons();
  currentLesson = lessons.find(l=>l.id===id);
  if (!currentLesson) return;
  trackView('lesson',id);
  currentQ=0; score=0;
  document.getElementById('quizModal').classList.add('open');
  renderQuiz();
}

function closeQuiz(){ document.getElementById('quizModal').classList.remove('open') }

function renderQuiz(){
  const box = document.getElementById('quizContent');
  const quiz = currentLesson.quiz||[];
  if (currentQ >= quiz.length){
    const pct = Math.round(score/quiz.length*100);
    const emoji = pct>=80?'🏆':pct>=60?'👍':'📚';
    box.innerHTML = '<h2>'+emoji+' Selesai!</h2>'+
      '<p style="font-size:20px;margin:16px 0">Skor: <b>'+score+'/'+quiz.length+'</b> ('+pct+'%)</p>'+
      '<button class="btn btn-primary" onclick="openQuiz(\''+currentLesson.id+'\')">🔄 Ulangi</button> '+
      '<button class="btn btn-secondary" onclick="closeQuiz()">Tutup</button>';
    return;
  }
  const q = quiz[currentQ];
  box.innerHTML = '<div class="quiz-progress"><span>Soal '+(currentQ+1)+' dari '+quiz.length+'</span><span>Skor: '+score+'</span></div>'+
    '<h3 class="quiz-q">'+q.q+'</h3>'+
    q.o.map((opt,i)=>'<button class="quiz-option" onclick="answerQuiz('+i+')">'+String.fromCharCode(65+i)+'. '+opt+'</button>').join('');
}

function answerQuiz(idx){
  const q = currentLesson.quiz[currentQ];
  document.querySelectorAll('.quiz-option').forEach((el,i)=>{
    if (i===q.c) el.classList.add('correct');
    else if (i===idx) el.classList.add('wrong');
    el.disabled = true;
  });
  if (idx===q.c) score++;
  setTimeout(()=>{ currentQ++; renderQuiz(); }, 900);
}

document.addEventListener('DOMContentLoaded', renderLessons);
