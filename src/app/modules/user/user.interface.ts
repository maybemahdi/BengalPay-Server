/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

// user.interface.ts

export interface IUser {
  _id?: string
  name: string;
  email: string;
  phone: string;
  pin: string;
  role: string;
  nid: string;
  balance: number;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

// Agent interface extends IUser with additional properties specific to agents
export interface IAgent extends IUser {
  approved: boolean;
  income: number;
}

// Transaction interface for recording transaction details
export interface ITransaction {
  transactionId: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  type: "SendMoney" | "CashIn" | "CashOut";
  status: "Pending" | "Completed";
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomEmail(email: string): Promise<IUser>;
  isUserExistsByCustomPhone(number: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPinMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePinChanged(
    pinChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type IUserRole = keyof typeof USER_ROLE;
