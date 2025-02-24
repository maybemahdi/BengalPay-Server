import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";

const UserRoutes = Router();

UserRoutes.get(
  "/",
  auth("admin"),
  UserController.getAllUsers,
);

export default UserRoutes;
