/* Management: direct PDF download bound to the selected revision unit. */
document.addEventListener('DOMContentLoaded',()=>{
 const link=document.getElementById('bfa-dynamic-pdf'),buttons=[...document.querySelectorAll('[data-ai-chapter]')];
 if(!link||!buttons.length)return;
 const choose=i=>{if(i<0||i>=buttons.length)return;link.hidden=false;link.href='/fiches/revision?matiere=management-organisations&chapitre='+(i+1);link.setAttribute('download','StudyBFA-Management-Chapitre-'+(i+1)+'.pdf');link.removeAttribute('target');link.textContent='↓ Télécharger la fiche de révision (PDF)';};
 buttons.forEach((button,i)=>button.addEventListener('click',()=>choose(i)));
 choose(Math.max(0,buttons.findIndex(b=>b.classList.contains('active'))));
});
