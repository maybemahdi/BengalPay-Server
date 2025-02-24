/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: {
    id: string;
    email: string;
    role: string;
    name: string;
    phone: string;
  },
  secret: string,
  expiresIn: any,
): string => {
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(jwtPayload, secret, options);
};
