import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllJenisIuran = async (req: Request, res: Response) => {
  try {
    const jenisIuran = await prisma.jenisIuran.findMany();
    return res.status(200).json(jenisIuran);
  } catch (error) {
    console.log("[GET_IURANBULAN] " + error);
    return res.sendStatus(500);
  }
};

export const getJenisIuranById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const jenisIuran = await prisma.jenisIuran.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json(jenisIuran);
  } catch (error) {
    console.log("[GET_JENIS_IURAN] " + error);
    return res.sendStatus(500);
  }
};

export const createJenisIuran = async (req: Request, res: Response) => {
  try {
    const { nama, nominal, deskripsi } = req.body;
    if (!nama || !nominal || !deskripsi) {
      return res.sendStatus(400);
    }

    const jenisIuran = await prisma.jenisIuran.create({
      data: {
        nama,
        deskripsi,
        nominal,
      },
    });

    return res.status(201).json(jenisIuran);
  } catch (error) {
    console.log("[CREATE_JENIS_IURAN] " + error);
    return res.sendStatus(500);
  }
};
