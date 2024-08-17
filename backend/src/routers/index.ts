import { Router } from "express";
import authenticationRouter from "./authentication.router";
import penghuniRouter from "./penghuni.router";
import rumahRouter from "./rumah.router";
import kepemilikanRouter from "./kepemilikan.router";
import iuranbulanRouter from "./iuran-bulan.router";
import jenisIuranRouter from "./jenis-iuran.router";
import pengeluaranRouter from "./pengeluaran.router";

const router = Router();

export default (): Router => {
  authenticationRouter(router);
  penghuniRouter(router);
  rumahRouter(router);
  kepemilikanRouter(router);
  iuranbulanRouter(router);
  jenisIuranRouter(router);
  pengeluaranRouter(router);
  return router;
};
