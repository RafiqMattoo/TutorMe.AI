import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import type { BoardType, SchoolType } from "@/shared/types";
import Captcha from "@/shared/components/Captcha";

import { authApi } from "../../services";
import { Section } from "../FormControls";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";
import SearchableDropdown from "@/shared/components/ui/SearchableDropdown";

const boards: BoardType[] = [
  "CBSE",
  "ICSE",
  "JKBOSE",
  "StateBoard",
  "IGCSE",
  "Other",
];

const schoolTypes: SchoolType[] = [
  "Private",
  "Government",
  "CoachingCentre",
  "College",
];

function errorMessage(error: unknown) {
  return (error as {
    response?: { data?: { message?: string } };
  })?.response?.data?.message;
}

type Props = {
  onSuccess: (message: string) => void;
  captcha: string | undefined;
  setCaptcha: (value: string | undefined) => void;
};

export default function SchoolRegisterForm({
  onSuccess,
  captcha,
  setCaptcha,
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext();

  const getErrorMessage = (error: any): string | undefined => {
    return error?.message;
  };

  const registerSchool = useMutation({
    mutationFn: (data: any) =>
      authApi.registerSchool({
        ...data,
        captchaToken: captcha,
      }),

    onSuccess: (response) => {
      onSuccess(response.message);
    },

    onError: (error) => {
      toast.error(
        errorMessage(error) ?? "Could not register school"
      );
    },
  });


  const onSubmit = (data: any) => {
    registerSchool.mutate(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Section title="School details" />


      <TextFieldInput
        name="schoolName"
        label="School Name"
        placeholder="Enter school name"
        error={getErrorMessage(errors.schoolName)}
      />


      <div className="grid grid-cols-2 gap-3">

        <TextFieldInput
          name="city"
          label="City"
          placeholder="Enter city"
          error={getErrorMessage(errors.city)}
        />


        <TextFieldInput
          name="state"
          label="State"
          placeholder="Enter state"
          error={getErrorMessage(errors.state)}
        />

      </div>



      <div className="grid grid-cols-2 gap-3">

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SearchableDropdown
              label="School Type"
              options={schoolTypes.map((item) => ({
                label: item,
                value: item,
              }))}
              value={field.value}
              onChange={field.onChange}
              error={getErrorMessage(errors.type)}
            />
          )}
        />


        <Controller
          name="board"
          control={control}
          render={({ field }) => (
            <SearchableDropdown
              label="Board"
              options={boards.map((item) => ({
                label: item,
                value: item,
              }))}
              value={field.value}
              onChange={field.onChange}
              error={getErrorMessage(errors.board)}
            />
          )}
        />

      </div>



      <div className="grid grid-cols-2 gap-3">

        <TextFieldInput
          name="phone"
          label="School Phone"
          placeholder="Enter phone number"
          error={getErrorMessage(errors.phone)}
        />


        <TextFieldInput
          name="email"
          label="School Email"
          type="email"
          placeholder="Enter school email"
          error={getErrorMessage(errors.email)}
        />

      </div>



      <Section title="Admin account" />


      <div className="grid grid-cols-2 gap-3">

        <TextFieldInput
          name="adminFirstName"
          label="First Name"
          placeholder="Enter first name"
          error={getErrorMessage(errors.adminFirstName)}
        />


        <TextFieldInput
          name="adminLastName"
          label="Last Name"
          placeholder="Enter last name"
          error={getErrorMessage(errors.adminLastName)}
        />

      </div>



      <TextFieldInput
        name="adminEmail"
        label="Admin Email"
        type="email"
        placeholder="Enter admin email"
        error={getErrorMessage(errors.adminEmail)}
      />



      <div className="grid grid-cols-2 gap-3">

        <TextFieldInput
          name="adminPassword"
          label="Password"
          type="password"
          placeholder="Enter password"
          error={getErrorMessage(errors.adminPassword)}
        />


        <TextFieldInput
          name="adminPhone"
          label="Phone"
          placeholder="Enter phone number"
          error={getErrorMessage(errors.adminPhone)}
        />

      </div>



      <Captcha onChange={setCaptcha} />



      <button
        type="submit"
        disabled={registerSchool.isPending}
        className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3"
      >
        {registerSchool.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting…
          </>
        ) : (
          "Register school"
        )}
      </button>

    </form>
  );
}