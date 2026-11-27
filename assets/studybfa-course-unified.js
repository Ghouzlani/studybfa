/* StudyBFA course header — clean typographic layout, preserves existing learning controls. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.ai-main, main.be-main, main.subject-main');
    if (!main || main.querySelector('.sb-course-shell')) return;
    const hero = main.querySelector(':scope > .ai-hero, :scope > .intro.be-intro, :scope > .subject-intro');
    const video = main.querySelector(':scope > .sb-video-inline');
    if (!hero || !video) return;
    const picker = main.querySelector(':scope > .sb-chapter-picker');

    const shell = document.createElement('section');
    shell.className = 'sb-course-shell';
    shell.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'عنوان المادة وأدوات المراجعة' : 'En-tête du cours et navigation');
    main.insertBefore(shell, hero);

    const heading = document.createElement('div');
    heading.className = 'sb-course-heading';
    const identity = document.createElement('span');
    identity.className = 'sb-course-identity';
    identity.dir = 'ltr';
    identity.textContent = 'STUDY BFA · ACADÉMIE';
    heading.append(identity, hero);

    const controls = document.createElement('div');
    controls.className = 'sb-course-controls';
    if (picker) {
      const select = picker.querySelector('select');
      if (select && !picker.querySelector('.sb-course-select-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'sb-course-select-wrap';
        select.parentNode.insertBefore(wrap, select);
        wrap.append(select);
      }
      controls.append(picker);
    } else {
      controls.classList.add('sb-course-controls--video-only');
    }
    controls.append(video);
    shell.append(heading, controls);
    main.classList.add('sb-unified-course');
  });
})();

/* Préparer un signalement précis sans modifier le design ni envoyer automatiquement de message. */
document.addEventListener('DOMContentLoaded',()=>{
 const slug=document.body.dataset.matiere||'';
 const sem=slug==='institutions-politiques-maroc'?'S1':['culture-entrepreneuriale','management-organisations'].includes(slug)?'S2':'S3';
 const ar=slug==='institutions-politiques-maroc',en=slug==='business-english';
 document.querySelectorAll('a[href^="mailto:"]').forEach(link=>{
  const original=link.getAttribute('href').split('?')[0];
  function refresh(){
   const chapter=document.querySelector('[data-ai-chapter].active,[data-chapter].active');
   const title=chapter?.querySelector('span')?.textContent?.trim()||document.getElementById('ai-chapter-title')?.textContent?.trim()||'—';
   const current=document.querySelector('[data-ai-tab][aria-selected="true"],[data-tab][aria-selected="true"]');
   const resource=current?.textContent?.trim()||'—';
   const subject=document.querySelector('main h1')?.textContent?.trim()||slug;
   const heading=ar?'Study BFA — الإبلاغ عن خطأ':en?'Study BFA — Report a content error':'Study BFA — Signaler une erreur';
   const body=ar?['السلام عليكم،','','الفصل الدراسي: '+sem,'المادة: '+subject,'الفصل: '+title,'المورد: '+resource,'','وصف الخطأ: ','','التصحيح المقترح (إن وجد): '].join('\n'):en?['Hello,','','Semester: '+sem,'Subject: '+subject,'Chapter: '+title,'Resource: '+resource,'','Description of the error: ','','Suggested correction (if known): '].join('\n'):['Bonjour,','','Semestre : '+sem,'Matière : '+subject,'Chapitre : '+title,'Ressource : '+resource,'','Description de l’erreur : ','','Correction proposée (si connue) : '].join('\n');
   link.href=original+'?subject='+encodeURIComponent(heading)+'&body='+encodeURIComponent(body);
  }
  link.addEventListener('click',refresh);link.addEventListener('focus',refresh);link.addEventListener('pointerdown',refresh);refresh();
 });
});
