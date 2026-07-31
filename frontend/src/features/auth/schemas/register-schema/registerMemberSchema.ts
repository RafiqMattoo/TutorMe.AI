import { z } from "zod";
import type { UserRole } from "@/shared/types";

export const registerMemberSchema = z
  .object({
    schoolId: z
      .string()
      .min(1, "Please select a school."),

    role: z.enum(["Student", "Teacher"] as [UserRole, UserRole]),

    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters.")
      .max(50, "First name cannot exceed 50 characters."),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters.")
      .max(50, "Last name cannot exceed 50 characters."),

    email: z
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must contain uppercase, lowercase, number and special character."
      ),

    phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number is too long."),


    gradeLevel: z
      .string()
      .trim()
      .optional(),

    rollNumber: z
      .string()
      .trim()
      .optional(),

    dateOfBirth: z
      .string()
      .optional(),

    guardianName: z
      .string()
      .trim()
      .optional(),

    guardianPhone: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Student") {
      if (!data.gradeLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gradeLevel"],
          message: "Class / Grade is required.",
        });
      }

      if (!data.rollNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rollNumber"],
          message: "Roll number is required.",
        });
      }

      if (!data.dateOfBirth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfBirth"],
          message: "Date of birth is required.",
        });
      }

      if (!data.guardianName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardianName"],
          message: "Guardian name is required.",
        });
      }

      if (!data.guardianPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardianPhone"],
          message: "Guardian phone is required.",
        });
      }
    }
  });

export type RegisterMemberFormData = z.infer<typeof registerMemberSchema>;