import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
export const getAllRumah = async (req: Request, res: Response) => {
  try {
    const rumah = await prisma.$queryRawUnsafe(`
     SELECT
    r.id,
    r.nomorRumah,
    r.alamat,
    p.nama as namaPenghuni,
    pr.statusHunian,
    pr.menghuni
FROM
    rumah AS r
    LEFT JOIN (
        SELECT
            *
        FROM
            penghuni_on_rumah
        WHERE
            (rumahId, mulai) IN (
                SELECT
                    rumahId,
                    MAX(mulai)
                FROM
                    penghuni_on_rumah
                GROUP BY
                    rumahId
            )
    ) as pr ON r.id = pr.rumahId
    LEFT JOIN penghuni as p ON pr.penghuniId = p.id;`);
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
