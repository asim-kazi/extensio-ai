const { Sequelize } = require('sequelize');
const path = require('path');

// Tell dotenv to look two folders up from the current directory (src/config -> src -> backend)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Keeps your terminal clean from long SQL queries
  },
);

module.exports = sequelize;
