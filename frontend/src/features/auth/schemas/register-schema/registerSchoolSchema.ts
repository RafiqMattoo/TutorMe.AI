import { z } from "zod";
import type { BoardType, SchoolType } from "@/shared/types";

export const registerSchoolSchema = z.object({
  // School Details
  schoolName: z
    .string()
    .trim()
    .min(1, "School name is required.")
    .min(2, "School name must be at least 2 characters."),

  schoolRegistrationNumber: z.string().trim().optional().or(z.literal("")),

  email: z
    .string()
    .trim()
    .min(1, "School email is required.")
    .email("Please enter a valid school email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(/^[0-9]{10,15}$/, "Please enter a valid phone number."),

  // Location
  state: z.string().trim().min(1, "State is required."),

  city: z.string().trim().min(1, "City is required."),

  // Address
  address: z
    .object({
      houseNo: z.string().trim().optional(),
      street: z.string().trim().optional(),
      area: z.string().trim().optional(),
      landmark: z.string().trim().optional(),
    })
    .optional(),

  // School Information
  principalName: z.string().trim().optional().or(z.literal("")),

  establishedYear: z.coerce
    .number({
      error: "Established year is required.",
    })
    .min(1800, "Enter a valid established year.")
    .max(new Date().getFullYear(), "Established year cannot be in the future."),

  website: z.string().trim().url("Enter a valid website URL.").optional().or(z.literal("")),

  // Document
  supportingDocument: z.union([z.instanceof(File), z.literal(null), z.undefined()]).optional(),

  // Existing Admin fields
  type: z
    .enum([
      "Private",
      "Government",
      "CoachingCentre",
      "College",
    ] as [SchoolType, ...SchoolType[]])
    .optional(),

  board: z
    .enum([
      "CBSE",
      "ICSE",
      "JKBOSE",
      "StateBoard",
      "IGCSE",
      "Other",
    ] as [BoardType, ...BoardType[]])
    .optional(),

  adminFirstName: z.string().trim().optional().or(z.literal("")),

  adminLastName: z.string().trim().optional().or(z.literal("")),

  adminEmail: z.string().trim().optional().or(z.literal("")),

  adminPassword: z.string().optional().or(z.literal("")),

  adminPhone: z.string().trim().optional().or(z.literal("")),

  password: z
    .string()
    .trim()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character."),
});

export type RegisterSchoolFormData = z.infer<typeof registerSchoolSchema>;