import { z } from "zod"

const MAX_FILE_SIZE_MB = 5
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"]
const DOC_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"]

function hasAllowedExtension(fileName: string, allowed: string[]) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  return allowed.includes(ext)
}

// FileUploadInput's value shape is { name, size, type, uri, file }, not a raw File
const fileUploadValueSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  uri: z.string(),
  file: z.instanceof(File),
})

const profilePhotoSchema = fileUploadValueSchema
  .refine((val) => hasAllowedExtension(val.name, IMAGE_EXTENSIONS), {
    message: "Only JPG, JPEG, PNG files are allowed",
  })
  .refine((val) => val.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
    message: `File must be under ${MAX_FILE_SIZE_MB}MB`,
  })

const idDocumentSchema = fileUploadValueSchema
  .refine((val) => hasAllowedExtension(val.name, DOC_EXTENSIONS), {
    message: "Only PDF, JPG, JPEG, PNG files are allowed",

  })

  .refine((val) => val.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
    message: `File must be under ${MAX_FILE_SIZE_MB}MB`,
  
  })
    .nullable()
  .optional()
   .refine((val) => val !== null && val !== undefined, {
    message: "Please upload the student ID card or birth certificate",
  })

  
export const studentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),

  phone: z.string().min(10, "Enter a valid phone number"),

  grade: z.string().min(1, "Please select a grade"),
  section: z.string().min(1, "Please select a section"),
  rollNumber: z.string().min(1, "Roll number is required"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  gender: z.string().min(1, "Please select a gender"),

  dateOfBirth: z
    .string()
    .min(1, "please select a date of birth")
    .refine((date) => new Date(date) <= new Date(), { message: "Date of birth cannot be in the future" }),

  address: z.string().min(5, "Address is required"),
  bloodGroup: z.string().optional(),

  guardianName: z.string().min(2, "Guardian name is required"),
  guardianRelation: z.string().min(1, "Please select guardian relation"),
  guardianPhone: z.string().min(10, "Enter a valid guardian phone number"),
  parentEmail: z.string().email("Please enter a valid parent email"),

  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),

  profilePhoto: profilePhotoSchema,
  idDocument: idDocumentSchema,
})

export type StudentFormData = z.infer<typeof studentSchema>