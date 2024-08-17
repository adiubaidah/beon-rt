import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { months } from "../constant";

export const getAllPengeluaran = async (req: Request, res: Response) => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const query = req.query.q as string;
    const pengeluaran = await prisma.pengeluaran.findMany({
      where: {
        ...(from && {
          tanggal: {
            gte: new Date(from as string),
            lte: new Date((to || from) as string),
          },
        }),
        ...(query && {
          nama: {
            contains: query,
          },
        }),
      },
    });
    return res.status(200).json(pengeluaran);
  } catch (error) {
    console.log("[GET_PENGELUARAN] " + error);
    return res.sendStatus(500);
  }
};

export const rekapPengeluaranTahun = async (req: Request, res: Response) => {
  try {
    const tahun = req.query.tahun || new Date().getFullYear();

    const pengeluaran: any = await prisma.$queryRawUnsafe(`
      SELECT
        MONTH(tanggal) AS month,
        SUM(nominal) AS total_nominal
    FROM
      pengeluaran
    WHERE
        YEAR(tanggal) = ${tahun}
    GROUP BY
        MONTH(tanggal)
    ORDER BY
        month;
      `);

    const pengeluranPerBulan = months.map((month, index) => {
      const data = pengeluaran.find((item: any) => item.month === index + 1);
      return {
        month,
        total_nominal: data ? Number(data.total_nominal) : 0,
      };
    });

    return res.status(200).json(pengeluranPerBulan);
  } catch (error) {
    console.log("[REKAP_PENGELUARAN] " + error);
    return res.sendStatus(500);
  }
};

export const createPengeluaran = async (req: Request, res: Response) => {
  try {
    const { nama, nominal, tanggal } = req.body;
    if (!nama || !nominal || !tanggal) {
      return res.sendStatus(400);
    }

    //check if nominal < (sum of iuran_bulanan - sum of pengeluaran)
    const totalIuranBulanan = await prisma.iuranBulanan.aggregate({
      _sum: {
        nominal: true,
      },
    });
    const totalPengeluaran = await prisma.pengeluaran.aggregate({
      _sum: {
        nominal: true,
      },
    });

    if (
      totalIuranBulanan._sum?.nominal !== null &&
      totalIuranBulanan._sum?.nominal <
      (totalPengeluaran._sum?.nominal || 0) + nominal
    ) {
      return res.status(400).json({
        message: "Nominal pengeluaran melebihi total iuran bulanan",
      });
    }

    const pengeluaran = await prisma.pengeluaran.create({
      data: {
        nama,
        nominal,
        tanggal,
        keterangan: req.body.keterangan,
      },
    });

    return res.status(201).json(pengeluaran);
  } catch (error) {
    console.log("[CREATE_PENGELUARAN] " + error);
    return res.sendStatus(500);
  }
};

export const updatePengeluaran = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, nominal, tanggal } = req.body;
    if (!nama || !nominal || !tanggal) {
      return res.sendStatus(400);
    }

    const pengeluaran = await prisma.pengeluaran.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nama,
        nominal,
        tanggal,
        keterangan: req.body.keterangan,
      },
    });

    return res.status(200).json(pengeluaran);
  } catch (error) {
    console.log("[UPDATE_PENGELUARAN] " + error);
    return res.sendStatus(500);
  }
};

export const deletePengeluaran = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pengeluaran.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log("[DELETE_PENGELUARAN] " + error);
    return res.sendStatus(500);
  }
};
