
const goUpBtn = document.querySelector('.data-btn-go-up');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        goUpBtn.classList.add('visible');
    } else {
      goUpBtn.classList.remove('visible');
    }
});
