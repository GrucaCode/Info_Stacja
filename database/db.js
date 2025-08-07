import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Potrzebne do __dirname w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Połączenie z bazą
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite') // plik bazy
});

export default sequelize;