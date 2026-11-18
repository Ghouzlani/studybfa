#!/usr/bin/env node
/* Validate all published teaching datasets and local file references. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const subjects = {
 'analyse-financiere':'analyse-financiere-content.js',
 'marche-financier':'marche-financier-content.js',
 'fiscalite':'fiscalite-content.js',
 'systeme-information-erp':'erp-content.js',
 'tec':'tec-content.js',
 'intelligence-artificielle':'ai-content.js',
 'comptabilite-gestion':'comptabilite-gestion-content.js',
 'entrepreneuriat-business-plan':'entrepreneuriat-content.js'
};
let chapterCount=0, cardCount=0, questionCount=0;
for(const [slug,filename] of Object.entries(subjects)){
  const file=path.join('assets',filename);
  const source=fs.readFileSync(file,'utf8');
  const window={};
  vm.runInNewContext(source,{window},{filename:file,timeout:3000});
  assert(Array.isArray(window.STUDY_BFA_AI), 'Missing chapter array: '+slug);
  const html=fs.readFileSync(path.join('matieres',slug,'index.html'),'utf8');
  const declared=[...html.matchAll(/data-ai-chapter=["']\d+["']/g)].length;
  assert.equal(declared,window.STUDY_BFA_AI.length,'Chapter buttons not aligned: '+slug);
  if(slug==='marche-financier') {
    assert.equal(declared,8,'The two professor PDFs require eight clear learning sequences');
    assert(window.STUDY_BFA_AI.slice(0,4).every(c=>c.label.includes('PARTIE 1')),'Part 1 lessons missing');
    assert(window.STUDY_BFA_AI.slice(4).every(c=>c.label.includes('PARTIE 2')),'Part 2 bond lessons missing');
    const courseText=JSON.stringify(window.STUDY_BFA_AI);
    for(const term of ['OPCVM','AMMC','coupon couru','annuités constantes','duration','sensibilité']) assert(courseText.toLowerCase().includes(term.toLowerCase()),'Missing professor topic: '+term);
  }
  if(slug==='systeme-information-erp') {
    assert.equal(declared,10,'Professor SI support requires 10 accessible chapters');
    assert(window.STUDY_BFA_AI[0].notes.some(x=>x[1].includes('ACSI')),'Use professor acronym ACSI');
    assert(window.STUDY_BFA_AI[7].notes.some(x=>x[0].includes('XOR')),'Advanced BPMN gateway content is missing');
    assert(window.STUDY_BFA_AI[8].notes.some(x=>x[1].includes('B2A')),'Partner relationships missing');
    assert(window.STUDY_BFA_AI[9].notes.some(x=>x[1].includes('IoT')),'IoT chapter missing');
    assert(!window.STUDY_BFA_AI.some(c=>c.notes.some(n=>/\bPareto\b|CrewAI|Dify/.test(n[1]))),'Unattributed outside-topic content present');
  }
  assert(html.includes('/assets/ai-learning.js?v=233'), 'Outdated learning controller: '+slug);
  assert(html.includes('data-ai-tab="revision"'), 'Revision tab missing: '+slug);
  assert(html.includes('ai-revision-panel'), 'Revision panel missing: '+slug);
  assert(!html.includes('ai-video') && !html.includes('Vidéo bientôt disponible'), 'Obsolete chapter video element: '+slug);
  const seen=new Set();
  window.STUDY_BFA_AI.forEach((chapter,i)=>{
    const number=chapter.number||i+1;
    const pdf=path.join('fiches',slug+'-chapitre-'+number+'.pdf');
    assert(fs.existsSync(pdf),'Missing PDF: '+pdf);
    assert(!seen.has(number),'Duplicate chapter number: '+slug);seen.add(number);
    assert(Array.isArray(chapter.notes)&&chapter.notes.length>0,'Missing notes: '+slug+'/'+number);
    assert(Array.isArray(chapter.cards)&&chapter.cards.length>0,'Missing cards: '+slug+'/'+number);
    assert(Array.isArray(chapter.quiz)&&chapter.quiz.length>0,'Missing quiz: '+slug+'/'+number);
    assert(Array.isArray(chapter.map)&&chapter.map.length>0,'Missing map: '+slug+'/'+number);
    assert(!Object.hasOwn(chapter,'exercises'),'Exercise data must remain unpublished until requested: '+slug+'/'+number);
    const allLearningText=JSON.stringify([chapter.notes,chapter.cards,chapter.quiz,chapter.map]);
    assert(!/\bFLK\b/i.test(allLearningText),'Named FLK exercise leaked into lesson content: '+slug+'/'+number);
    for(const [title,text] of chapter.notes){
      assert(typeof title==='string'&&title.trim(),'Empty lesson heading');
      assert(typeof text==='string'&&text.trim(),'Empty paragraph');
    }
    for(const [front,back] of chapter.cards){
      assert(typeof front==='string'&&front.length>=8,'Empty flashcard question');
      assert(typeof back==='string'&&back.trim(),'Empty flashcard answer');
    }
    for(const [prompt,options,correct,explanation] of chapter.quiz){
      assert(typeof prompt==='string'&&prompt.trim(),'Empty question');
      assert(Array.isArray(options)&&options.length>=2,'Not enough quiz choices');
      assert(Number.isInteger(correct)&&correct>=0&&correct<options.length,'Invalid correct index');
      assert(options.every(x=>typeof x==='string'&&x.trim()),'Empty answer choice');
      assert(new Set(options).size===options.length,'Duplicate answer choices');
      assert(typeof explanation==='string'&&explanation.trim(),'Missing explanation');
    }
    chapterCount++;cardCount+=chapter.cards.length;questionCount+=chapter.quiz.length;
  });
}
assert.equal(chapterCount,44,'Unexpected structured chapter count');
assert.equal(cardCount,491,'Unexpected number of retained flashcards');
assert.equal(questionCount,390,'Unexpected number of retained quiz questions');
for(const slug of ['comptabilite-approfondie']){
  assert(fs.existsSync(path.join('matieres',slug,'index.html')),'Missing upcoming subject');
}
const visual=fs.readFileSync('assets/studybfa-revision-v210.js','utf8');
assert(!visual.includes('MutationObserver'), 'Revision overlay must not replace real notes');
assert(!visual.includes('STUDY_BFA_SHEETS='),'Duplicate revision dataset must not be published');
console.log('Validated '+chapterCount+' chapters, '+cardCount+' flashcards, '+questionCount+' quiz questions.');

// Every multi-chapter subject must expose the compact, accessible chapter picker.
for(const slug of ['analyse-financiere','marche-financier','business-english','comptabilite-gestion','entrepreneuriat-business-plan','fiscalite','intelligence-artificielle','systeme-information-erp','tec']){
  const html=fs.readFileSync(path.join('matieres',slug,'index.html'),'utf8');
  assert(html.includes('studybfa-chapter-picker.js'), 'Missing chapter picker script: '+slug);
  assert(html.includes('studybfa-chapter-picker.css'), 'Missing chapter picker styles: '+slug);
  assert(html.includes('chapter-selector'), 'Missing original chapter controls: '+slug);
}

const subjectsWithVideoRecap=[
  'analyse-financiere','business-english','comptabilite-approfondie',
  'comptabilite-gestion','entrepreneuriat-business-plan','fiscalite',
  'intelligence-artificielle','marche-financier','systeme-information-erp','tec'
];
for(const slug of subjectsWithVideoRecap){
  const subject=fs.readFileSync(path.join('matieres',slug,'index.html'),'utf8');
  const page=path.join('matieres',slug,'synthese','index.html');
  assert(fs.existsSync(page),'Missing subject-level recap video page: '+slug);
  const summary=fs.readFileSync(page,'utf8');
  assert(subject.includes('/matieres/'+slug+'/synthese/'),'Missing link to subject recap: '+slug);
  assert(summary.includes('sb-video-frame'),'Missing future video area: '+slug);
  assert(summary.includes('href="/matieres/'+slug+'/"'),'Missing back link: '+slug);
  assert(!/flashcards?|quiz|mind ?map|carte mentale/i.test(summary),'Video page must contain no learning exercises: '+slug);
  assert(!/<iframe\b/i.test(summary),'Do not present an unrelated chapter video as a full-course recap: '+slug);
}
const english=fs.readFileSync('matieres/business-english/index.html','utf8');
assert(!/<iframe\b/i.test(english),'Business English revision must be text only');
const sharedController=fs.readFileSync('assets/ai-learning.js','utf8');
assert(!sharedController.includes('renderExercises'),'Shared controller still contains exercise feature');
assert(sharedController.includes("activateTab('revision')"),'The revision panel must be the initial tab');
console.log('Validated 10 dedicated full-course video pages and clean chapter revision tabs.');


// Content-quality regression checks for all published structured subjects.
for(const [slug,filename] of Object.entries(subjects)){
  const source=fs.readFileSync(path.join('assets',filename),'utf8');
  const context={window:{}};
  vm.runInNewContext(source,context,{timeout:3000});
  const chapters=context.window.STUDY_BFA_AI;
  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const seenAnswers=new Map();
  const seenPrompts=new Map();
  chapters.forEach((c,i)=>{
    for(const [q,a] of c.cards){
      const normalizedAnswer=norm(a),normalizedPrompt=norm(q);
      if(seenAnswers.has(normalizedAnswer))throw new Error('Duplicate flashcard learning answer: '+slug+' #'+(i+1)+' (already '+seenAnswers.get(normalizedAnswer)+')');
      if(seenPrompts.has(normalizedPrompt))throw new Error('Duplicate flashcard learning question: '+slug+' #'+(i+1)+' (already '+seenPrompts.get(normalizedPrompt)+')');
      seenAnswers.set(normalizedAnswer,i+1);
      seenPrompts.set(normalizedPrompt,i+1);
    }
    const cardQuestions=c.cards.map(x=>x[0]);
    const quizQuestions=c.quiz.map(x=>x[0]);
    assert.equal(new Set(cardQuestions).size,cardQuestions.length, 'Repeated flashcard prompt: '+slug+'/'+(i+1));
    assert.equal(new Set(quizQuestions).size,quizQuestions.length, 'Repeated quiz prompt: '+slug+'/'+(i+1));
    const html=fs.readFileSync(path.join('matieres',slug,'index.html'),'utf8');
    assert(!html.includes('data-ai-tab="exercises"') && !html.includes('id="ai-exercises-body"'),'Exercise section must not appear before requested: '+slug);
    assert(!/exercices corrigés/i.test(JSON.stringify(c)),'Obsolete exercises text: '+slug+'/'+(i+1));
    const isCaseAmount=(prompt)=>/\d[\d\s]*\s*DH\b/i.test(prompt) && !/seuil|plafond|valeur unitaire|100 DH|5 000 DH|50 000 DH/i.test(prompt);
    assert(!cardQuestions.some(isCaseAmount),'Numerical case in a flashcard: '+slug+'/'+(i+1));
    assert(!quizQuestions.some(isCaseAmount),'Numerical case in a quiz: '+slug+'/'+(i+1));
    for(const [prompt,answer] of c.cards){
      assert(prompt.length<=145,'Overlong flashcard prompt: '+slug+'/'+(i+1));
      assert(answer.trim().length>=15,'Too-short flashcard explanation: '+slug+'/'+(i+1));
    }
    for(const [prompt,choices,correct,explanation] of c.quiz){
      assert(prompt.length<=160,'Overlong quiz prompt: '+slug+'/'+(i+1));
      assert(choices[correct].trim().length>=2,'Missing correct answer: '+slug+'/'+(i+1));
      assert(explanation.trim().length>=18,'Too-short quiz explanation: '+slug+'/'+(i+1));
    }
  });
}
// Regression tests: these checks were accidentally double-escaped in older versions.
const sampleCase='Pourquoi la trésorerie nette est-elle de 7 000 DH ?';
assert(/\d[\d\s]*\s*DH\b/i.test(sampleCase),'Numerical-exercise detector is broken');
assert(/\bFLK\b/i.test('Application FLK'),'Named-case detector is broken');
const englishJs=fs.readFileSync('assets/business-english.js','utf8');
const englishMatch=englishJs.match(/const cards=(\[[\s\S]*?\]);const questions=(\[[\s\S]*?\]);let index=/);
assert(englishMatch,'Business English dataset not found');
const englishCards=JSON.parse(englishMatch[1]);
const englishQuiz=JSON.parse(englishMatch[2]);
assert.equal(englishCards.length,18,'Business English flashcards missing');
assert.equal(englishQuiz.length,13,'Business English quiz missing');
englishQuiz.forEach((q,i)=>{
  assert(Array.isArray(q[2]) && q[2].length>0,'Missing Business English correct-answer list: '+i);
  assert(q[2].every(x=>Number.isInteger(x)&&x>=0&&x<q[1].length),'Invalid Business English correct-answer index: '+i);
  assert(q[3]?.trim(),'Missing Business English explanation: '+i);
});
const englishSheet=fs.readFileSync('matieres/business-english/index.html','utf8');
assert(englishSheet.includes('lang="en"'),'English lesson must declare English page language');
assert(englishSheet.includes('be-sheet be-sheet-prose'),'Business English fiche must use readable prose');
assert(!englishSheet.includes('be-rev-grid'),'Business English fiche still contains visual grids');
console.log('Clear-question regression checks passed: '+(cardCount+englishCards.length)+' cards, '+(questionCount+englishQuiz.length)+' quizzes.');

const teachingPages=[
  'index.html','porteur-du-projet/index.html',
  ...Object.keys(subjects).map(slug=>'matieres/'+slug+'/index.html'),
  'matieres/business-english/index.html','matieres/comptabilite-approfondie/index.html',
  ...subjectsWithVideoRecap.map(slug=>'matieres/'+slug+'/synthese/index.html')
];
for(const page of new Set(teachingPages)){
 const html=fs.readFileSync(page,'utf8');
 assert(html.includes('<title>')||html.includes('<title '),'Missing page title: '+page);
 assert(html.includes('viewport'),'Missing viewport meta: '+page);
 for(const [,raw] of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)){
  if(/^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(raw))continue;
  const clean=raw.split(/[?#]/)[0];
  if(!clean)continue;
  const parts=clean.startsWith('/')?[]:page.split('/').slice(0,-1);
  for(const part of clean.split('/')){
   if(part==='..')parts.pop();
   else if(part&&part!=='.')parts.push(part);
  }
  let target=parts.join('/');
  if(clean==='/'||clean.endsWith('/'))target+=(target?'/':'')+'index.html';
  assert(fs.existsSync(target),'Broken internal link from '+page+' to '+raw+' ('+target+')');
 }
}
console.log('Validated all '+new Set(teachingPages).size+' page navigation and asset references.');
