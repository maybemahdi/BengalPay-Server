import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    message: "Shipping Status Updated",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  getAllUsers,
};
