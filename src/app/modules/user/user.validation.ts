import { z } from "zod";

const userValidationSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .nonempty("name cannot be empty"),
  email: z
    .string({
      required_error: "email is required",
    })
    .email("email must be a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"]).optional().default("user"),
  isBlocked: z.boolean().optional().default(false),
});

export default userValidationSchema;
