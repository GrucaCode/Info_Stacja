document.addEventListener('DOMContentLoaded', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micSupported = !!SpeechRecognition;

  async function waitForStableLayout() {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() :
      new Promise(res => { img.addEventListener('load', res, {once:true}); img.addEventListener('error', res, {once:true}); })
    ));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  function startVoiceTutorial() {
    const steps = [
      { element: document.querySelector('.mic-btn'),
        intro: 'Kliknij w mikrofon i powiedz co chcesz wyszukać.', position: 'top' },
      { element: document.querySelector('#searchQuery'),
        intro: 'To co powiedziałaś/eś pojawi się w tym miejscu.', position: 'bottom' },
      { element: document.querySelector('.search-btn'),
        intro: 'Kliknij w przycisk lupy lub wciśnij Enter, aby wyszukać…', position: 'bottom' },
      { element: document.querySelector('.data-clean-btn'),
        intro: 'Tym przyciskiem wyczyścisz pole wyszukiwania.', position: 'bottom' },
      { element: document.querySelector('.result-sec'),
        intro: 'Wyniki pojawią się tutaj.', position: 'top' }
    ];

    const intro = introJs().setOptions({
      steps,
      nextLabel:'Dalej', prevLabel:'Wstecz', doneLabel:'Zakończ', skipLabel:'Pomiń',
      showProgress:true, showBullets:false,
      scrollTo:true, scrollToElement:true
    });

    const refresh = () => intro.refresh();
    intro.onafterchange(refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    intro.start();
  }

  const pending = (() => { try { return localStorage.getItem('pendingTutorial'); } catch { return null; } })();

  (async () => {
    if (pending === 'voice') {
      if (!micSupported) {
        alert('Wyszukiwanie głosowe nie jest wspierane w tej przeglądarce');
      } else {
        await waitForStableLayout();
        startVoiceTutorial();
      }
      try { localStorage.removeItem('pendingTutorial'); } catch {}
    }
  })();
});