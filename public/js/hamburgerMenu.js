// document.addEventListener('DOMContentLoaded', () => {
//     const menuBtn = document.querySelector('.topbar-btn__link--menu');
//     const menu = document.getElementById('hamburgerMenu');
//     const closeBtn = document.querySelector('.hamburger-menu__close-btn');
//     const hamburgerTutBtn = document.querySelector('.data-hamburger-tut');
//     const dropdownButtons = document.querySelectorAll('.drop-up-btn');
//     const borderBottom = document.querySelectorAll('.data-dropdown');
//     const body = document.body;

//     borderBottom.forEach(border => {
//         border.style.borderBottom = "none";
//     });

//     // Otwieranie menu
//     if (menuBtn) {
//         menuBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             menu.classList.add('active');
//             body.classList.add('no-scroll');
//         });
//     }

//     // Zamykanie menu
//     if (closeBtn) {
//         closeBtn.addEventListener('click', () => {
//             menu.classList.remove('active');
//             body.classList.remove('no-scroll');
//         });
//     }
//     if (hamburgerTutBtn) {
//       hamburgerTutBtn.addEventListener('click', () => {
//         menu.classList.remove('active');
//         body.classList.remove('no-scroll');
//       });
//     }

//     // Dropdowns
//     dropdownButtons.forEach((btn) => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();

//             const clickedDropdown = btn.closest('.dropdown');
//             const isAlreadyOpen = clickedDropdown.classList.contains('open');

//             document.querySelectorAll('.dropdown.open').forEach(dropdown => {
//                 dropdown.classList.remove('open');
//                 const text = dropdown.querySelector('.drop-up-btn__text');
//                 const icon = dropdown.querySelector('.drop-up-btn__arrow');
//                 if (text) text.textContent = 'rozwiń';
//                 if (icon) icon.textContent = 'arrow_drop_down';
//             });

//             if (!isAlreadyOpen) {
//                 clickedDropdown.classList.add('open');
//                 const text = btn.querySelector('.drop-up-btn__text');
//                 const icon = btn.querySelector('.drop-up-btn__arrow');
//                 if (text) text.textContent = 'zwiń';
//                 if (icon) icon.textContent = 'arrow_drop_up';
//             }

//             borderBottom.forEach(border => {
//                 border.style.borderBottom = "none";
//             });
//         });
//     });
// });

// // Użytkownik zalogowany - wyświetla się wyloguj
// // Użytkownik niezalogowany - wyświetla się zarejstruj się i zaloguj się
// fetch('/api/me')
//   .then(res => res.json())
//   .then(data => {
//     const logoutItem = document.querySelector('.logout-item');
//     const authItems = document.querySelectorAll('.auth-only');

//     if (data.loggedIn) {
//       logoutItem.style.display = 'block';
//       authItems.forEach(el => el.style.display = 'none');
//     } else {
//       logoutItem.style.display = 'none';
//       authItems.forEach(el => el.style.display = 'block');
//     }
//   });

// document.addEventListener('click', async (e) => {
//   if (e.target.id === 'logout-btn') {
//     e.preventDefault();
//     await fetch('/api/logout', { method: 'POST' });
//     location.href = 'index.html';
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn         = document.querySelector('.topbar-btn__link--menu');
  const menu            = document.getElementById('hamburgerMenu');
  const closeBtn        = document.querySelector('.hamburger-menu__close-btn');
  const hamburgerTutBtn = document.querySelector('.data-hamburger-tut');
  const dropdownButtons = document.querySelectorAll('.drop-up-btn');
  const borderBottom    = document.querySelectorAll('.data-dropdown');
  const body            = document.body;

  // defensywnie
  borderBottom.forEach(border => { if (border) border.style.borderBottom = "none"; });

  // Otwieranie menu
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.add('active');
      body.classList.add('no-scroll');
    });
  }

  // Zamykanie menu
  if (closeBtn && menu) {
    closeBtn.addEventListener('click', () => {
      menu.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  }

  if (hamburgerTutBtn && menu) {
    hamburgerTutBtn.addEventListener('click', () => {
      menu.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  }

  // Dropdowny
  dropdownButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const clickedDropdown = btn.closest('.dropdown');
      if (!clickedDropdown) return;

      const isAlreadyOpen = clickedDropdown.classList.contains('open');

      document.querySelectorAll('.dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
        const text = dropdown.querySelector('.drop-up-btn__text');
        const icon = dropdown.querySelector('.drop-up-btn__arrow');
        if (text) text.textContent = 'rozwiń';
        if (icon) icon.textContent = 'arrow_drop_down';
      });

      if (!isAlreadyOpen) {
        clickedDropdown.classList.add('open');
        const text = btn.querySelector('.drop-up-btn__text');
        const icon = btn.querySelector('.drop-up-btn__arrow');
        if (text) text.textContent = 'zwiń';
        if (icon) icon.textContent = 'arrow_drop_up';
      }

      borderBottom.forEach(border => { if (border) border.style.borderBottom = "none"; });
    });
  });

  // 🔐 Aktualizacja pozycji w menu wg stanu logowania – bezpiecznie
  updateAuthMenu(); // wywołaj po DOMContentLoaded
});

// osobno, żeby można było wołać też z innych miejsc
async function updateAuthMenu() {
  try {
    const res = await fetch('/api/me', { headers: { 'Accept': 'application/json' } });
    const data = await res.json();

    const logoutItem = document.querySelector('.logout-item');
    const authItems  = document.querySelectorAll('.auth-only');

    // jeśli na danej stronie nie ma tych elementów, nic nie rób
    if (!logoutItem && authItems.length === 0) return;

    if (data.loggedIn) {
      if (logoutItem) logoutItem.style.display = 'block';
      authItems.forEach(el => { el.style.display = 'none'; });
    } else {
      if (logoutItem) logoutItem.style.display = 'none';
      authItems.forEach(el => { el.style.display = 'block'; });
    }
  } catch (e) {
    console.warn('updateAuthMenu failed:', e);
  }
}

// globalny listener do wylogowania – też defensywnie
document.addEventListener('click', async (e) => {
  const target = e.target.closest('#logout-btn');
  if (!target) return;
  e.preventDefault();
  await fetch('/api/logout', { method: 'POST' });
  location.href = 'index.html';
});
