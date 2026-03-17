const app = require('./app');
const sequelize = require('./config/database');
const { User, Project, Version } = require('./models'); // ensure associations loaded

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});