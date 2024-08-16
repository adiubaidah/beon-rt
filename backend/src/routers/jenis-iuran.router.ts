import { Router } from "express";
import {
  getAllJenisIuran,
  createJenisIuran,
} from "../controllers/jenis-iuran.controller";
import { auth } from "../middleware";

export default (router: Router) => {
  router
    .route("/jenis-iuran")
    .get(auth, getAllJenisIuran)
    .post(auth, createJenisIuran);
};
