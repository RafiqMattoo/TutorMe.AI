import { z } from "zod";

export const signupSchema = z
  .object({
    schoolId: z.string().min(1, "Please select a school"),

    firstName: z.string().min(2, "First name is required"),

    lastName: z.string().min(2, "Last name is required"),

    email: z.string().email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least one special character"
      ),
 
    confirmPassword: z.string(),

    role: z.enum(["Student", "Teacher"]),
    phone: z.string().optional(),

    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept the Terms & Conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupFormData = z.infer<typeof signupSchema>;  
