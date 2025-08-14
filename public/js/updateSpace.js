  function updateSpace() {
    const topBar = document.querySelector('.bottom-nav-bar');
    const main = document.querySelector('.space');
    
    if (topBar && main) {
      const height = topBar.offsetHeight;
      console.log('BottomBar height:', height);
      main.style.height = height + 'px';
    }
  }

  updateSpace();

  const aaaFooter = document.querySelector('.data-first-aaa');
  if (aaaFooter) {
    aaaFooter.addEventListener('click', () => {
      setTimeout(updateSpace, 100);
    });
  }

  window.addEventListener('resize', updateSpace);
