import { User } from "./user.model";

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

export const UserServices = {
  getAllUsers,
};
