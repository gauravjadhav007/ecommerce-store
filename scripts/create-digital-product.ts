import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.product.findUnique({ where: { slug: "social-media-starter-kit" } });
  if (existing) {
    console.log("Already exists:", existing.id);
    return;
  }

  let cat = await prisma.category.findFirst({ where: { slug: "digital-products" } });
  if (!cat) {
    cat = await prisma.category.create({ data: { name: "Digital Products", slug: "digital-products" } });
  }

  const p = await prisma.product.create({
    data: {
      name: "Social Media Starter Kit",
      slug: "social-media-starter-kit",
      description: "20 Instagram templates, 10 story templates, business spreadsheets, captions and content calendar.",
      price: 39900,
      isDigital: true,
      stock: 9999,
      isActive: true,
      featured: true,
      categoryId: cat.id,
      images: "[]",
    },
  });

  console.log("Created product:", p.id);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
