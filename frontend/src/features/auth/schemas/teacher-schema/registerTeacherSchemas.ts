import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const registerTeacherSchema = z.object({
  firstName: z
  .string()
  .trim()
  .min(1, "First name is required.")
  .min(2, "First name must be at least 2 characters.")
  .max(50, "First name cannot exceed 50 characters."),

lastName: z
  .string()
  .trim()
  .min(1, "Last name is required.")
  .min(2, "Last name must be at least 2 characters.")
  .max(50, "Last name cannot exceed 50 characters."),

email: z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Please enter a valid email address."),

qualification: z
  .string()
  .trim()
  .min(1, "Qualification is required.")
  .min(2, "Qualification must be at least 2 characters.")
  .max(100, "Qualification cannot exceed 100 characters."),

experience: z
  .string()
  .trim()
  .min(1, "Experience is required."),

  // Optional profile photo
  // profilePhoto: z
  //   .instanceof(File)
  //   .optional()
  //   .refine(
  //     (file) => !file || file.size <= 5 * 1024 * 1024,
  //     "Profile photo must be less than 5MB."
  //   )
  //   .refine(
  //     (file) =>
  //       !file ||
  //       ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
  //     "Only JPG and PNG images are allowed."
  //   ),

  document: z
    .instanceof(File, {
      message: "Please upload a qualification or experience document.",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must not exceed 10MB."
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed."
    ),
});

export type RegisterTeacherFormData = z.infer<
  typeof registerTeacherSchema
>;