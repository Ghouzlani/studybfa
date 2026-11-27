/* StudyBFA PDF links: deterministic chapter selection; Arabic summary has its own printable URL. */
(()=>{'use strict';
const VERSION='20261127-audit';
document.addEventListener('DOMContentLoaded',()=>{
 const a=document.getElementById('bfa-dynamic-pdf');
 if(!a)return;
 const slug=document.body.dataset.matiere;
 const buttons=[...document.querySelectorAll('[data-ai-chapter]')];
 const chapters=window.STUDY_BFA_AI;
 if(!Array.isArray(chapters)||!chapters.length||!buttons.length){a.hidden=true;return;}
 function selectedIndex(){
  const select=document.querySelector('.sb-chapter-picker select');
  if(select&&select.value!==''){
   const i=Number(select.value);
   if(Number.isInteger(i)&&i>=0&&i<chapters.length)return i;
  }
  return buttons.findIndex(b=>b.classList.contains('active')||b.getAttribute('aria-pressed')==='true');
 }
 function setLink(i){
  const chapter=chapters[i];
  if(!chapter||!Array.isArray(chapter.notes)||!chapter.notes.length){a.hidden=true;return;}
  a.hidden=false;
  a.dataset.chapterIndex=String(i);
  if(slug==='institutions-politiques-maroc'){
   const location=chapter.kind==='summary'
    ? '/fiches/institutions-politiques-maroc/synthese/'
    : '/fiches/institutions-politiques-maroc/?chapitre='+(i+1);
   a.href=location+(location.includes('?')?'&':'?')+'v='+VERSION;
   a.textContent=chapter.kind==='summary'
    ? 'فتح الملخص الشامل وحفظه بصيغة PDF'
    : 'فتح ملخص الفصل وحفظه بصيغة PDF';
   a.removeAttribute('download');a.target='_blank';a.rel='noopener';
  }else{
   // One source for the on-screen sheet and the downloadable PDF.
   a.href='/fiches/revision?matiere='+encodeURIComponent(slug)+'&chapitre='+(i+1);
   a.textContent='↓ Télécharger la fiche de révision (PDF)';
   a.setAttribute('download','StudyBFA-'+slug+'-fiche-'+(i+1)+'.pdf');
   a.removeAttribute('target');

  }
 }
 buttons.forEach((button,i)=>button.addEventListener('click',()=>setLink(i)));
 document.addEventListener('change',event=>{
  if(event.target.matches('.sb-chapter-picker select'))setLink(Number(event.target.value));
 });
 a.addEventListener('pointerdown',()=>{const i=selectedIndex();if(i>=0)setLink(i)});
 a.addEventListener('click',()=>{const i=selectedIndex();if(i>=0)setLink(i)});
 let start=selectedIndex();
 setLink(start>=0?start:0);
});
})();