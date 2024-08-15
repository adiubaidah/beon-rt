import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
export const getAllRumah = async (req: Request, res: Response) => {
  try {
    const rumah = await prisma.rumah.findMany({
      include: {
        penghuni: {
          include: {
            penghuni: {
              select: {
                nama: true,
                noTelepon: true,
              },
            },
          },
        },
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
    const { nomorRumah, alamat, dihuni } = req.body;
    if (!nomorRumah || !alamat) {
      return res.sendStatus(400);
    }

    const rumah = await prisma.rumah.create({
      data: {
        nomorRumah,
        alamat,
        dihuni,
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
        dihuni,
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
