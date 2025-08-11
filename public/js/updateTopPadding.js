  function updateTopPadding() {
    const topBar = document.querySelector('.top-bar');
    const main = document.querySelector('.hero');
    
    if (topBar && main) {
      const height = topBar.offsetHeight;
      console.log('TopBar height:', height);
      main.style.marginTop = height + 'px';
    }
  }

  updateTopPadding();

  const aaa = document.querySelector('.data-first-aaa');
  if (aaa) {
    aaa.addEventListener('click', () => {
      setTimeout(updateTopPadding, 100);
    });
  }
  window.addEventListener('resize', updateTopPadding);
