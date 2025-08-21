document.addEventListener('DOMContentLoaded', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micSupported = !!SpeechRecognition;

  function startVoiceTutorial() {
    const steps = [
      { element: document.querySelector('.mic-btn'),
        intro: `Kliknij w mikrofon i powiedz co chcesz wyszukać.`,
        position: 'bottom' },
      { element: document.querySelector('#searchQuery'),
        intro: `To co powiedziałaś/eś pojawi się w tym miejscu.`,
        position: 'bottom' },
      { element: document.querySelector('.search-btn'),
        intro: `Kliknij w przycisk lupy lub wciśnij Enter, aby wyszukać podane słowo lub zdanie.`,
        position: 'bottom' },
      { element: document.querySelector('.data-clean-btn'),
        intro: `Klikając w ten przycisk możesz wyczyścić pole wyszukiwania`,
        position: 'bottom' },
      { element: document.querySelector('.result-sec'),
        intro: `Wyniki wyszukiwania pojawią się tutaj.`, position: 'top' }
    ];
    introJs().setOptions({
      steps, nextLabel:'Dalej', prevLabel:'Wstecz', doneLabel:'Zakończ', skipLabel:'Pomiń',
      showProgress:true, showBullets:false
    }).start();
  }

  const pending = (() => { try { return localStorage.getItem('pendingTutorial'); } catch { return null; } })();
  if (pending === 'voice') {
    if (!micSupported) {
      alert('Wyszukiwanie głosowe nie jest wspierane w tej przeglądarce');
    } else {
      startVoiceTutorial();
    }
    try { localStorage.removeItem('pendingTutorial'); } catch {}
  }
});