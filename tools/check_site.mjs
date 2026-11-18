#!/usr/bin/env node
/* Validate all published teaching datasets and local file references. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const subjects = {
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
  if(slug==='systeme-information-erp') {
    assert.equal(declared,10,'Professor SI support requires 10 accessible chapters');
    assert(window.STUDY_BFA_AI[0].notes.some(x=>x[1].includes('ACSI')),'Use professor acronym ACSI');
    assert(window.STUDY_BFA_AI[7].notes.some(x=>x[0].includes('XOR')),'Advanced BPMN gateway content is missing');
    assert(window.STUDY_BFA_AI[8].notes.some(x=>x[1].includes('B2A')),'Partner relationships missing');
    assert(window.STUDY_BFA_AI[9].notes.some(x=>x[1].includes('IoT')),'IoT chapter missing');
    assert(!window.STUDY_BFA_AI.some(c=>c.notes.some(n=>/\bPareto\b|CrewAI|Dify/.test(n[1]))),'Unattributed outside-topic content present');
  }
  assert(html.includes('/assets/ai-learning.js?v=221'), 'Outdated learning controller: '+slug);
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
assert.equal(chapterCount,29,'Unexpected structured chapter count');
assert.equal(cardCount,333,'Unexpected number of retained flashcards');
assert.equal(questionCount,273,'Unexpected number of retained quiz questions');
for(const slug of ['analyse-financiere','marche-financier','comptabilite-approfondie']){
  assert(fs.existsSync(path.join('matieres',slug,'index.html')),'Missing upcoming subject');
}
const visual=fs.readFileSync('assets/studybfa-revision-v210.js','utf8');
assert(!visual.includes('MutationObserver'), 'Revision overlay must not replace real notes');
assert(!visual.includes('STUDY_BFA_SHEETS='),'Duplicate revision dataset must not be published');
console.log('Validated '+chapterCount+' chapters, '+cardCount+' flashcards, '+questionCount+' quiz questions.');

// Every multi-chapter subject must expose the compact, accessible chapter picker.
for(const slug of ['business-english','comptabilite-gestion','entrepreneuriat-business-plan','fiscalite','intelligence-artificielle','systeme-information-erp','tec']){
  const html=fs.readFileSync(path.join('matieres',slug,'index.html'),'utf8');
  assert(html.includes('studybfa-chapter-picker.js'), 'Missing chapter picker script: '+slug);
  assert(html.includes('studybfa-chapter-picker.css'), 'Missing chapter picker styles: '+slug);
  assert(html.includes('chapter-selector'), 'Missing original chapter controls: '+slug);
}
