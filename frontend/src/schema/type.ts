import { z } from "zod";
import {
  penghuniSchema,
  iuranBulananSchema,
  jenisIuranSchema,
  rumahSchema,
  kepemilikanSchema,
  pengeluaranSchema,
} from ".";

export type NewPenghuni = z.infer<typeof penghuniSchema>;
export type NewIuranBulanan = z.infer<typeof iuranBulananSchema>;
export type NewJenisIuran = z.infer<typeof jenisIuranSchema>;
export type JenisIuran = NewJenisIuran & { id: number };
export type NewRumah = z.infer<typeof rumahSchema>;

export type Penghuni = NewPenghuni & { id: number } & { fotoKTP: string };

export type NewKepemilikan = z.infer<typeof kepemilikanSchema>;
export type Kepemilikan = NewKepemilikan & { id: number };

export type IuranBulanan = NewIuranBulanan & { id: number; nominal: number } & {
  jenisIuran: JenisIuran;
} & { penghuni: Penghuni } & { penghuniOnRumah: Kepemilikan };
export type Rumah = NewRumah & { id: number };

export type NewPengeluaran = z.infer<typeof pengeluaranSchema>;
export type Pengeluaran = NewPengeluaran & { id: number };


export type ModalOperation = "create" | "update" | "delete";
export type ModalProps<K, T> = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  operation: K;
  data: T;
};


export type Rekap = {
  month: string,
  total_nominal: number,
}