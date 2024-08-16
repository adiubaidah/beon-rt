import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllKepemilikan = async (req: Request, res: Response) => {
  try {
    const kontrak = req.query.kontrak;
    const rumah = req.query.rumah;

    const where: any = {};

    if (kontrak) {
      where["statusHunian"] = kontrak;
    }

    if(rumah) {
      where["rumahId"] = rumah;
    }

    let queryString = `SELECT
    r.id as rumahId,
    r.nomorRumah,
    r.alamat,
    p.id as penghuniId,
    p.nama as namaPenghuni,
    p.noTelepon,
    pr.id as penghuniOnRumahId,
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
    LEFT JOIN penghuni_on_rumah as pr ON r.id = pr.rumahId
    LEFT JOIN penghuni as p ON pr.penghuniId = p.id`;

    if(Object.keys(where).length > 0) {
      queryString += " WHERE ";
      let i = 0;
      for (const key in where) {
        if (i > 0) {
          queryString += " AND ";
        }
        queryString += `${key} = ${where[key]}`;
        i++;
      }
    }

    const penghuni = await prisma.$queryRawUnsafe(queryString);

    return res.status(200).json(penghuni);
  } catch (error) {
    console.log("[GET_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const getKepemilikanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const penghuni = await prisma.penghuniOnRumah.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        penghuni: true,
        rumah: true,
      },
    });

    return res.status(200).json(penghuni);
  } catch (error) {
    console.log("[GET_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const createKepemilikan = async (req: Request, res: Response) => {
  try {
    const { rumahId, penghuniId, statusHunian, mulai, selesai, setahun } =
      req.body;
    if (!rumahId || !penghuniId || !statusHunian || !mulai) {
      return res.sendStatus(400);
    }

    const kepemilikan = await prisma.penghuniOnRumah.create({
      data: {
        mulai,
        ...(statusHunian === "KONTRAK" && {
          selesai,
        }),
        rumah: {
          connect: {
            id: rumahId,
          },
        },
        penghuni: {
          connect: {
            id: penghuniId,
          },
        },
        statusHunian,
      },
    });

    return res.status(201).json(kepemilikan);
  } catch (error) {
    console.log("[CREATE_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};
