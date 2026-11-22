/* StudyBFA — unified academic course header. Presentation-only enhancement.
   Existing chapter selectors, click handlers, and downloadable resources are preserved. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.ai-main, main.be-main, main.subject-main');
    if (!main || main.querySelector('.sb-course-shell')) return;
    const hero = main.querySelector(':scope > .ai-hero, :scope > .intro.be-intro, :scope > .subject-intro');
    const video = main.querySelector(':scope > .sb-video-inline');
    if (!hero || !video) return;

    // The established chapter-picker enhancement runs before this listener.
    // Moving its existing nodes preserves select choices and all event handlers.
    const picker = main.querySelector(':scope > .sb-chapter-picker');

    const shell = document.createElement('section');
    shell.className = 'sb-course-shell';
    shell.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'عنوان المادة وأدوات التنقل' : 'Cours et navigation');

    const identity = document.createElement('div');
    identity.className = 'sb-course-identity';
    const logo = document.createElement('img');
    logo.src = '/assets/est-mark-only-transparent.png';
    logo.alt = 'EST Casablanca';
    logo.width = 36;
    logo.height = 36;
    logo.decoding = 'async';
    const brand = document.createElement('span');
    brand.textContent = 'STUDY BFA · ACADÉMIE';
    const school = document.createElement('span');
    school.className = 'sb-course-school';
    school.textContent = 'EST Casablanca';
    identity.append(logo, brand, school);

    const heading = document.createElement('div');
    heading.className = 'sb-course-heading';
    heading.append(identity, hero);

    const controls = document.createElement('div');
    controls.className = 'sb-course-controls';
    if (picker) controls.append(picker);
    else controls.classList.add('sb-course-controls--video-only');
    controls.append(video);

    main.insertBefore(shell, hero); // insert before moving hero into the shell
    shell.append(heading, controls);
    main.classList.add('sb-unified-course');
  });
})();
