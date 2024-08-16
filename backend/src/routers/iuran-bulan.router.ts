import { Router } from "express";
import {
  getAllIuranBulan,
  createIuranBulan,
} from "../controllers/iuran-bulan.controller";
import { auth } from "../middleware";

export default (router: Router) => {
  router
    .route("/iuran-bulan")
    .get(auth, getAllIuranBulan)
    .post(auth, createIuranBulan);
};
