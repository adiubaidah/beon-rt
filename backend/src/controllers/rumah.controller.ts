import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
export const getAllRumah = async (req: Request, res: Response) => {
  try {
    const rumah = await prisma.$queryRawUnsafe(`
      SELECT
        r.id as rumahId,
        r.nomorRumah,
        r.alamat,
        p.id as penghuniId,
        p.nama as namaPenghuni,
        pr.statusHunian,
        pr.mulai,
        pr.selesai,
        CASE
            WHEN pr.statusHunian = 'KONTRAK' THEN
                CASE
                    WHEN NOT EXISTS (
                        SELECT 1
                        FROM jenis_iuran ji
                        LEFT JOIN iuran_bulanan ib ON ji.id = ib.jenisIuranId
                        AND ib.penghuniOnRumahId = pr.id
                        AND ib.tanggalBayar BETWEEN pr.mulai AND pr.selesai
                        AND ib.nominal > 0
                        WHERE ib.jenisIuranId IS NULL
                    ) THEN 1
                    ELSE 0
                END
            WHEN pr.statusHunian = 'TETAP' THEN
                CASE
                    WHEN NOT EXISTS (
                        SELECT 1
                        FROM jenis_iuran ji
                        LEFT JOIN iuran_bulanan ib ON ji.id = ib.jenisIuranId
                        AND ib.penghuniOnRumahId = pr.id
                        AND ib.tanggalBayar >= pr.mulai
                        AND ib.nominal > 0
                        WHERE ib.jenisIuranId IS NULL
                    ) THEN 1
                    ELSE 0
                END
            ELSE 'N/A'
        END as isLunas
    FROM
        rumah as r
        LEFT JOIN (
            SELECT *
            FROM penghuni_on_rumah
            WHERE (rumahId, mulai) IN (
                SELECT rumahId, MAX(mulai)
                FROM penghuni_on_rumah
                GROUP BY rumahId
            )
        ) as pr ON r.id = pr.rumahId
        LEFT JOIN penghuni as p ON pr.penghuniId = p.id;;
    `);
    return res.status(200).json(rumah);
  } catch (error) {
    console.log("[GET_RUMAH] " + error);
    return res.sendStatus(500);
  }
};

export const getRumahById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rumah = await prisma.rumah.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        penghuni: true,
      },
    });
    return res.status(200).json(rumah);
  } catch (error) {
    console.log("[GET_RUMAH] " + error);
    return res.sendStatus(500);
  }
};

export const createRumah = async (req: Request, res: Response) => {
  try {
    const { nomorRumah, alamat } = req.body;
    if (!nomorRumah || !alamat) {
      return res.sendStatus(400);
    }

    const rumah = await prisma.rumah.create({
      data: {
        nomorRumah,
        alamat,
      },
    });

    return res.status(201).json(rumah);
  } catch (error) {
    console.log("[CREATE_RUMAH] " + error);
    return res.sendStatus(500);
  }
};

export const updateRumah = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nomorRumah, alamat, dihuni } = req.body;

    if (!nomorRumah || !alamat) {
      return res.sendStatus(400);
    }

    const rumah = await prisma.rumah.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nomorRumah,
        alamat,
      },
    });

    return res.status(200).json(rumah);
  } catch (error) {
    console.log("[UPDATE_RUMAH] " + error);
    return res.sendStatus(500);
  }
};

export const deleteRumah = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.rumah.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log("[DELETE_RUMAH] " + error);
    return res.sendStatus(500);
  }
};
