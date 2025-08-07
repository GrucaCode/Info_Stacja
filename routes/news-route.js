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

export default router;