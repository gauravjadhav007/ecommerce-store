const Database = require("better-sqlite3");
const crypto = require("crypto");

const db = new Database("dev.db");

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", tables.map(t => t.name).join(", "));

// Check if products table has isDigital column
const cols = db.prepare("PRAGMA table_info(products)").all();
console.log("Product columns:", cols.map(c => c.name).join(", "));

// Insert product
const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get("social-media-starter-kit");
if (existing) {
  console.log("Already exists:", existing.id);
  db.close();
  return;
}

let cat = db.prepare("SELECT id FROM categories WHERE slug = ?").get("digital-products");
if (!cat) {
  const catId = crypto.randomUUID();
  db.prepare("INSERT INTO categories (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, datetime('now'), datetime('now'))").run(catId, "Digital Products", "digital-products");
  cat = { id: catId };
  console.log("Created category:", catId);
} else {
  console.log("Found category:", cat.id);
}

const id = crypto.randomUUID();
db.prepare("INSERT INTO products (id, name, slug, description, price, images, stock, isActive, featured, isDigital, categoryId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, '[]', 9999, 1, 1, 1, ?, datetime('now'), datetime('now'))").run(
  id,
  "Social Media Starter Kit",
  "social-media-starter-kit",
  "20 Instagram templates, 10 story templates, business spreadsheets, captions and content calendar.",
  39900,
  cat.id
);
console.log("Created product:", id);
db.close();
