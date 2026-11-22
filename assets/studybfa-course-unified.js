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
