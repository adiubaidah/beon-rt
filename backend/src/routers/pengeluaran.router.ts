import { Router } from "express";
import { auth } from "../middleware";
import {
  getAllPengeluaran,
  createPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
  rekapPengeluaranTahun,
} from "../controllers/pengeluaran.controller";

export default (router: Router) => {
  router
    .route("/pengeluaran")
    .get(auth, getAllPengeluaran)
    .post(auth, createPengeluaran);
  router.get("/pengeluaran/rekap", auth, rekapPengeluaranTahun);
  router
    .route("/pengeluaran/:id")
    .put(auth, updatePengeluaran)
    .delete(auth, deletePengeluaran);
};
