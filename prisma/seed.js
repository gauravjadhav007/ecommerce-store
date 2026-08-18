const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const clothing = await prisma.category.create({
    data: { name: "Clothing", slug: "clothing" },
  });

  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics" },
  });

  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories" },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "Classic White T-Shirt",
        slug: "classic-white-tshirt",
        description: "A comfortable classic white t-shirt made from 100% organic cotton.",
        price: 2999,
        compareAt: 3999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]),
        stock: 50,
        sku: "TSH-001",
        featured: true,
        categoryId: clothing.id,
      },
      {
        name: "Slim Fit Jeans",
        slug: "slim-fit-jeans",
        description: "Modern slim fit jeans with stretch comfort.",
        price: 5999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"]),
        stock: 35,
        sku: "JNS-001",
        featured: true,
        categoryId: clothing.id,
      },
      {
        name: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        price: 8999,
        compareAt: 12999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]),
        stock: 25,
        sku: "HPH-001",
        featured: true,
        categoryId: electronics.id,
      },
      {
        name: "Smart Watch Pro",
        slug: "smart-watch-pro",
        description: "Feature-rich smartwatch with health tracking and notifications.",
        price: 19999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]),
        stock: 15,
        sku: "SWT-001",
        featured: true,
        categoryId: electronics.id,
      },
      {
        name: "Leather Crossbody Bag",
        slug: "leather-crossbody-bag",
        description: "Elegant genuine leather crossbody bag with adjustable strap.",
        price: 4999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]),
        stock: 20,
        sku: "BAG-001",
        categoryId: accessories.id,
      },
      {
        name: "Polarized Sunglasses",
        slug: "polarized-sunglasses",
        description: "UV400 polarized sunglasses with lightweight frame.",
        price: 2499,
        compareAt: 3499,
        images: JSON.stringify(["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"]),
        stock: 40,
        sku: "SNG-001",
        categoryId: accessories.id,
      },
      {
        name: "Running Sneakers",
        slug: "running-sneakers",
        description: "Lightweight running shoes with responsive cushioning.",
        price: 7999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]),
        stock: 30,
        sku: "SNK-001",
        featured: true,
        categoryId: clothing.id,
      },
      {
        name: "Portable Bluetooth Speaker",
        slug: "portable-bluetooth-speaker",
        description: "Compact waterproof speaker with 360-degree sound.",
        price: 3999,
        compareAt: 5999,
        images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"]),
        stock: 45,
        sku: "SPK-001",
        categoryId: electronics.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
