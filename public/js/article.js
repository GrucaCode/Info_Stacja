document.addEventListener("DOMContentLoaded", async () => {
  const qs = new URLSearchParams(location.search);
  const tmpId   = qs.get("id");        // localStorage
  const savedId = qs.get("savedId");   // zapisane wiadomości w bazie

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

  // Pobieranie danych z artykułu 
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
        text:  it.summary || "",
        publish_date: it.publishedAt || null,
        author: it.author || ""
      };
    } else if (tmpId) {
      const raw = localStorage.getItem(`article-${tmpId}`);
      if (!raw) throw new Error("Artykuł wygasł lub nie istnieje.");
      article = JSON.parse(raw);
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

  const titleEl  = $(".data-news-title");
  const imgEl    = $(".data-news-image");
  const textEl   = $(".data-news-text");
  const sumEl    = $(".data-news-sum");
  const authorEl = $(".data-news-author");
  const dateEl   = $(".data-publish-date");
  const fullBtn  = $(".btn-full");
  const saveBtn  = $("#save-article-btn");

  if (titleEl)  titleEl.textContent = article.title || "";
  if (imgEl)   { imgEl.src = article.image || ""; imgEl.alt = article.title || ""; }
  if (authorEl) authorEl.textContent = article.author || "—";
  if (dateEl)   dateEl.textContent   = toPLDate(article.publish_date);

  const lead = article.summary || article.description || buildLead(article.text);
  if (sumEl) sumEl.textContent = lead;

  // dzielenie tekstu na akapity
  if (textEl) {
    const paras = splitIntoParagraphs(article.text, 5);
    textEl.innerHTML = paras.map(p => `<p>${p}</p>`).join("");
  }

  if (fullBtn) fullBtn.href = article.url || "#";

  // Przycisk zapisz wiadomość - dezaktywuje się jeśli wiadomość została zapisana
  if (savedId && saveBtn) {
    saveBtn.setAttribute("disabled", "true");
    saveBtn.style.opacity = " #616161";
  }

  // Zapisywanie artykułu do profilu
  if (!savedId && saveBtn) {
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
