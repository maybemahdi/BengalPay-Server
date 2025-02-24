import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { IUser, UserModel } from "./user.interface";
import { USER_ROLE } from "./user.constant";

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    phone: { type: String, required: [true, "phone is required"], unique: true },
    pin: {
      type: String,
      required: [true, "Password is required"],
      select: 0,
    },
    nid: { type: String, required: [true, "nid is required"], unique: true },
    balance: { type: Number, default: 0 },
    role: {
      type: String,
      enum: [USER_ROLE.user, USER_ROLE.admin, USER_ROLE.agent],
      default: USER_ROLE.user,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
  },
});

UserSchema.pre("save", async function (next) {
  this.pin = await bcrypt.hash(this.pin, Number(config.bcrypt_salt_rounds));
  next();
});

UserSchema.post("save", function (doc, next) {
  doc.pin = "";
  next();
});

UserSchema.statics.isUserExistsByCustomEmail = async function (email: string) {
  return await User.findOne({ email }).select("+pin");
};

UserSchema.statics.isUserExistsByCustomPhone = async function (phone: string) {
  return await User.findOne({ phone }).select("+pin");
};

UserSchema.statics.isPinMatched = async function (plainTextPin, hashedPin) {
  return await bcrypt.compare(plainTextPin, hashedPin);
};

UserSchema.statics.isJWTIssuedBeforePinChanged = function (
  pinChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const pinChangedTime = new Date(pinChangedTimestamp).getTime() / 1000;
  return pinChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>("User", UserSchema);
