// function textToBlocks(text, maxSen = 5) {
//   const sentences = text.split(/(?<=[.!?])\s+/);
//   const blocks = [];

//   while (sentences.length) {
//     blocks.push(sentences.splice(0, maxSen).join(" "));
//   }

//   return blocks;
// } //dodane

// document.addEventListener("DOMContentLoaded", () => {
//   const params = new URLSearchParams(window.location.search);
//   const id = params.get("id");

//   if (!id) {
//     document.body.innerHTML = "<p>Nie znaleziono artykułu.</p>";
//     return;
//   }

//   const articleJSON = localStorage.getItem(`article-${id}`);
//   if (!articleJSON) {
//     document.body.innerHTML = "<p>Artykuł wygasł lub nie istnieje.</p>";
//     return;
//   }

//   const article = JSON.parse(articleJSON);
//   const textBlocks = textToBlocks(article.text, 5); //DODANE

//   document.querySelector(".data-news-title").textContent = article.title;
//   document.querySelector(".data-news-author").textContent = article.author;
//   document.querySelector(".data-publish-date").textContent = new Date(article.publish_date).toLocaleDateString('pl-PL');
//   document.querySelector(".data-news-sum").textContent = article.summary;

//   document.querySelector(".data-news-image").src = article.image;
//   document.querySelector(".data-news-image").alt = article.title;
//   document.querySelector(".data-news-text").innerHTML = textBlocks.map(b => `<p>${b}</p>`).join("");
//   // document.querySelector(".article-text").textContent = article.text;
//   document.querySelector(".btn-full").href = article.url;

//   // od tego momentu!!
//   const saveBtn = document.getElementById('save-article-btn');
//   if (saveBtn) {
//     saveBtn.addEventListener('click', async () => {
//       try {
//         const payload = {
//           title: article.title,
//           url: article.url,
//           image: article.image,
//           summary: article.text || '',
//           publishedAt: article.publish_date || null
//         };
//         const r = await fetch('/api/saved', {
//           method: 'POST',
//           headers: { 'Content-Type':'application/json' },
//           body: JSON.stringify(payload)
//         });

//         if (r.status === 401) {
//           alert('Zaloguj się, aby zapisać artykuł.');
//           window.location.href = 'profile.html?view=login';
//           return;
//         } 
//         const data = await r.json();
//         if (data.success) {
//           alert(data.message || 'Zapisano!');
//         } else {
//           alert(data.message || 'Nie udało się zapisać.');
//         }
//       } catch (e) {
//         console.error(e);
//         alert('Błąd zapisu.');
//       }
//     });
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const params = new URLSearchParams(window.location.search);
//   const id = params.get("id");           // stary tryb: z localStorage
//   const savedId = params.get("savedId"); // nowy tryb: z bazy przez API

//   let article = null;

//   try {
//     if (savedId) {
//       // 🔹 Tryb zapisany w profilu – pobierz z backendu
//       const r = await fetch(`/api/saved/${encodeURIComponent(savedId)}`);
//       if (r.status === 401) {
//         // jeśli nie zalogowany → poproś o logowanie i wróć potem
//         window.location.href = 'profile.html?view=login';
//         return;
//       }
//       const data = await r.json();
//       if (!data.success || !data.item) throw new Error('Nie znaleziono zapisu');

//       const it = data.item;
//       article = {
//         title: it.title,
//         image: it.image,
//         url:   it.url,
//         text:  it.summary || '',
//         publish_date: it.publishedAt
//       };
//     } else if (id) {
//       // 🔹 Tryb „tymczasowy” – jak dotąd: z localStorage
//       const articleJSON = localStorage.getItem(`article-${id}`);
//       if (!articleJSON) throw new Error('Artykuł wygasł lub nie istnieje');
//       article = JSON.parse(articleJSON);
//     } else {
//       throw new Error('Brak identyfikatora artykułu');
//     }
//   } catch (e) {
//     document.body.innerHTML = `<p>${e.message}</p>`;
//     return;
//   }

//   // 🔻 render jak wcześniej
//   document.querySelector(".data-news-title").textContent = article.title;
//   const imgEl = document.querySelector(".data-news-image");
//   if (imgEl) {
//     imgEl.src = article.image || '';
//     imgEl.alt = article.title || '';
//   }
//   document.querySelector(".data-news-text").textContent = article.text || '';
//   const btnFull = document.querySelector(".btn-full");
//   if (btnFull) btnFull.href = article.url || '#';

//   // (opcjonalnie) jeśli chcesz tu mieć też „Zapisz”, zostaw mój poprzedni handler save-article-btn
//   if (savedId) {
//   const saveBtn = document.getElementById('save-article-btn');
//   saveBtn?.classList.add('hidden'); // albo disabled
//   }
// });


