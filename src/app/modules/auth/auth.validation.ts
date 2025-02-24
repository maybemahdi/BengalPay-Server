import { z } from "zod";

// Validation for user registration
export const registerUserValidation = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .nonempty("Name cannot be empty"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email address"),
    phone: z
      .string()
      .min(10, "Phone must contain at least 10 Characters")
      .max(12, "Phone must be less or equal 12 characters"),
    pin: z
      .string()
      .min(5, "Pin must contain 5 Characters")
      .max(5, "Pin must contain 5 Characters"),
    nid: z
      .string()
      .min(10, "Nid must contain 10 Characters")
      .max(10, "Nid must contain 10 Characters"),
  })
  .strict();

// Validation for user login
export const loginUserValidation = z.object({
  phone: z
    .string()
    .min(10, "Phone must contain at least 10 Characters")
    .max(12, "Phone must be less or equal 12 characters"),
  pin: z
    .string()
    .min(5, "Pin must contain 5 Characters")
    .max(5, "Pin must contain 5 Characters"),
});

// validation for change pin
export const changePinValidation = z.object({
  phone: z
    .string()
    .min(10, "Phone must contain at least 10 Characters")
    .max(12, "Phone must be less or equal 12 characters"),
  currentPin: z
    .string()
    .min(5, "Current Pin must contain 5 Characters")
    .max(5, "Current Pin must contain 5 Characters"),
  newPin: z
    .string()
    .min(5, "New Pin must contain 5 Characters")
    .max(5, "New Pin must contain 5 Characters"),
});

// Types inferred from the Zod schemas
export type RegisterUserValidationType = z.infer<typeof registerUserValidation>;
export type LoginUserValidationType = z.infer<typeof loginUserValidation>;
