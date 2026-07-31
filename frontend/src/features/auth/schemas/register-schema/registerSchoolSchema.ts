import { z } from "zod";
import type { BoardType, SchoolType } from "@/shared/types";

export const registerSchoolSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, "School name must be at least 2 characters.")
    .max(100, "School name cannot exceed 100 characters."),

  city: z
    .string()
    .trim()
    .min(2, "City is required."),

  state: z
    .string()
    .trim()
    .min(2, "State is required."),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number is too long."),

  email: z
    .email("Please enter a valid school email address."),

  type: z.enum(
    [
      "Private",
      "Government",
      "CoachingCentre",
      "College",
    ] as [SchoolType, ...SchoolType[]]
  ),

  board: z.enum(
    [
      "CBSE",
      "ICSE",
      "JKBOSE",
      "StateBoard",
      "IGCSE",
      "Other",
    ] as [BoardType, ...BoardType[]]
  ),

  adminFirstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  adminLastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name cannot exceed 50 characters."),

  adminEmail: z
    .email("Please enter a valid admin email address."),

  adminPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain uppercase, lowercase, number and special character."
    ),

  adminPhone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number is too long."),

    schoolRegistrationNumber: z.string().optional(),

  address: z.object({
    houseNo: z.string().optional(),

    street: z
      .string()
      .min(1, "Street address is required."),

    area: z
      .string()
      .min(1, "Area is required."),

    landmark: z
      .string()
      .min(1, "Landmark is required."),
  }),

  principalName: z
    .string()
    .min(2, "Principal name is required."),

  establishedYear: z
    .number()
    .min(1800, "Enter a valid year.")
    .max(new Date().getFullYear(), "Year cannot be in the future."),

  website: z
    .string()
    .url("Enter a valid website URL.")
    .optional()
    .or(z.literal("")),

    

});

export type RegisterSchoolFormData = z.infer<
  typeof registerSchoolSchema
>;

