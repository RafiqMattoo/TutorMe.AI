import { z } from "zod";
import type { BoardType, SchoolType } from "@/shared/types";

export const registerSchoolSchema = z.object({
 // School Details
schoolName: z
  .string()
  .trim()
  .min(1, "School name is required.")
  .min(2, "School name must be at least 2 characters."),

schoolRegistrationNumber: z
  .string()
  .trim()
  .min(1, "School registration number is required."),

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
state: z
  .string()
  .trim()
  .min(1, "State is required."),

city: z
  .string()
  .trim()
  .min(1, "City is required."),

// Address
address: z.object({
  houseNo: z
    .string()
    .trim()
    .optional(),

  street: z
    .string()
    .trim()
    .min(1, "Street is required."),

  area: z
    .string()
    .trim()
    .min(1, "Area is required."),

  landmark: z
    .string()
    .trim()
    .min(1, "Landmark is required."),
}),

// School Information
principalName: z
  .string()
  .trim()
  .min(1, "Principal name is required.")
  .min(2, "Principal name must be at least 2 characters."),

establishedYear: z.coerce
  .number({
    error: "Established year is required.",
  })
  .min(1800, "Enter a valid established year.")
  .max(
    new Date().getFullYear(),
    "Established year cannot be in the future."
  ),

website: z
  .string()
  .trim()
  .url("Enter a valid website URL.")
  .optional()
  .or(z.literal("")),

// Document
supportingDocument: z
  .instanceof(File)
  .nullable()
  .refine((file) => file !== null, {
    message: "Please upload a supporting document.",
  }),

// Existing Admin fields
type: z.enum(
  [
    "Private",
    "Government",
    "CoachingCentre",
    "College",
  ] as [SchoolType, ...SchoolType[]],
  {
    error: "Please select a school type.",
  }
),

board: z.enum(
  [
    "CBSE",
    "ICSE",
    "JKBOSE",
    "StateBoard",
    "IGCSE",
    "Other",
  ] as [BoardType, ...BoardType[]],
  {
    error: "Please select a board.",
  }
),

adminFirstName: z
  .string()
  .trim()
  .min(1, "First name is required.")
  .min(2, "First name must be at least 2 characters."),

adminLastName: z
  .string()
  .trim()
  .min(1, "Last name is required.")
  .min(2, "Last name must be at least 2 characters."),

adminEmail: z
  .string()
  .trim()
  .min(1, "Admin email is required.")
  .email("Please enter a valid admin email address."),

adminPassword: z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character."),

adminPhone: z
 .string()
  .trim()
  .min(1, "Phone number is required.")
  .regex(/^[0-9]{10,15}$/, "Please enter a valid phone number."),
});


export type RegisterSchoolFormData =
  z.infer<typeof registerSchoolSchema>;