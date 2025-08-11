import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import newsRoutes from './routes/news-route.js';
import authRoutes from './routes/auth-route.js';
import savedRoutes from './routes/saved-route.js';

import sequelize from './database/db.js';
import User from './models/User.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'super-tajne-haslo',
  resave: false,
  saveUninitialized: false
}));

// front-end
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/news', newsRoutes);
app.use('/api', authRoutes);
app.use('/api/saved', savedRoutes);

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Połączono z bazą i zsynchronizowano modele.');
  } catch (err) {
    console.error('Błąd połączenia z bazą danych:', err);
  }
})();