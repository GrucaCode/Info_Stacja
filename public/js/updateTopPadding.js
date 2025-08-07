  function updateTopPadding() {
    const topBar = document.querySelector('.top-bar');
    const main = document.querySelector('.hero');
    
    if (topBar && main) {
      const height = topBar.offsetHeight;
      console.log('TopBar height:', height);
      main.style.marginTop = height + 'px';
    }
  }

  // wywołaj przy starcie
  updateTopPadding();

  // wywołuj przy każdej zmianie rozmiaru czcionki
  const aaa = document.querySelector('.data-first-aaa');
  if (aaa) {
    aaa.addEventListener('click', () => {
      setTimeout(updateTopPadding, 100); // czekamy chwilę aż zmieni się rozmiar
    });
  }

  // wywołuj też przy zmianie rozmiaru okna (np. orientacja mobilna)
  window.addEventListener('resize', updateTopPadding);
