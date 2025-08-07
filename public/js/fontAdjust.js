const fontToggles = document.querySelectorAll('.data-aaa');
const aIcons = document.querySelector('.data-icon-a-plus');
const html = document.documentElement;

let currentSize = 1; // rem
const minSize = 1;   // 100%
const maxSize = 2;   // 200%

fontToggles.forEach((fontToggle) => {
  fontToggle.addEventListener('click', (e) => {
    e.preventDefault();

    if (currentSize === 1) {
      currentSize = 1.5;
    } else if (currentSize === 1.5) {
      currentSize = 2;
    } else {
      currentSize = 1;
    }

    html.style.fontSize = currentSize + 'rem';

    // zmień ikonę we wszystkich przyciskach
    document.querySelectorAll('.data-icon-a-plus').forEach(icon => {
      icon.textContent = currentSize === 2 ? 'text_decrease' : 'text_increase';
    });
  });
});