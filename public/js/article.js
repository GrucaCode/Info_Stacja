function textToBlocks(text, maxSen = 5) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const blocks = [];

  while (sentences.length) {
    blocks.push(sentences.splice(0, maxSen).join(" "));
  }

  return blocks;
} //dodane

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p>Nie znaleziono artykułu.</p>";
    return;
  }

  const articleJSON = localStorage.getItem(`article-${id}`);
  if (!articleJSON) {
    document.body.innerHTML = "<p>Artykuł wygasł lub nie istnieje.</p>";
    return;
  }

  const article = JSON.parse(articleJSON);
  const textBlocks = textToBlocks(article.text, 5); //DODANE

  document.querySelector(".data-news-title").textContent = article.title;
  document.querySelector(".data-news-author").textContent = article.author;
  document.querySelector(".data-publish-date").textContent = new Date(article.publish_date).toLocaleDateString('pl-PL');
  document.querySelector(".data-news-sum").textContent = article.summary;

  document.querySelector(".data-news-image").src = article.image;
  document.querySelector(".data-news-image").alt = article.title;
  document.querySelector(".data-news-text").innerHTML = textBlocks.map(b => `<p>${b}</p>`).join("");
  // document.querySelector(".article-text").textContent = article.text;
  document.querySelector(".btn-full").href = article.url;

  // od tego momentu!!
  const saveBtn = document.getElementById('save-article-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      try {
        const payload = {
          title: article.title,
          url: article.url,
          image: article.image,
          summary: article.text || '',
          publishedAt: article.publish_date || null
        };
        const r = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(payload)
        });

        if (r.status === 401) {
          alert('Zaloguj się, aby zapisać artykuł.');
          window.location.href = 'profile.html?view=login';
          return;
        } 
        const data = await r.json();
        if (data.success) {
          alert(data.message || 'Zapisano!');
        } else {
          alert(data.message || 'Nie udało się zapisać.');
        }
      } catch (e) {
        console.error(e);
        alert('Błąd zapisu.');
      }
    });
  }
});

