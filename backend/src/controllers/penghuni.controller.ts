import { Request, Response } from "express";
import fs from "fs";
import { prisma } from "../lib/prisma";

export const getAllPenghuni = async (req: Request, res: Response) => {
  try {
    const penghuni = await prisma.penghuni.findMany();

    return res.status(200).json(penghuni);
  } catch (error) {
    console.log("[GET_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const createPenghuni = async (req: Request, res: Response) => {
  try {
    const { nama, gender, menikah, noTelepon } = req.body;
    const fotoKTP = req.file?.filename;

    if (!nama || !gender || !menikah || !noTelepon || !fotoKTP) {
      console.log(fotoKTP);
      return res.sendStatus(400);
    }

    const penghuni = await prisma.penghuni.create({
      data: {
        nama,
        fotoKTP: fotoKTP,
        gender,
        menikah: menikah === "1",
        noTelepon,
      },
    });
    return res.status(201).json(penghuni);
  } catch (error) {
    console.log("[CREATE_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const getPenghuni = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const penghuni = await prisma.penghuni.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!penghuni) {
      return res.sendStatus(404);
    }

    return res.status(200).json(penghuni);
  } catch (error) {
    console.log("[GET_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const updatePenghuni = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, gender, menikah, noTelepon } = req.body;
    const fotoKTP = req.file?.filename;

    if (!nama || !gender || !menikah || !noTelepon) {
      return res.sendStatus(400);
    }

    if (fotoKTP) {
      const penghuni = await prisma.penghuni.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!penghuni) {
        return res.sendStatus(404);
      }

      //delete old fotoKTP
      fs.unlinkSync(`public/${penghuni.fotoKTP}`);
    }

    const penghuni = await prisma.penghuni.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nama,
        gender,
        menikah: menikah === "1",
        noTelepon,
        fotoKTP: fotoKTP,
      },
    });

    return res.status(200).json(penghuni);
  } catch (error) {
    console.log("[UPDATE_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};

export const deletePenghuni = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const penghuni = await prisma.penghuni.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!penghuni) {
      return res.sendStatus(404);
    }

    fs.unlinkSync(`public/${penghuni.fotoKTP}`);

    await prisma.penghuni.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.log("[DELETE_PENGHUNI] " + error);
    return res.sendStatus(500);
  }
};
