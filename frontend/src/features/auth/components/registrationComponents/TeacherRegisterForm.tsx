import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Captcha from "@/shared/components/Captcha";
import SearchableDropdown from "@/shared/components/ui/SearchableDropdown";

import { authApi } from "../../services";
import { Section } from "../FormControls";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response
    ?.data?.message;
}

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];
const subjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Computer", label: "Computer" },
  { value: "Social Studies", label: "Social Studies" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Hindi", label: "Hindi" },
  { value: "Urdu", label: "Urdu" },
  { value: "Other", label: "Other" },
];
const qualificationOptions = [
  { value: "B.Ed", label: "B.Ed" },
  { value: "M.Ed", label: "M.Ed" },
  { value: "B.Sc", label: "B.Sc" },
  { value: "M.Sc", label: "M.Sc" },
  { value: "B.A", label: "B.A" },
  { value: "M.A", label: "M.A" },
  { value: "B.Com", label: "B.Com" },
  { value: "M.Com", label: "M.Com" },
  { value: "Ph.D", label: "Ph.D" },
  { value: "Other", label: "Other" },
];
const teachingExperienceOptions = [
  { value: "Fresher", label: "Fresher" },
  { value: "1 Year", label: "1 Year" },
  { value: "2 Years", label: "2 Years" },
  { value: "3 Years", label: "3 Years" },
  { value: "5 Years", label: "5 Years" },
  { value: "10+ Years", label: "10+ Years" },
];

export default function TeacherRegisterForm({
  schoolId,
  onSuccess,
}: {
  schoolId: string;
  onSuccess: (message: string) => void;
}) {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      subject: "",
      employeeId: "",
      qualification: "",
      teachingExperience: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      teacherId: "",
    },
  });

  const { handleSubmit } = methods;

  const [captcha, setCaptcha] = useState<string | undefined>();

  const [teacher, setTeacher] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    subject: "",
    employeeId: "",
    qualification: "",
    teachingExperience: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    teacherId: "",
    profilePhoto: null as File | null,
  });
  const registerTeacher = useMutation({
    mutationFn: (data: any) =>
      authApi.registerMember({
        ...data,
        profilePhoto: teacher.profilePhoto,
        schoolId,
        role: "Teacher",
        captchaToken: captcha,
      }),
    onSuccess: (response) => onSuccess(response.message),
    onError: (error) =>
      toast.error(errorMessage(error) ?? "Could not submit registration"),
  });
  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <Section title="Your details" />

        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput
            name="firstName"
            label="First Name"
            type="name"
            required
          />

          <TextFieldInput
            name="lastName"
            label="Last Name"
            type="name"
            required
          />
        </div>

        <TextFieldInput name="email" label="Email" type="email" required />

        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput
            name="password"
            label="Password"
            type="password"
            required
          />

          <TextFieldInput name="phone" label="Phone" type="phone" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput name="employeeId" label="Employee ID" required />

          <TextFieldInput name="teacherId" label="Teacher ID" required />
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          <SearchableDropdown
            name="subject"
            label="Subject"
            placeholder="Select Subject"
            options={subjectOptions}
            searchable
          />
          <SearchableDropdown
            name="qualification"
            label="Qualification"
            placeholder="Select Qualification"
            options={qualificationOptions}
            searchable
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pb-4">
          <SearchableDropdown
            name="teachingExperience"
            label="Teaching Experience"
            placeholder="Select Teaching Experience"
            options={teachingExperienceOptions}
            searchable
          />
          <SearchableDropdown
            name="gender"
            label="Gender"
            placeholder="Select Gender"
            options={genderOptions}
            searchable
          />
        </div>
        <div className="grid grid-cols-2 gap-3 ">
          <input
            type="date"
            className="input"
            max={new Date().toISOString().split("T")[0]}
            value={teacher.dateOfBirth}
            onChange={(e) =>
              setTeacher((t) => ({
                ...t,
                dateOfBirth: e.target.value,
              }))
            }
          />

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              const validTypes = ["image/jpeg", "image/jpg", "image/png"];

              if (!validTypes.includes(file.type)) {
                toast.error("Only JPG, JPEG and PNG files are allowed.");
                return;
              }

              setTeacher((t) => ({
                ...t,
                profilePhoto: file,
              }));
            }}
          />
          {teacher.profilePhoto && (
            <img
              src={URL.createObjectURL(teacher.profilePhoto)}
              alt="Preview"
              className="mt-3 h-24 w-24 rounded-full object-cover"
            />
          )}
        </div>

        <textarea
          rows={4}
          className="input"
          placeholder="Address"
          value={teacher.address}
          onChange={(e) =>
            setTeacher((t) => ({ ...t, address: e.target.value }))
          }
        />

        <Captcha onChange={setCaptcha} />
        <button
          onClick={handleSubmit((data) => registerTeacher.mutate(data))}
          disabled={registerTeacher.isPending || !schoolId}
          className="btn-primary mt-2 w-full py-3"
        >
          {registerTeacher.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Submitting…
            </>
          ) : (
            "Register as teacher"
          )}
        </button>
      </div>
    </FormProvider>
  );
}
