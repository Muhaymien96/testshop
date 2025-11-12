const fs = require('fs');
const path = require('path');
const { connect, sequelize } = require('../src/db');
const ProductModel = require('../src/models/ProductModel');

async function seed() {
  if (!sequelize) {
    console.error('No DB configured. Set DATABASE_URL or DB_HOST/DB_USER/DB_PASS/DB_NAME');
    process.exit(1);
  }
  await connect();
  try {
    const dataPath = path.join(__dirname, '../src/data/products.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(raw);

    await sequelize.sync();

    for (const p of products) {
      await ProductModel.upsert({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.stock,
        image: p.image,
        description: p.description,
        sku: p.sku,
      });
    }

    console.log('Seeded products');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
