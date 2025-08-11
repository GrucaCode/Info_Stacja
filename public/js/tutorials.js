document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('tutorials-modal');
  const dialog = modal?.querySelector('.tuts__dialog');
  if (!modal || !dialog) return;

  const OPENERS = document.querySelectorAll('.js-open-tutorials');
  const CLOSERS = modal.querySelectorAll('.data-close-pop-up-btn');
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    dialog.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocused?.focus();
  }

  OPENERS.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openModal(); }));
  CLOSERS.forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (modal.getAttribute('aria-hidden') === 'false' && e.key === 'Escape') closeModal();
  });

  const routes = {
    voice:      { href: 'search.html',   flag: 'voice' }
  };

  modal.addEventListener('click', (e) => {
    const btn = e.target.closest('.tuts__btn');
    if (!btn) return;
    const key = btn.getAttribute('data-tutorial');
    const conf = routes[key];
    if (!conf) return;

    try { localStorage.setItem('pendingTutorial', conf.flag); } catch {}
    window.location.href = conf.href;
  });
});
