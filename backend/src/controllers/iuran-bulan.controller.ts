import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { months } from "../constant";

export const getAllIuranBulan = async (req: Request, res: Response) => {
  try {
    const { from, to, q, iuran, kepemilikan, penghuni, rumah } = req.query;

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
      ...(kepemilikan && {
        penghuniOnRumahId: parseInt(kepemilikan.toString()),
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
      include: {
        jenisIuran: true,
        ...(penghuni === "1" && {
          penghuni: {
            include: {
              penghuni: true,
              rumah: rumah === "1",
            },
          },
        }),
      },
      orderBy: {
        tanggalBayar: "desc",
      },
    });

    return res.status(200).json(iuranBulan);
  } catch (error) {
    console.log("[GET_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};

export const rekapIuranBulanTahun = async (req: Request, res: Response) => {
  try {
    const tahun = req.query.tahun || new Date().getFullYear();

    const iuranBulan: any = await prisma.$queryRawUnsafe(`
      SELECT
        MONTH(tanggalBayar) AS month,
        SUM(nominal) AS total_nominal
    FROM
      iuran_bulanan
    WHERE
        YEAR(tanggalBayar) = ${tahun}
    GROUP BY
        MONTH(tanggalBayar)
    ORDER BY
        month;
      `);
    console.log(iuranBulan);
    const rekap = months.map((month: any, index) => {
      const data = iuranBulan.find(
        (item: any) => Number(item.month) === index + 1
      );
      return {
        month,
        total_nominal: data ? Number(data.total_nominal) : 0,
      };
    });

    return res.status(200).json(rekap);
  } catch (error) {
    console.log("[REKAP_IURANBULAN] " + error);
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
      let newTanggalBayar = new Date(tanggalBayar);

      for (let i = 0; i < 12; i++) {
        iuranBulanArr.push({
          nominal: getJenisPembayaran.nominal,
          tanggalBayar: new Date(newTanggalBayar), // clone date to avoid mutation issues
          penghuniOnRumahId,
          jenisIuranId,
        });

        newTanggalBayar.setMonth(newTanggalBayar.getMonth() + 1);
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

export const updateIuranBulan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tanggalBayar, penghuniOnRumahId, jenisIuranId } = req.body;

    if (!tanggalBayar || !penghuniOnRumahId || !jenisIuranId) {
      return res.sendStatus(400);
    }

    const findJenisIuran = await prisma.jenisIuran.findUnique({
      where: {
        id: jenisIuranId,
      },
    });

    if (!findJenisIuran) {
      return res
        .status(400)
        .json({ message: "Jenis Pembayaran tidak ditemukan" });
    }

    const iuranBulan = await prisma.iuranBulanan.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nominal: findJenisIuran.nominal,
        tanggalBayar,
        penghuniOnRumahId,
        jenisIuranId,
      },
    });

    return res.status(200).json(iuranBulan);
  } catch (error) {
    console.log("[UPDATE_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};

export const deleteIuranBulan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const iuranBulan = await prisma.iuranBulanan.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(iuranBulan);
  } catch (error) {
    console.log("[DELETE_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};
