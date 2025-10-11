// create-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PW = "Admin123_";
const SALT_ROUNDS = 10;

async function main() {
  try {
    console.log("Checking for existing user:", ADMIN_EMAIL);
    const existing = await prisma.users.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    const hashed = await bcrypt.hash(ADMIN_PW, SALT_ROUNDS);

    if (!existing) {
      const created = await prisma.users.create({
        data: {
          name: "Admin",
          email: ADMIN_EMAIL,
          password: hashed,
          is_admin: true,
        },
      });

      console.log("✅ Admin user created:", {
        id: created.id,
        email: created.email,
        is_admin: created.is_admin,
      });
    } else if (!existing.is_admin) {
      const updated = await prisma.users.update({
        where: { email: ADMIN_EMAIL },
        data: {
          is_admin: true,
          password: hashed,
        },
      });

      console.log("✅ Existing user upgraded to admin and password updated:", {
        id: updated.id,
        email: updated.email,
        is_admin: updated.is_admin,
      });
    } else {
      console.log("ℹ️ User already exists and is an admin. No changes made.");
    }
  } catch (err) {
    console.error("❌ Error creating/updating admin:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
