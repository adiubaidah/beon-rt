// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });


  await prisma.jenisPembayaran.createMany({
    data: [
      {
        nama: "Satpam",
        deskripsi: "Membayar penjagaan satpam",
        nominal: 100000,
      },
      {
        nama: "Kebersihan",
        deskripsi: "Membayar kebersihan",
        nominal: 15000,
      },
    ],
  });

  console.log("Seeded the database with an admin user and 2 jenis pembayaran");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
