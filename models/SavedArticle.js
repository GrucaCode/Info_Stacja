import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import User from './User.js';

const SavedArticle = sequelize.define('SavedArticle', {
  title:       { type: DataTypes.STRING, allowNull: false },
  url:         { type: DataTypes.STRING, allowNull: false },
  image:       { type: DataTypes.STRING },
  summary:     { type: DataTypes.TEXT },
  publishedAt: { type: DataTypes.DATE }
});

User.hasMany(SavedArticle, { foreignKey: 'userId', onDelete: 'CASCADE' });
SavedArticle.belongsTo(User, { foreignKey: 'userId' });

export default SavedArticle;