// prisma/seed.ts

import { Gender, Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/id_ID";

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


  await prisma.jenisIuran.createMany({
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

  //create many penghuni with array and faker for 15 data
  const penghuniData = Array.from({ length: 15 }).map((item, index) => ({
    nama: faker.person.fullName(),
    fotoKTP: "ktp.jpg",
    noTelepon: faker.phone.number(),
    gender: index % 2 === 0 ? Gender.LAKI_LAKI : Gender.PEREMPUAN,
    menikah: index % 2 === 0,
  }));

  await prisma.penghuni.createMany({
    data: penghuniData,
  });
  const rumah = Array.from({ length: 20 }).map((item, index) => ({
    nomorRumah: Math.floor(10000 + Math.random() * 90000).toString(),
    alamat: faker.location.streetAddress(),
  }));

  await prisma.rumah.createMany({
    data: rumah,
  });

  console.log("Seeded the database with an admin user and 2 jenis iuran");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
