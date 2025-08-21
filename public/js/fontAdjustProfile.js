const fontToggles = document.querySelectorAll('.data-aaa');
const aIcons = document.querySelector('.data-icon-a-plus');
const sortForm = document.querySelector('#sort-form');
const selectSort = document.querySelector('#sort');
const emailData = document.querySelector('.user-data__value--email');
const html = document.documentElement;

let currentSize = 1;
const minSize = 1; 
const maxSize = 2;

fontToggles.forEach((fontToggle) => {
  fontToggle.addEventListener('click', (e) => {
    e.preventDefault();

    if (currentSize === 1) {
      currentSize = 1.5;
      sortForm.classList.add('sort-form-font-increase');
      selectSort.classList.add('select-font-increase');
    } else if (currentSize === 1.5) {
      currentSize = 2;
      sortForm.classList.add('sort-form-font-increase');
      selectSort.classList.add('select-font-increase');
      emailData.style.maxWidth = "300px";
      emailData.style.overflowWrap = "break-word"; 

    } else {
      currentSize = 1;
      sortForm.classList.remove('sort-form-font-increase');
      selectSort.classList.remove('select-font-increase');
    }

    html.style.fontSize = currentSize + 'rem';

    document.querySelectorAll('.data-icon-a-plus').forEach(icon => {
      icon.textContent = currentSize === 2 ? 'text_decrease' : 'text_increase';
    });
  });
});