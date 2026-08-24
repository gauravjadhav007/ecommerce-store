import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const clothing = await prisma.category.create({
    data: { name: "Clothing", slug: "clothing" },
  });
  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics" },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories" },
  });
  const home = await prisma.category.create({
    data: { name: "Home & Kitchen", slug: "home-kitchen" },
  });

  const shirt = await prisma.product.create({
    data: {
      name: "Cotton Round Neck T-Shirt",
      slug: "cotton-round-neck-tshirt",
      description: "Premium 100% cotton round neck t-shirt. Comfortable for daily wear. Available in multiple colors.",
      price: 49900,
      compareAt: 79900,
      images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]),
      stock: 100,
      sku: "CLK-001",
      featured: true,
      categoryId: clothing.id,
    },
  });
  await prisma.variant.createMany({
    data: [
      { name: "S", price: 49900, stock: 25, productId: shirt.id },
      { name: "M", price: 49900, stock: 30, productId: shirt.id },
      { name: "L", price: 49900, stock: 25, productId: shirt.id },
      { name: "XL", price: 54900, stock: 20, productId: shirt.id },
    ],
  });

  const jeans = await prisma.product.create({
    data: {
      name: "Slim Fit Denim Jeans",
      slug: "slim-fit-denim-jeans",
      description: "Modern slim fit jeans with stretch comfort. Perfect for casual outings.",
      price: 129900,
      compareAt: 199900,
      images: JSON.stringify(["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"]),
      stock: 60,
      sku: "CLK-002",
      featured: true,
      categoryId: clothing.id,
    },
  });
  await prisma.variant.createMany({
    data: [
      { name: "28", price: 129900, stock: 15, productId: jeans.id },
      { name: "30", price: 129900, stock: 20, productId: jeans.id },
      { name: "32", price: 129900, stock: 15, productId: jeans.id },
      { name: "34", price: 129900, stock: 10, productId: jeans.id },
    ],
  });

  const headphones = await prisma.product.create({
    data: {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description: "Premium wireless headphones with active noise cancellation. 30-hour battery life. Deep bass sound.",
      price: 199900,
      compareAt: 349900,
      images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]),
      stock: 35,
      sku: "ELC-001",
      featured: true,
      categoryId: electronics.id,
    },
  });

  const smartwatch = await prisma.product.create({
    data: {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description: "Feature-rich smartwatch with health tracking, GPS, and notifications. Water resistant.",
      price: 499900,
      compareAt: 799900,
      images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]),
      stock: 25,
      sku: "ELC-002",
      featured: true,
      categoryId: electronics.id,
    },
  });
  await prisma.variant.createMany({
    data: [
      { name: "Black", price: 499900, stock: 10, productId: smartwatch.id },
      { name: "Silver", price: 499900, stock: 10, productId: smartwatch.id },
      { name: "Rose Gold", price: 529900, stock: 5, productId: smartwatch.id },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Portable Bluetooth Speaker",
        slug: "portable-bluetooth-speaker",
        description: "Compact waterproof speaker with 360-degree sound. 12-hour battery life.",
        price: 249900,
        compareAt: 399900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"]),
        stock: 50,
        sku: "ELC-003",
        categoryId: electronics.id,
      },
      {
        name: "Power Bank 10000mAh",
        slug: "power-bank-10000mah",
        description: "Fast charging power bank with dual USB ports. Slim and lightweight design.",
        price: 79900,
        compareAt: 129900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800"]),
        stock: 80,
        sku: "ELC-004",
        categoryId: electronics.id,
      },
      {
        name: "Leather Crossbody Bag",
        slug: "leather-crossbody-bag",
        description: "Elegant genuine leather crossbody bag with adjustable strap. Spacious interior.",
        price: 149900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]),
        stock: 30,
        sku: "ACC-001",
        featured: true,
        categoryId: accessories.id,
      },
      {
        name: "Polarized Sunglasses",
        slug: "polarized-sunglasses",
        description: "UV400 polarized sunglasses with lightweight metal frame. Includes hard case.",
        price: 69900,
        compareAt: 99900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"]),
        stock: 70,
        sku: "ACC-002",
        categoryId: accessories.id,
      },
      {
        name: "Running Sneakers",
        slug: "running-sneakers",
        description: "Lightweight running shoes with responsive cushioning. Breathable mesh upper.",
        price: 249900,
        compareAt: 399900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]),
        stock: 40,
        sku: "ACC-003",
        featured: true,
        categoryId: accessories.id,
      },
      {
        name: "Stainless Steel Water Bottle",
        slug: "stainless-steel-water-bottle",
        description: "Double wall insulated water bottle. Keeps drinks cold for 24hrs, hot for 12hrs. 750ml.",
        price: 44900,
        compareAt: 69900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"]),
        stock: 120,
        sku: "HOM-001",
        categoryId: home.id,
      },
      {
        name: "Non-Stick Cookware Set",
        slug: "non-stick-cookware-set",
        description: "5-piece non-stick cookware set. PFOA free. Includes frying pan, saucepans, and lid.",
        price: 299900,
        compareAt: 499900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]),
        stock: 20,
        sku: "HOM-002",
        featured: true,
        categoryId: home.id,
      },
    ],
  });

  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Gaurav Jadhav",
      email: "admin@gtshop.in",
      password: adminHash,
      role: "ADMIN",
    },
  });

  const customerHash = await bcrypt.hash("test123", 12);
  await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@test.com",
      password: customerHash,
      role: "CUSTOMER",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
