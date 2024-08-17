import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username diperlukan" })
    .max(50, { message: "Username terlalu panjang" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const penghuniSchema = z.object({
  nama: z.string().min(2, { message: "Nama diperlukan" }),
  menikah: z.boolean(),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  noTelepon: z.string().min(10, { message: "Nomor HP diperlukan" }),
});

export const rumahSchema = z.object({
  nomorRumah: z.string().length(5),
  alamat: z.string().min(2, { message: "Alamat diperlukan" }),
});

export const kepemilikanSchema = z.object({
  rumahId: z.number(),
  penghuniId: z.number(),
  mulai: z.date(),
  selesai: z.date().optional(),
  statusHunian: z.enum(["KONTRAK", "TETAP"]),
});

export const jenisIuranSchema = z.object({
  nama: z.string().min(2, { message: "Nama diperlukan" }),
  nominal: z.number().min(0, { message: "Nominal diperlukan" }),
  deskripsi: z.string().min(2, { message: "Deskripsi diperlukan" }),
});

export const iuranBulananSchema = z.object({
  penghuniOnRumahId: z.number(),
  tanggalBayar: z.date(),
  jenisIuranId: z.number(),
  setahun: z.boolean().default(false)
});


export const pengeluaranSchema = z.object({
  nama: z.string().min(2, { message: "Nama diperlukan" }),
  nominal: z.number().min(0, { message: "Nominal diperlukan" }),
  tanggal: z.date(),
  keterangan: z.string().optional(),
})