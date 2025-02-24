/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
import { createToken } from "./auth.utils";
import config from "../../config";
import bcrypt from "bcrypt";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const isPhoneExists = await User.isUserExistsByCustomPhone(payload.phone);
  if (isPhoneExists) {
    throw new AppError(httpStatus.CONFLICT, "Phone number already registered!");
  }
  const isEmailExists = await User.isUserExistsByCustomEmail(payload.email);
  if (isEmailExists) {
    throw new AppError(httpStatus.CONFLICT, "Email number already registered!");
  }
  const isNidExists = await User.findOne({ nid: payload.nid });
  if (isNidExists) {
    throw new AppError(httpStatus.CONFLICT, "Nid already registered!");
  }
  const result = await User.create(payload);
  return {
    _id: result?._id,
    name: result?.name,
    email: result?.email,
    phone: result?.phone,
    nid: result?.nid,
  };
};

const loginUser = async (payload: ILoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomPhone(payload.phone);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // checking if the user is already deleted

  const isBlocked = user?.isBlocked;

  if (isBlocked) {
    throw new AppError(httpStatus.UNAUTHORIZED, "This user is blocked!");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  const isPinMatched = await User.isPinMatched(payload?.pin, user?.pin);
  if (!isPinMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  //create token and sent to the  client

  const jwtPayload = {
    id: user._id as string,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    data: {
      id: user._id as string,
      name: user.name,
      email: user.email,
      phone: user.email,
      role: user.role as string,
    },
    accessToken,
  };
};

const changePin = async (
  payload: {
    phone: string;
    currentPin: string;
    newPin: string;
  },
  user: any,
) => {
  const { currentPin, newPin } = payload;
  const userForCheck = await User.findById(user?.id).select("+pin");
  if (!userForCheck) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }
  // Check if the current pin matches
  const isPinMatched = await User.isPinMatched(currentPin, userForCheck.pin);
  if (!isPinMatched) {
    return {
      success: false,
      message: "Current pin is incorrect",
    };
  }

  // Update the pin
  userForCheck.pin = await bcrypt.hash(
    newPin,
    Number(config.bcrypt_salt_rounds),
  );
  await userForCheck.save();

  return {
    success: true,
    message: "Pin changed successfully",
  };
};

const updatedUserStatus = async (payload: { id: string; status: boolean }) => {
  const result = await User.findByIdAndUpdate(
    payload.id,
    { isBlocked: payload.status },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Something went wrong!");
  }
  return result;
};

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  changePin,
  updatedUserStatus,
};
