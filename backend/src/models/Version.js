const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Version = sequelize.define('Version', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  projectId: { type: DataTypes.UUID, allowNull: false },
  prompt: { type: DataTypes.TEXT, allowNull: false },
  files: { type: DataTypes.JSONB, allowNull: false },
  zipUrl: { type: DataTypes.STRING },
  versionNumber: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Version;