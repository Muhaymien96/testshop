const { sequelize, connect } = require('./index');
const ProductModel = require('../models/ProductModel');

async function sync() {
  if (!sequelize) {
    console.log('No DB configured (DATABASE_URL or DB_HOST not set).');
    process.exit(1);
  }
  try {
    await connect();
    await sequelize.sync({ alter: true });
    console.log('DB synced');
    process.exit(0);
  } catch (err) {
    console.error('DB sync failed', err);
    process.exit(1);
  }
}

sync();
