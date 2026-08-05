import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Captcha from "@/shared/components/Captcha";
import FileUploadInput from "@/shared/components/ui/FileUploadInput";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";

import { authApi } from "../../services";
import { Section } from "../FormControls";
import type { FileUploadValue } from "@/shared/types";
import SearchableDropdown from "@/shared/components/ui/SearchableDropdown";
import { registerTeacherSchema } from "../../schemas/teacher-schema/registerTeacherSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
const qualificationOptions = [
  { label: "B.Ed", value: "B.Ed" },
  { label: "M.Ed", value: "M.Ed" },
  {
    label: "BSc Degree Guide 2025 — Online BSc Courses & Programs",
    value: "BSc Degree Guide 2025 — Online BSc Courses & Programs",
  },
  { label: "M.Sc", value: "M.Sc" },
  { label: "B.A", value: "B.A" },
  { label: "M.A", value: "M.A" },
  { label: "B.Com", value: "B.Com" },
  { label: "M.Com", value: "M.Com" },
  { label: "Ph.D", value: "Ph.D" },
  { label: "Other", value: "Other" },
];
const experienceOptions = [
  { label: "Fresher", value: "Fresher" },
  { label: "1 Year", value: "1 Year" },
  { label: "2 Years", value: "2 Years" },
  { label: "3 Years", value: "3 Years" },
  { label: "5 Years", value: "5 Years" },
  { label: "10+ Years", value: "10+ Years" },
];

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response
    ?.data?.message;
}

type TeacherRegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  qualification: string;
  experience: string;
  document: FileUploadValue | null;
  profilePhoto?: FileUploadValue | null;
  otherQualification: string;
};

export default function TeacherRegisterForm({
  schoolId,
  onSuccess,
}: {
  schoolId: string;
  onSuccess: (message: string) => void;
}) {
  const [captcha, setCaptcha] = useState<string | undefined>();

const methods = useForm<TeacherRegisterFormData>({
  resolver: zodResolver(registerTeacherSchema),
  mode: "onChange", // or "onSubmit"
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    qualification: "",
    experience: "",
    document: undefined,
    profilePhoto: undefined,
    otherQualification: "",
  },
});

   const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedQualification = methods.watch("qualification");

  const registerTeacher = useMutation({
    mutationFn: (data: TeacherRegisterFormData) =>
      authApi.registerMember({
        ...data,
        profilePhoto: data.profilePhoto?.file ?? null,
        document: data.document?.file ?? null,
        schoolId,
        role: "Teacher",
        captchaToken: captcha,
      }),

    onSuccess: (response) => {
      onSuccess(response.message);
    },

    onError: (error) => {
      toast.error(errorMessage(error) ?? "Could not submit registration");
    },
  });

  const onSubmit = (data: TeacherRegisterFormData) => {
    registerTeacher.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section title="Your Details" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextFieldInput
            name="firstName"
            label="First Name"
            type="name"
            placeholder="First name"
            required
            error={errors.firstName}
          />

          <TextFieldInput
            name="lastName"
            label="Last Name"
            type="name"
            placeholder="Last name"
            required
            error={errors.lastName}
          />
        </div>

        <TextFieldInput
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          required
          error={errors.email}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <SearchableDropdown
              name="qualification"
              label="Qualification"
              placeholder="Select Qualification"
              options={qualificationOptions}
              searchable={false}
              error={errors.qualification?.message}
            />

            {selectedQualification === "Other" && (
              <div className="mt-3">
                <TextFieldInput
                  name="otherQualification"
                  label="Other Qualification"
                  placeholder="Write your qualification"
                  required
                  error={errors.otherQualification}
                />
              </div>
            )}
          </div>

          <SearchableDropdown
            name="experience"
            label="Teaching Experience"
            placeholder="Select Teaching Experience"
            options={experienceOptions}
            searchable={false}
            error={errors.experience?.message}
          />
        </div>

        {/* <Section title="Profile Photo" />

        <FileUploadInput
          name="profilePhoto"
          label="Profile Photo"
          accept="image/png,image/jpeg,image/jpg"
          maxSizeInMB={5}
          placeholder="Upload profile photo"
          helperText="PNG or JPG only (max 5MB)"
        /> */}

        <FileUploadInput
          name="document"
          label="Upload Document"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          maxSizeInMB={10}
          placeholder="Upload qualification or experience document"
          helperText="PDF, DOC, DOCX, JPG or PNG (max 10MB)"
          required
          error={errors.document?.message as string}
        />

        {/* <div>
          <Captcha onChange={setCaptcha} />

          {!captcha && (
            <p className="mt-1 text-xs text-red-500">Please complete captcha</p>
          )}
        </div> */}
        <button
          type="submit"
          // disabled={registerTeacher.isPending || !captcha}
          className="
    btn-primary
    mt-2
    flex
    w-full
    items-center
    justify-center
    gap-2
    py-3
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
        >
          {registerTeacher.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Register as Teacher"
          )}
        </button>
      </form>
    </FormProvider>
  );
}