document.addEventListener("DOMContentLoaded", async () => {
  const qs = new URLSearchParams(location.search);
  const tmpId   = qs.get("id");        // tryb: localStorage
  const savedId = qs.get("savedId");   // tryb: zapisane z bazy

  // helper: bezpieczny selektor + pomocnicze formatery
  const $ = (sel) => document.querySelector(sel);
  const toPLDate = (d) => d ? new Date(d).toLocaleDateString("pl-PL") : "—";
  const splitIntoParagraphs = (text, maxSentencesPerPara = 4) => {
    if (!text) return [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paras = [];
    while (sentences.length) paras.push(sentences.splice(0, maxSentencesPerPara).join(" "));
    return paras;
  };
  const buildLead = (text, fallback = "") => {
    if (!text) return fallback || "";
    const firstTwo = text.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    return firstTwo || fallback || "";
  };

  let article = null;

  // ------------ pobieranie danych ------------
  try {
    if (savedId) {
      const r = await fetch(`/api/saved/${encodeURIComponent(savedId)}`);
      if (r.status === 401) {
        location.href = "profile.html?view=login";
        return;
      }
      const data = await r.json();
      if (!data.success || !data.item) throw new Error("Nie znaleziono zapisanego artykułu.");

      const it = data.item;
      article = {
        title: it.title || "",
        image: it.image || "",
        url:   it.url   || "#",
        text:  it.summary || "",        // w modelu zapisaliśmy 'summary' jako pełny tekst/skrócony
        publish_date: it.publishedAt || null,
        author: it.author || ""         // jeśli w przyszłości zaczniesz zapisywać autora
      };
    } else if (tmpId) {
      const raw = localStorage.getItem(`article-${tmpId}`);
      if (!raw) throw new Error("Artykuł wygasł lub nie istnieje.");
      article = JSON.parse(raw);
      // ujednolicenie potencjalnych różnic pól z API:
      article = {
        title: article.title || "",
        image: article.image || article.urlToImage || "",
        url:   article.url   || "#",
        text:  article.text  || article.content || article.description || "",
        publish_date: article.publish_date || article.publishedAt || null,
        author: article.author || ""
      };
    } else {
      throw new Error("Brak identyfikatora artykułu w URL.");
    }
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <main class="news"><div class="news__content">
        <p>${err.message}</p>
        <p><a href="index.html">← Wróć na stronę główną</a></p>
      </div></main>`;
    return;
  }

  // ------------ render do Twoich klas ------------
  const titleEl  = $(".data-news-title");
  const imgEl    = $(".data-news-image");
  const textEl   = $(".data-news-text");
  const sumEl    = $(".data-news-sum");
  const authorEl = $(".data-news-author");
  const dateEl   = $(".data-publish-date");
  const fullBtn  = $(".btn-full");
  const saveBtn  = $("#save-article-btn"); // jeśli masz przycisk zapisu na tej stronie

  if (titleEl)  titleEl.textContent = article.title || "";
  if (imgEl)   { imgEl.src = article.image || ""; imgEl.alt = article.title || ""; }
  if (authorEl) authorEl.textContent = article.author || "—";
  if (dateEl)   dateEl.textContent   = toPLDate(article.publish_date);

  // lead / podsumowanie
  const lead = article.summary || article.description || buildLead(article.text);
  if (sumEl) sumEl.textContent = lead;

  // pełny tekst → akapity (jeśli wolisz jeden blok, zamień na: textEl.textContent = article.text)
  if (textEl) {
    const paras = splitIntoParagraphs(article.text, 4);
    textEl.innerHTML = paras.map(p => `<p>${p}</p>`).join("");
  }

  if (fullBtn) fullBtn.href = article.url || "#";

  // ------------ zachowanie przycisku "Zapisz" ------------
  if (savedId && saveBtn) {
    // jesteśmy w trybie zapisanym → wyłącz „Zapisz”
    saveBtn.setAttribute("disabled", "true");
    saveBtn.style.opacity = " #616161";
  }

  if (!savedId && saveBtn) {
    // tryb tymczasowy → umożliw zapis do profilu
    saveBtn.addEventListener("click", async () => {
      saveBtn.disabled = true;
      try {
        const payload = {
          title: article.title,
          url: article.url,
          image: article.image,
          summary: article.text || "",
          publishedAt: article.publish_date || null
        };
        const r = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify(payload)
        });
        if (r.status === 401) {
          alert("Zaloguj się, aby zapisać artykuł.");
          location.href = "profile.html?view=login";
          return;
        }
        const data = await r.json();
        alert(data.success ? (data.message || "Zapisano!") : (data.message || "Nie udało się zapisać."));
      } catch (e) {
        console.error(e);
        alert("Błąd zapisu.");
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
});
