import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { changePinValidation, loginUserValidation, registerUserValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(registerUserValidation),
  AuthController.registerUser,
);
AuthRoutes.post(
  "/login",
  validateRequest(loginUserValidation),
  AuthController.loginUser,
);
AuthRoutes.put(
  "/change-pin",
  validateRequest(changePinValidation),
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  AuthController.changePin,
);
AuthRoutes.patch(
  "/update-user-status",
  auth(USER_ROLE.admin),
  AuthController.updatedUserStatus,
);

export default AuthRoutes;
