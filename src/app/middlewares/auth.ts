/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { User } from "../modules/user/user.model";
import { IUserRole } from "../modules/user/user.interface";
import config from "../config";

const auth = (...requiredRoles: IUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if the token is missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // checking if the given token is valid
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired!");
      }
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token!");
    }

    const { role, email } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const isBlocked = user?.isBlocked;

    if (isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
