import { Router } from "express";
import {
  getAllKepemilikan,
  createKepemilikan,
  getKepemilikanById,
  updateKepemilikan,
  deleteKepemilikan,
} from "../controllers/kepemilikan.controller";
import { auth } from "../middleware";

export default (router: Router) => {
  router
    .route("/kepemilikan")
    .get(auth, getAllKepemilikan)
    .post(auth, createKepemilikan);

  router
    .route("/kepemilikan/:id")
    .get(auth, getKepemilikanById)
    .put(auth, updateKepemilikan)
    .delete(auth, deleteKepemilikan);
};
