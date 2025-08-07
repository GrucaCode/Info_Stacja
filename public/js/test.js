  function test() {
    const topBar = document.querySelector('.bottom-nav-bar');
    const main = document.querySelector('.space');
    
    if (topBar && main) {
      const height = topBar.offsetHeight;
      console.log('BottomBar height:', height);
      main.style.height = height + 'px';
    }
  }

  // wywołaj przy starcie
  test();

  // wywołuj przy każdej zmianie rozmiaru czcionki
  const aaaFooter = document.querySelector('.data-first-aaa');
  if (aaaFooter) {
    aaaFooter.addEventListener('click', () => {
      setTimeout(test, 100); // czekamy chwilę aż zmieni się rozmiar
    });
  }

  // wywołuj też przy zmianie rozmiaru okna (np. orientacja mobilna)
  window.addEventListener('resize', test);
