import express from 'express';
import SavedArticle from '../models/SavedArticle.js';

const router = express.Router();

// middleware
function requireAuth(req, res, next) {
  if (!req.session?.user) return res.status(401).json({ success:false, message:'Musisz być zalogowany' });
  next();
}

// zapisywanie artykułu
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, url, image, summary, publishedAt } = req.body;
    if (!title || !url) return res.status(400).json({ success:false, message:'Brak wymaganych pól' });

    const existing = await SavedArticle.findOne({ where: { userId: req.session.user.id, url } });
    if (existing) return res.status(200).json({ success:true, message:'Już zapisane' });

    const saved = await SavedArticle.create({
      userId: req.session.user.id,
      title, url, image: image || null,
      summary: summary || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null
    });

    res.status(201).json({ success:true, item: saved });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Błąd zapisu' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const sort = (req.query.sort || 'newest');
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    const items = await SavedArticle.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', order]]
    });
    res.json({ success:true, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Błąd pobierania listy' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await SavedArticle.destroy({
      where: { id, userId: req.session.user.id }
    });
    if (!rows) return res.status(404).json({ success:false, message:'Nie znaleziono' });
    res.json({ success:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Błąd usuwania' });
  }
});

export default router;
