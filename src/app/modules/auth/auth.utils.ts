/* eslint-disable @typescript-eslint/no-explicit-any */
// import jwt from "jsonwebtoken";

// export const createToken = (
//   jwtPayload: { email: string; role: string },
//   secret: string,
//   expiresIn: string,
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };

import jwt, { SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: any,
): string => {
  // Define the options explicitly
  const options: SignOptions = {
    expiresIn, // Timespan for token expiration (e.g., "1d", "1h")
  };

  return jwt.sign(jwtPayload, secret, options);
};
