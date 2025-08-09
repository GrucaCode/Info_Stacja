document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchQuery');
  const searchBtn = document.querySelector('.search-btn');
  const micBtn = document.querySelector('.mic-btn');
  const micIcon = document.getElementById('mic-icon');
  const clearBtn = document.querySelector('.clean-btn');
  const resultSec = document.querySelector('.result-sec');

  // Helper: render wyników
  function renderResults(news = []) {
    // wyczyść poprzednie
    const old = resultSec.querySelector('.results');
    if (old) old.remove();

    const wrap = document.createElement('div');
    wrap.className = 'results';
    if (!news.length) {
      wrap.innerHTML = `<p>Nie znaleziono wyników dla podanego zapytania. Użyj innego słowa lub frazy</p><img src="img/Empty_graphics.svg" alt="Grafika informująca o braku wyników">`;
      // resultSec.appendChild(wrap);
      return;
    }

    // kafelki z wynikami
    news.forEach((article, idx) => {
      const card = document.createElement('article');
      card.className = 'result-card';
      const img = article.image ? `<img class="result-card__img" src="${article.image}" alt="${article.title}">` : '';
      const date = article.publish_date ? new Date(article.publish_date).toLocaleDateString('pl-PL') : '';
      const summary = article.summary;
      const artText =  article.text || '';

      // przycisk do Twojej podstrony artykułu (jak wcześniej)
      const tmpId = `${Date.now()}-${idx}`;
      const goLocalBtn = `
        <button class="btn-read-more" data-article-id="${tmpId}">
          <div class="btn-read-more__frame">Czytaj</div>
        </button>
      `;

      card.innerHTML = `
        ${img}
        <div class="result-card__content">
          <h3 class="result-card__title">${article.title}</h3>
            <div class="result-card__actions">
            ${goLocalBtn}
            </div>
          <img src="img/Menu line.svg" alt="linia dekoracyjna oddzielająca menu od tekstu" class="result-card__decor-line">
          <div class="result-card__info">
            <p class="result-card__label">Data:</p>
            <p class="result-card__date">${date}</p>
          </div>
        </div>
      `;

      // zapisz dane do localStorage, by article.html mógł je odczytać
      const payload = {
        id: tmpId,
        title: article.title,
        author: article.author,
        image: article.image,
        url: article.url,
        text: article.text || '',
        summary: article.summary, //dodane
        publish_date: article.publish_date,
      };
      localStorage.setItem(`article-${tmpId}`, JSON.stringify(payload));
      wrap.appendChild(card);
    });

    resultSec.appendChild(wrap);

    // Obsługa "Czytaj dalej" -> article.html?id=...
    wrap.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-article-id');
        window.location.href = `article.html?id=${encodeURIComponent(id)}`;
      });
    });
  }

  // Szukanie
  async function performSearch() {
    const q = input.value.trim();
    if (!q) {
      renderResults([]);
      return;
    }
    // opcjonalnie możesz dorzucić kategorie z UI i wysłać jako &categories=politics,technology...
    try {
      // loader (opcjonalnie)
      renderResults([]); 
      const r = await fetch(`/api/news/search?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (!data.success) {
        renderResults([]);
        return;
      }
      // WorldNews zwraca tablicę pod data.news
      renderResults(data.news || []);
    } catch (e) {
      console.error(e);
      renderResults([]);
    }
  }

  function renderResultsAfterClear(news = []) {
    const old = resultSec.querySelector('.results');
    if (old) old.remove();
    }

  // Zdarzenia
  searchBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  clearBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    input.value = '';
    // renderResults([]);
    renderResultsAfterClear([]);

  });

  // Wyszukiwanie głosowe (pl-PL)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (micBtn && SpeechRecognition) {
    const recog = new SpeechRecognition();
    recog.lang = 'pl-PL';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    let listening = false;

    micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!listening) {
        try {
          recog.start();
          listening = true;
          micIcon.textContent = 'settings_voice'; // zmień ikonę na "nagrywa"
        } catch (err) {
          console.error(err);
        }
      } else {
        recog.stop();
      }
    });

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      micIcon.textContent = 'mic';
      listening = false;
      performSearch();
    };

    recog.onerror = () => {
      micIcon.textContent = 'mic';
      listening = false;
      // tu możesz pokazać komunikat o błędzie
    };

    recog.onend = () => {
      micIcon.textContent = 'mic';
      listening = false;
    };
  } else if (micBtn) {
    // fallback, jeśli przeglądarka nie wspiera Web Speech API
    micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Wyszukiwanie głosowe nie jest wspierane w tej przeglądarce.');
    });
  }
});