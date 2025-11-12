const fs = require("fs");
const path = require("path");

// Prefer database-backed model when available
let ProductModel = null;
try {
  ProductModel = require('./ProductModel');
} catch (e) {
  ProductModel = null;
}

const dataPath = path.join(__dirname, "../data/products.json");

function _getAllFromJson() {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

async function getAll() {
  if (ProductModel) {
    try {
      return await ProductModel.findAll({ raw: true });
    } catch (e) {
      // fallback to JSON
      return _getAllFromJson();
    }
  }
  return _getAllFromJson();
}

async function getById(id) {
  if (ProductModel) {
    try {
      const p = await ProductModel.findByPk(id);
      return p ? p.get({ plain: true }) : null;
    } catch (e) {
      return _getAllFromJson().find((p) => p.id === parseInt(id));
    }
  }
  return _getAllFromJson().find((p) => p.id === parseInt(id));
}

async function getCategories() {
  if (ProductModel) {
    try {
      const rows = await ProductModel.findAll({ attributes: ['category'], group: ['category'], raw: true });
      return rows.map(r => r.category).filter(Boolean);
    } catch (e) {
      return [...new Set(_getAllFromJson().map((p) => p.category))];
    }
  }
  return [...new Set(_getAllFromJson().map((p) => p.category))];
}

module.exports = { getAll, getById, getCategories };
