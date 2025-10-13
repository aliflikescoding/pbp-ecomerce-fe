// prisma/seed-products.js
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ---------- helpers ----------
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const firstExisting = (candidates) => {
  for (const p of candidates) {
    const abs = path.resolve(__dirname, p);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
};

const copyImageAndReturnUrl = (srcAbsPath, uploadsDirAbs) => {
  const ext = path.extname(srcAbsPath); // .png
  const base = path.basename(srcAbsPath, ext);
  // mimic your previous upload style: timestamp-random.png
  const stamped = `${Date.now()}-${crypto.randomInt(1e9)}${ext}`;
  const destAbs = path.join(uploadsDirAbs, stamped);
  fs.copyFileSync(srcAbsPath, destAbs);
  // store URL the frontend can reach (adjust if your static route differs)
  return `/uploads/${stamped}`;
};

// ---------- main ----------
const seed = async () => {
  try {
    console.log("Starting product seeding…");

    // Wipe only product-related tables (safe order)
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.cart_items.deleteMany();
    await prisma.carts.deleteMany();
    await prisma.product_images.deleteMany();
    await prisma.products.deleteMany();
    await prisma.categories.deleteMany();
    console.log("Cleared product-related tables.");

    // locate images folder (supports both 'image' and 'images')
    const imagesRoot =
      firstExisting([
        "../../assets/images",
        "../../assets/image",
        "../assets/images",
        "../assets/image",
      ]) ||
      (() => {
        throw new Error("Could not find src/assets/image(s)");
      })();

    // ensure uploads dir exists (these are the public URLs your app serves)
    const uploadsDirAbs = path.resolve(__dirname, "../../public/uploads");
    ensureDir(uploadsDirAbs);

    // data to create
    const catalog = [
      {
        categoryName: "Men",
        name: "Black Formal Shirt",
        price: "30.00",
        stock: 20,
        is_active: true,
        imageFiles: [
          "black-shirt-1.png",
          "black-shirt-2.png",
          "black-shirt-3.png",
        ],
      },
      {
        categoryName: "Men",
        name: "White Formal Shirt",
        price: "30.00",
        stock: 20,
        is_active: true,
        imageFiles: [
          "white-shirt-1.png",
          "white-shirt-2.png",
          "white-shirt-3.png",
        ],
      },
    ];

    // create categories (find or create)
    const categoryCache = new Map();
    for (const item of catalog) {
      if (categoryCache.has(item.categoryName)) continue;

      // Try to find existing category first
      let cat = await prisma.categories.findFirst({
        where: { name: item.categoryName },
      });

      // If not found, create it
      if (!cat) {
        cat = await prisma.categories.create({
          data: { name: item.categoryName },
        });
      }

      categoryCache.set(item.categoryName, cat);
    }
    console.log(`Created/found ${categoryCache.size} categories.`);

    // create products + images
    for (const item of catalog) {
      const category = categoryCache.get(item.categoryName);

      const product = await prisma.products.create({
        data: {
          name: item.name,
          price: item.price, // Prisma Decimal accepts string
          stock: item.stock,
          is_active: item.is_active,
          category_id: category.id,
        },
      });

      console.log(`Created product: ${product.name} (id=${product.id})`);

      // attach images
      for (const file of item.imageFiles) {
        const abs = path.join(imagesRoot, file);
        if (!fs.existsSync(abs)) {
          console.warn(`⚠️  Skipping missing image: ${abs}`);
          continue;
        }
        const url = copyImageAndReturnUrl(abs, uploadsDirAbs);
        await prisma.product_images.create({
          data: { url, product_id: product.id },
        });
        console.log(`  ↳ added image ${file} -> ${url}`);
      }
    }

    console.log("Product seeding completed successfully!");
  } catch (err) {
    console.error("Error during product seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
};

// run only in development (remove this guard if you prefer)
if (process.env.NODE_ENV === "development") {
  seed().then(() => console.log("Seeding done."));
}
