import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
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

  // Prices in paise (INR * 100)
  await prisma.product.createMany({
    data: [
      {
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
      {
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
      {
        name: "Formal White Shirt",
        slug: "formal-white-shirt",
        description: "Classic formal white shirt for office and events. Wrinkle-free fabric.",
        price: 89900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"]),
        stock: 45,
        sku: "CLK-003",
        categoryId: clothing.id,
      },
      {
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
      {
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

  // Create admin user (password: admin123)
  await prisma.user.create({
    data: {
      name: "Gaurav Jadhav",
      email: "admin@gtshop.in",
      password: "$2b$12$yKgsqnqVST1r6JdhHawB9.YDG1jJy4O08q0Bojb32SvzmXzbjL1QK",
      role: "ADMIN",
    },
  });

  // Create test customer (password: test123)
  await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@test.com",
      password: "$2b$12$yKgsqnqVST1r6JdhHawB9.YDG1jJy4O08q0Bojb32SvzmXzbjL1QK",
      role: "CUSTOMER",
    },
  });

  console.log("Database seeded with Indian pricing!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
