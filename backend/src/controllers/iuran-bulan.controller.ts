import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const getAllIuranBulan = async (req: Request, res: Response) => {
  try {
    const { from, to, q, iuran } = req.query;

    const query: Prisma.IuranBulananWhereInput = {
      ...(from && {
        tanggalBayar: {
          gte: new Date(from as string),
          lte: new Date((to || from) as string),
        },
      }),
      ...(iuran && {
        jenisIuran: {
          id: {
            equals: parseInt(iuran.toString()),
          },
        },
      }),
    };

    if (q) {
      query.penghuni = {
        penghuni: {
          nama: {
            contains: q as string,
          },
        },
      };
    }

    const iuranBulan = await prisma.iuranBulanan.findMany({
      where: query,
      orderBy: {
        tanggalBayar: "desc",
      }
    });
    
    return res.status(200).json(iuranBulan);
  } catch (error) {
    console.log("[GET_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};

export const createIuranBulan = async (req: Request, res: Response) => {
  try {
    const { tanggalBayar, penghuniOnRumahId, jenisIuranId, setahun } = req.body;
    if (!tanggalBayar || !penghuniOnRumahId || !jenisIuranId) {
      return res.sendStatus(400);
    }

    const getJenisPembayaran = await prisma.jenisIuran.findUnique({
      where: {
        id: jenisIuranId,
      },
    });

    if (!getJenisPembayaran) {
      return res
        .status(400)
        .json({ message: "Jenis Pembayaran tidak ditemukan" });
    }

    let iuranBulan;

    if (setahun) {
      //create many but with different month
      let iuranBulanArr = [];
      for (let i = 1; i <= 12; i++) {
        let newTanggalBayar = new Date(tanggalBayar);
        newTanggalBayar.setMonth(i);

        iuranBulanArr.push({
          nominal: getJenisPembayaran.nominal,
          tanggalBayar: newTanggalBayar,
          penghuniOnRumahId,
          jenisIuranId,
        });
      }
      iuranBulan = await prisma.iuranBulanan.createMany({
        data: iuranBulanArr,
      });
    } else {
      iuranBulan = await prisma.iuranBulanan.create({
        data: {
          nominal: getJenisPembayaran.nominal,
          tanggalBayar,
          penghuni: {
            connect: {
              id: penghuniOnRumahId,
            },
          },
          jenisIuran: {
            connect: {
              id: jenisIuranId,
            },
          },
        },
      });
    }

    return res.status(201).json(iuranBulan);
  } catch (error) {
    console.log("[CREATE_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};
