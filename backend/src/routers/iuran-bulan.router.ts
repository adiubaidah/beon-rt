import { Router } from "express";
import {
  getAllIuranBulan,
  createIuranBulan,
  updateIuranBulan,
  deleteIuranBulan,
  rekapIuranBulanTahun,
} from "../controllers/iuran-bulan.controller";
import { auth } from "../middleware";

export default (router: Router) => {
  router
    .route("/iuran-bulan")
    .get(auth, getAllIuranBulan)
    .post(auth, createIuranBulan);

  router.get("/iuran-bulan/rekap", auth, rekapIuranBulanTahun);

  router
    .route("/iuran-bulan/:id")
    .put(auth, updateIuranBulan)
    .delete(auth, deleteIuranBulan);
};
