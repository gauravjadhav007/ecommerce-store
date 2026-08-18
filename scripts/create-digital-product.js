const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "prisma", "dev.db"));

async function main() {
  const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get("social-media-starter-kit");
  if (existing) {
    console.log("Already exists:", existing.id);
    return;
  }

  let cat = db.prepare("SELECT id FROM categories WHERE slug = ?").get("digital-products");
  if (!cat) {
    const info = db.prepare("INSERT INTO categories (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, datetime('now'), datetime('now'))").run(crypto.randomUUID(), "Digital Products", "digital-products");
    cat = { id: info.lastInsertRowid ? crypto.randomUUID() : crypto.randomUUID() };
    db.prepare("UPDATE categories SET id = ? WHERE slug = ?").run(cat.id, "digital-products");
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
}

main().catch(console.error).finally(() => db.close());
