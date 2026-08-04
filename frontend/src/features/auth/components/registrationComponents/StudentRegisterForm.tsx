import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

import Captcha from "@/shared/components/Captcha"
import { authApi } from "../../services"
import { Section } from "../FormControls"
import TextFieldInput from "@/shared/components/ui/TextFieldInput"
import SearchableDropdown from "@/shared/components/ui/SearchableDropdown"
import DatePickerInput from "@/shared/components/ui/DatePickerInput"
import FileUploadInput from "@/shared/components/ui/FileUploadInput"
import Button from "@/shared/components/ui/customButton/button"

import { studentSchema, StudentFormData } from "../../schemas/student-schema/StudentSchema"
import {

  guardianRelationOptions, 
} from "@/data/RegistrationData"

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response?.data?.message
}

export default function StudentRegisterForm({
  schoolId,
  onSuccess,
}: {
  schoolId: string
  onSuccess: (message: string) => void
}) {
  const [captcha, setCaptcha] = useState<string>()

  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", phone: "",
    
     guardianName: "",
      guardianRelation: "", guardianPhone: "", parentEmail: "", 
    },
  })

  const { handleSubmit, watch, setValue, formState: { errors } } = methods
  const selectedState = watch("state")
  // const cityOptions = selectedState ? cityOptionsByState[selectedState] ?? [] : []

  const registerStudent = useMutation({
    mutationFn: (data: StudentFormData) => {
      const formData = new FormData()

      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "") return

        // FileUploadInput values look like { name, size, type, uri, file }
        if (val && typeof val === "object" && "file" in val) {
          formData.append(key, (val as { file: File }).file)
        } else {
          formData.append(key, String(val))
        }
      })

      formData.append("schoolId", schoolId)
      formData.append("role", "Student")
      if (captcha) formData.append("captchaToken", captcha)

      return authApi.registerMember(formData as unknown as Record<string, unknown>)
    },
    onSuccess: (response) => onSuccess(response.message),
    onError: (error) => toast.error(errorMessage(error) ?? "Could not submit registration"),
  })

  const onSubmit = (data: StudentFormData) => registerStudent.mutate(data)

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">

        <Section title="" />
        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput name="firstName" label="First Name" type="name" placeholder="First name" required error={errors.firstName} />
          <TextFieldInput name="lastName" label="Last Name" type="name" placeholder="Last name" required error={errors.lastName} />
        </div>

        <TextFieldInput name="email" label="Email" type="email" placeholder="Email" required error={errors.email} />

        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput name="password" label="Password" type="password" placeholder="Password" required error={errors.password} />
          <TextFieldInput name="phone" label="Phone Number" type="phone" placeholder="Phone number" required error={errors.phone} />
        </div>

        {/* <div className="grid grid-cols-2 gap-3">
          <SearchableDropdown name="gender" label="Gender" options={genderOptions} placeholder="Select gender" error={errors.gender?.message} />

          <DatePickerInput
            name="dateOfBirth"
            label="Date of Birth"
            required
            error={errors.dateOfBirth?.message}
          />
        </div> */}
{/* 
        <TextFieldInput name="address" label="Address" type="address" placeholder="Address" required error={errors.address} /> */}

        {/* <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Section title="Student profile" />

          <div className="grid grid-cols-2 gap-3">
            <SearchableDropdown name="grade" label="Grade" options={gradeOptions} placeholder="Select grade" searchable error={errors.grade?.message} />
            <SearchableDropdown name="section" label="Section" options={sectionOptions} placeholder="Select section" error={errors.section?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextFieldInput name="rollNumber" label="Roll Number" placeholder="Roll number" required error={errors.rollNumber} />
            <TextFieldInput name="admissionNumber" label="Admission Number" placeholder="Admission number" required error={errors.admissionNumber} />
          </div>

          <SearchableDropdown name="bloodGroup" label="Blood Group" options={bloodGroupOptions} placeholder="Select blood group" optional error={errors.bloodGroup?.message} />
        </div> */}

        {/* <Section title="Location" />
        <div className="grid grid-cols-2 gap-3">
          <SearchableDropdown
            name="state" label="State" options={stateOptions} placeholder="Select state" searchable
            error={errors.state?.message}
            onChange={() => setValue("city", "")}
          />
          <SearchableDropdown
            name="city" label="City" options={cityOptions}
            placeholder={selectedState ? "Select city" : "Select a state first"}
            disabled={!selectedState}
            error={errors.city?.message}
          />
        </div> */}

        {/* <Section title="" /> */}
        {/* <div className="grid grid-cols-2 gap-3">
          <TextFieldInput name="guardianName" label="Guardian Name" type="name" placeholder="Guardian name" required error={errors.guardianName} />
          <SearchableDropdown name="guardianRelation" label="Guardian Relation" options={guardianRelationOptions} placeholder="Select relation" error={errors.guardianRelation?.message} />
        </div> */}
          
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <TextFieldInput name="guardianName" label="Guardian Name" type="name" placeholder="Guardian name" required error={errors.guardianName} />
                  <SearchableDropdown name="guardianRelation" label="Guardian Relation" options={guardianRelationOptions} placeholder="Select relation" error={errors.guardianRelation?.message} />
                </div>

        <div className="grid grid-cols-2 gap-3">
          <TextFieldInput name="guardianPhone" label="Guardian Phone" type="phone" placeholder="Guardian phone" required error={errors.guardianPhone} />
          <TextFieldInput name="parentEmail" label="Parent Email" type="email" placeholder="Parent email" required error={errors.parentEmail} />
        </div>

        <Section title="" />

        {/* <FileUploadInput
          name="profilePhoto"
          label="Profile Photo"
          accept=".jpg,.jpeg,.png"
          required
          error={errors.profilePhoto?.message as string}
        /> */}

        <FileUploadInput
          name="idDocument"
          label="Student ID Card / Birth Certificate"
          optional
          accept=".pdf,.jpg,.jpeg,.png"
          error={errors.idDocument?.message as string}
        />

        <Captcha onChange={setCaptcha} />

        <Button
          type="submit"
          color="primary"
          fullWidth
          loading={registerStudent.isPending}
          disabled={!schoolId}
          className="mt-2"
        >
          Signup
        </Button>

      </form>
    </FormProvider>
  )
}