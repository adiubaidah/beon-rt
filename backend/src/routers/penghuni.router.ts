import { Router } from "express";
import {
  createPenghuni,
  getAllPenghuni,
  updatePenghuni,
  deletePenghuni,
  getPenghuni,
} from "../controllers/penghuni.controller";
import { auth } from "../middleware";
import upload from "../lib/multer";

export default (router: Router) => {
  router
    .route("/penghuni")
    .get(auth, getAllPenghuni)
    .post(auth, upload.single("fotoKTP"), createPenghuni);

  router
    .route("/penghuni/:id")
    .get(auth, getPenghuni)
    .put(auth, upload.single("fotoKTP"), updatePenghuni)
    .delete(auth, deletePenghuni);
};
