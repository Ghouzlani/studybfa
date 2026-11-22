/* Management S2 — printable revision links, no missing static PDF. */
document.addEventListener('DOMContentLoaded',()=>{
 const link=document.getElementById('bfa-dynamic-pdf'),buttons=[...document.querySelectorAll('[data-ai-chapter]')];
 if(!link||!buttons.length)return;
 const choose=(i)=>{if(i<0||i>=buttons.length)return;link.hidden=false;link.href='/fiches/management-organisations/?chapitre='+(i+1);link.target='_blank';link.rel='noopener';link.removeAttribute('download');link.textContent='Ouvrir la fiche et enregistrer en PDF';};
 buttons.forEach((button,i)=>button.addEventListener('click',()=>choose(i)));
 choose(Math.max(0,buttons.findIndex(b=>b.classList.contains('active'))));
});