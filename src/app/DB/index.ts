// admin.model.ts

import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const adminToSeed = {
  name: "Mahdi Hasan",
  email: config.admin_email,
  phone: config.admin_phone,
  pin: config.admin_pin,
  nid: config.admin_nid,
  role: USER_ROLE.admin,
  balance: config.admin_balance,
  isVerified: true,
  isBlocked: false,
  isDeleted: false,
};

const seedAdmin = async () => {
  const admin = await User.findOne({
    email: adminToSeed.email,
    phone: adminToSeed.phone,
  });
  if (!admin) {
    await User.create(adminToSeed);
  }
};

export default seedAdmin;
