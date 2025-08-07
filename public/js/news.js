document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/news')
    .then(res => res.json())
    .then(data => {
      const articles = data.news;
      if (!articles || !articles.length) return;

      const slidesContainer = document.querySelector('.slider__slides');
      const dotsContainer = document.querySelector('.slider__dots');

      let currentIndex = 0;

      // 🔁 Dodaj slajdy i kropki
      articles.forEach((article, index) => {
        const slide = document.createElement('div');
        slide.classList.add('article');
        slide.style.display = index === 0 ? 'block' : 'none';

        slide.innerHTML = `
          <div class="article__image-container">
            <img src="${article.image}" alt="${article.title}" class="article__image">
          </div>
          <div class="article__content">
            <div class="article__text">
              <h3 class="article__title">${article.title}</h3>
              <p class="article__sum">${article.summary || ''}</p>
            </div>
            <button class="btn-read-more">
              <div class="btn-read-more__frame">Czytaj dalej</div>
            </button>
            <img src="img/Menu line.svg" alt="linie" class="article__line">
            <div class="date">
              <p class="date__label">Data:</p>
              <p class="date__text">${new Date(article.publish_date).toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
        `;
        slidesContainer.appendChild(slide);

        slide.querySelector('.btn-read-more').addEventListener('click', () => {
          const articleData = {
            title: article.title,
            author: article.author,
            publish_date: article.publish_date,
            summary: article.summary,
            image: article.image,
            text: article.text,
            url: article.url
          };
          localStorage.setItem(`article-${index}`, JSON.stringify(articleData));
          window.location.href = `article.html?id=${index}`;
        });

        // 🔘 Dodaj kropki
        const dot = document.createElement('i');
        dot.className = 'material-icons-outlined slider__dot';
        dot.textContent = index === 0 ? 'radio_button_checked' : 'brightness_1';
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
      });

      const slides = document.querySelectorAll('.article');
      const dots = document.querySelectorAll('.slider__dot');

      // ▶ Funkcja zmiany slajdu
      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? 'block' : 'none';
          dots[i].textContent = i === index ? 'radio_button_checked' : 'brightness_1';
        });
        currentIndex = index;
      }

      // ◀/▶ Obsługa strzałek
      document.querySelector('.slider-nav__arrow--next').addEventListener('click', () => {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
      });

      document.querySelector('.slider-nav__arrow--prev').addEventListener('click', () => {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prev);
      });

      // 🔘 Obsługa kliknięcia w kropkę
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index);
          showSlide(index);
        });
      });
    });
});