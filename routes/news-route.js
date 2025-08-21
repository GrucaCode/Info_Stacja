import express from 'express';
import fetch from 'node-fetch';
import { apiKey } from './secret.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const url = `https://api.worldnewsapi.com/search-news?source-country=pl&language=pl&categories=politics,sports,business&sort=publish-time&sort-direction=DESC&number=5&api-key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Błąd API:', error);
    res.status(500).json({ error: 'Nie udało się pobrać wiadomości' });
  }
});

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  const categories = (req.query.categories || '').trim();
  if (!q) return res.status(400).json({ success: false, message: 'Brak zapytania q' });

  const params = new URLSearchParams({
    'text': q,
    'language': 'pl',
    'source-country': 'pl',
    'number': '10',
    'sort': 'publish-time',
    'sort-direction': 'DESC',
    'api-key': apiKey,
  });

  if (categories) params.set('categories', categories);

  const url = `https://api.worldnewsapi.com/search-news?${params.toString()}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json({ success: true, ...data });
  } catch (e) {
    console.error('Search API error:', e);
    res.status(500).json({ success: false, message: 'Nie udało się pobrać wyników' });
  }
});

export default router;