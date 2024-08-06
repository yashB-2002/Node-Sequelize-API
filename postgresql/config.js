const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('users', process.env.DB_NAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
