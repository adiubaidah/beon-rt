import { Router } from "express";
import {
  createRumah,
  deleteRumah,
  getAllRumah,
  updateRumah,
} from "../controllers/rumah.controller";
import { auth } from "../middleware";

export default (router: Router) => {
  router.route("/rumah").get(auth, getAllRumah).post(auth, createRumah);

  router.route("/rumah/:id").put(auth, updateRumah).delete(auth, deleteRumah);
};
