/* StudyBFA compact chapter picker: enhances the existing chapter buttons without changing their controllers. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.chapter-selector').forEach(group => {
    const buttons = Array.from(group.querySelectorAll('button.chapter-choice'));
    if (!buttons.length || group.dataset.pickerReady) return;
    group.dataset.pickerReady = 'true';
    const wrapper = document.createElement('div');
    wrapper.className = 'sb-chapter-picker';
    const label = document.createElement('label');
    const select = document.createElement('select');
    const id = 'sb-chapter-select-' + Math.random().toString(36).slice(2, 8);
    select.id = id;
    label.htmlFor = id;
    const slug=document.body.dataset.matiere;
    const pickerLabel=slug==='institutions-politiques-maroc'?'اختر الفصل':slug==='business-english'?'Choose a chapter':'Choisir un chapitre';
    label.textContent = pickerLabel;
    select.setAttribute('aria-label', pickerLabel);
    buttons.forEach((button, index) => {
      const option = document.createElement('option');
      const number = button.querySelector('b')?.textContent?.trim() || (slug==='institutions-politiques-maroc'?'الفصل ':slug==='business-english'?'Chapter ':'Chapitre ') + (index+1);
      const title = button.querySelector('span')?.textContent?.trim() || button.textContent.trim();
      option.value = String(index);
      option.textContent = number + ' — ' + title;
      select.append(option);
    });
    const sync = () => {
      const active = buttons.findIndex(button => button.classList.contains('active') || button.getAttribute('aria-pressed') === 'true');
      if (active >= 0) select.value = String(active);
    };
    select.addEventListener('change', () => {
      const button = buttons[Number(select.value)];
      if (button) {
        button.click();
        sync();
      }
    });
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      select.value = String(index);
    }));
    wrapper.append(label, select);
    group.before(wrapper);
    sync();
    group.classList.add('sb-chapter-buttons-hidden');
  });
});
