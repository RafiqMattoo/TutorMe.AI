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
import { registerTeacherSchema } from "../../schemas/teacher-schema/registerTeacherSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

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
  profilePhoto: FileUploadValue | null;
  document: FileUploadValue | null;
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
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      qualification: "",
      experience: "",
      document: undefined,
      // profilePhoto: undefined,
    },
  });

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
  const {
  handleSubmit,
  formState: { errors },
} = methods;

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
          <TextFieldInput
            name="qualification"
            required
            label="Qualification"
            type="text"
            placeholder="Qualification"
            error={errors.qualification}
          />

          <TextFieldInput
            name="experience"
            label="Experience"
            type="text"
            placeholder="Experience"
            error={errors.experience}
            required
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

        {/* <Section title="Supporting Document" /> */}

        <FileUploadInput
          name="document"
          label="Qualification / Experience Document"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          maxSizeInMB={10}
          placeholder="Upload qualification or experience document"
          helperText="PDF, DOC, DOCX, JPG or PNG (max 10MB)"
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
