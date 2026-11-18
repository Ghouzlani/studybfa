/* StudyBFA shared learning controller — preserves published academic data. */
document.addEventListener('DOMContentLoaded', () => {
  const chapters = window.STUDY_BFA_AI;
  const $ = id => document.getElementById(id);
  if (!Array.isArray(chapters) || !chapters.length || !$('ai-card')) return;
  let chapter = 0, card = 0, flipped = false, question = 0, selected = -1;
  let checked = false, score = 0, finished = false, mistakes = [], quiz = [];
  const tones = ['teal','lavender','amber','coral'];

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function shuffledQuiz(items) {
    return items.map(([prompt, answers, correctIndex, explanation]) => {
      const entries = answers.map((answer, index) => ({answer, correct:index === correctIndex}));
      for(let i = entries.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
      }
      return {prompt, answers:entries.map(x=>x.answer), correct:entries.findIndex(x=>x.correct), explanation};
    });
  }
  function newAttempt() {
    question = 0; selected = -1; checked = false; score = 0; finished = false; mistakes = [];
    quiz = shuffledQuiz(chapters[chapter].quiz);
  }
  function activateTab(name, focus = false) {
    document.querySelectorAll('[data-ai-tab]').forEach(button => {
      const active = button.dataset.aiTab === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    ['revision','cards','quiz','map','exercises'].forEach(id => { const panel=$(id === 'revision' ? 'ai-revision-panel' : 'ai-'+id); if(panel) panel.hidden = id !== name; });
    if (name === 'cards') renderCard();
    if (name === 'quiz') renderQuiz();
    if (name === 'map') renderMap();
    if (name === 'exercises') renderExercises();
  }
  function renderExercises() {
    const root = $('ai-exercises-body');
    if (!root) return;
    root.replaceChildren();
    const exercises = chapters[chapter].exercises || [];
    exercises.forEach((exercise, i) => {
      const article=el('article','sb-revision-prose');
      article.append(el('h4','',exercise.title || 'Exercice '+(i+1)));
      if (exercise.source) article.append(el('p','',exercise.source));
      article.append(el('h4','','Énoncé'),el('p','',exercise.statement));
      const details=el('details','sb-exercise-solution');
      const summary=el('summary','','Afficher le corrigé');
      details.append(summary,el('p','',exercise.solution));
      article.append(details);
      root.append(article);
    });
  }
  function activateChapter(index) {
    if (!chapters[index]) return;
    chapter = index; card = 0; flipped = false; newAttempt();
    document.querySelectorAll('[data-ai-chapter]').forEach(button => {
      const active = Number(button.dataset.aiChapter) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('ai-chapter-number').textContent = chapters[index].label || ('CHAPITRE ' + (chapters[index].number || index+1));
    const exerciseTab = document.querySelector('[data-ai-tab="exercises"]');
    if (exerciseTab) exerciseTab.hidden = !(chapters[index].exercises && chapters[index].exercises.length);
    $('ai-chapter-title').textContent = chapters[index].title;
    const root = $('ai-revision');
    root.replaceChildren();
    // No diagram/grid conversion. The existing lecture notes are the sole source.
    chapters[index].notes.forEach(([heading, body]) => {
      const section = el('section', 'sb-revision-prose');
      section.append(el('h4', '', heading), el('p', '', body));
      root.append(section);
    });
    activateTab('revision');
  }
  function renderCard() {
    const cards = chapters[chapter].cards;
    if (!cards || !cards.length) return;
    const [front, back] = cards[card];
    $('ai-card-question').textContent = front;
    $('ai-card-answer').textContent = back;
    const button = $('ai-card');
    button.classList.toggle('is-flipped',flipped);
    button.setAttribute('aria-pressed',String(flipped));
    button.setAttribute('aria-label',flipped?'Afficher la question':'Afficher la réponse');
    button.dataset.tone = tones[card % tones.length];
    $('ai-card-count').textContent = (card+1)+' / '+cards.length;
    $('ai-card-meter').style.width = (100*(card+1)/cards.length)+'%';
    $('ai-prev').disabled = card===0;
    $('ai-next').disabled = card===cards.length-1;
  }
  function renderQuiz() {
    const root = $('ai-quiz-body'); root.replaceChildren();
    $('ai-quiz-count').textContent = finished ? quiz.length+' / '+quiz.length : (question+1)+' / '+quiz.length;
    $('ai-quiz-meter').style.width = (100*(finished ? quiz.length : question+1)/quiz.length)+'%';
    if (finished) {
      root.append(el('h3','', 'Résultat : '+score+' / '+quiz.length));
      root.append(el('p','', 'Consultez vos corrections puis recommencez pour vous entraîner.'));
      if (mistakes.length) {
        const box = el('div','sb-mistake-review');
        box.append(el('h4','','Questions à revoir ('+mistakes.length+')'));
        mistakes.forEach(i => box.append(el('p','',quiz[i].prompt+' — '+quiz[i].explanation)));
        root.append(box);
      }
      const retry = el('button','ai-primary','Recommencer avec des choix mélangés');
      retry.type='button'; retry.addEventListener('click',()=>{newAttempt();renderQuiz();});
      root.append(retry); return;
    }
    const current = quiz[question];
    root.append(el('h3','',current.prompt));
    current.answers.forEach((answer,i)=>{
      const button=el('button','ai-option',String.fromCharCode(65+i)+'. '+answer);
      button.type='button';
      if(i===selected) button.classList.add('selected');
      if(checked&&i===current.correct) button.classList.add('correct');
      if(checked&&i===selected&&i!==current.correct) button.classList.add('incorrect');
      button.disabled=checked;
      button.setAttribute('aria-pressed', String(selected===i));
      button.addEventListener('click',()=>{selected=i;renderQuiz();});
      root.append(button);
    });
    if (checked) {
      const correct = selected===current.correct;
      const feedback=el('p','ai-feedback',(correct?'Bonne réponse ! ':'À retenir : ')+current.explanation);
      feedback.setAttribute('aria-live','polite');root.append(feedback);
    }
    const next=el('button','ai-primary',checked?(question===quiz.length-1?'Voir le résultat':'Question suivante'):'Vérifier la réponse');
    next.type='button'; next.disabled=selected<0;
    next.addEventListener('click',()=>{
      if (!checked) {
        checked=true;
        if(selected===current.correct) score++;
        else mistakes.push(question);
      } else if (question===quiz.length-1) finished=true;
      else {question++;selected=-1;checked=false;}
      renderQuiz();
    });
    root.append(next);
  }
  function renderMap() {
    const renderer=window.StudyBFAAcademyMap;
    if (renderer && typeof renderer.render==='function')
      renderer.render($('ai-map-body'),$('ai-map-detail'),chapters[chapter].title,chapters[chapter].map);
  }
  document.querySelectorAll('[data-ai-chapter]').forEach(button =>
    button.addEventListener('click',()=>activateChapter(Number(button.dataset.aiChapter))));
  const tabs=[...document.querySelectorAll('[data-ai-tab]')];
  tabs.forEach((button,i)=>{
    button.addEventListener('click',()=>activateTab(button.dataset.aiTab));
    button.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight') next=(i+1)%tabs.length;
      else if(event.key==='ArrowLeft') next=(i+tabs.length-1)%tabs.length;
      else if(event.key==='Home') next=0;
      else if(event.key==='End') next=tabs.length-1;
      else return;
      event.preventDefault();activateTab(tabs[next].dataset.aiTab,true);
    });
  });
  $('ai-card').addEventListener('click',()=>{flipped=!flipped;renderCard();});
  $('ai-prev').addEventListener('click',()=>{if(card>0){card--;flipped=false;renderCard();}});
  $('ai-next').addEventListener('click',()=>{if(card<chapters[chapter].cards.length-1){card++;flipped=false;renderCard();}});
  activateChapter(0);
});
