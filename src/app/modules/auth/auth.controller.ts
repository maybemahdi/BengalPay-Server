import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.services";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserIntoDB(req?.body);
  sendResponse(res, {
    success: true,
    message: "User registered successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { data, accessToken } = result;

  // Expire the previous token if it exists
  // if (req.cookies.token) {
  //   res.clearCookie("token");
  // }

  // res.cookie("token", accessToken, {
  //   secure: config.node_env === "production",
  //   httpOnly: true,
  // });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: {
      data,
      accessToken,
    },
  });
});

const changePin = catchAsync(async (req, res) => {
  const result = await AuthService.changePin(req.body, req.user);
  sendResponse(res, {
    success: result?.success,
    statusCode: httpStatus.OK,
    message: result?.message,
  });
});

const updatedUserStatus = catchAsync(async (req, res) => {
  const payload = req?.body;
  const result = await AuthService.updatedUserStatus(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User is ${payload?.status ? "Blocked" : "Active"} now`,
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  changePin,
  updatedUserStatus,
};
