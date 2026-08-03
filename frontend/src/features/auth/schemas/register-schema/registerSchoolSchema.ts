import { z } from "zod";
import type { BoardType, SchoolType } from "@/shared/types";

export const registerSchoolSchema = z.object({
  // School Details
  schoolName: z
    .string()
    .trim()
    .min(2, "School name is required."),

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
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number is too long."),


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
    .min(2, "Principal name is required."),


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
    .min(2, "First name is required."),

  adminLastName: z
    .string()
    .trim()
    .min(2, "Last name is required."),

  adminEmail: z
    .string()
    .email("Please enter a valid admin email address."),

  adminPassword: z
    .string()
    .min(8, "Password must be at least 8 characters."),

  adminPhone: z
    .string()
    .trim()
    .min(10, "Phone number is required."),

});


export type RegisterSchoolFormData =
  z.infer<typeof registerSchoolSchema>;