import { Request, Response } from "express";
import fs from "fs";
import { prisma } from "../lib/prisma";


export const getAllPenghuni = async (req: Request, res: Response) => {
    try {
      const penghuni = await prisma.penghuniOnRumah.findMany();
  
      return res.status(200).json(penghuni);
    } catch (error) {
      console.log("[GET_PENGHUNI] " + error);
      return res.sendStatus(500);
    }
  };