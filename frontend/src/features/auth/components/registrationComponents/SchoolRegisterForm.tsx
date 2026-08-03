import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

import type {
  BoardType,
  SchoolType,
  RegisterSchoolFormData,
} from "@/shared/types";

import Captcha from "@/shared/components/Captcha";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";
import SearchableDropdown from "@/shared/components/ui/SearchableDropdown";
import Button from "@/shared/components/ui/customButton/button";

import { authApi } from "../../services";
import { Section } from "../FormControls";
import { stateCityData } from "@/shared/data/indiaStatesCities";
import { useEffect } from "react";

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

  // ✅ Updated form context
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterSchoolFormData>();


  // ✅ Watch selected state
  const selectedState = watch("state");


  // ✅ Clear city when state changes
  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);


  // ✅ State dropdown options
  const stateOptions = stateCityData.map((item) => ({
    label: item.state,
    value: item.state,
  }));


  // ✅ City dropdown options based on selected state
  const cityOptions =
    stateCityData
      .find((item) => item.state === selectedState)
      ?.cities.map((city) => ({
        label: city,
        value: city,
      })) ?? [];



  // ✅ Keep your existing mutation code here
  const registerSchool = useMutation({
    mutationFn: (data: RegisterSchoolFormData) =>
      authApi.registerSchool({
        ...data,
        captchaToken: captcha,
      }),

    onSuccess: (response) => {
      onSuccess(response.message);
    },

    onError: (error) => {
      toast.error(errorMessage(error) ?? "Could not register school");
    },
  });



  // ✅ Keep your existing submit function
  const onSubmit = (data: RegisterSchoolFormData) => {
    registerSchool.mutate(data);
  };

  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-5">
      <Section title="School details" />
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TextFieldInput
        name="schoolName"
        type="text"
        label="School Name"
        placeholder="Enter school name"
        error={errors.schoolName}
      />

      <TextFieldInput
  name="schoolRegistrationNumber"
  type="number"
  label="School Registration Number"
  placeholder="Enter registration number (optional)"
  error={errors.schoolRegistrationNumber}
/>
</div>
{/* <Section title="School Address" /> */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
<TextFieldInput
  name="address.houseNo"
  type="number"
  label="House No./Building No."
  placeholder="Enter house/building number"
  error={errors.address?.houseNo}
/>

<TextFieldInput
  name="address.street"
  type="text"
  label="Street"
  placeholder="Enter street"
  error={errors.address?.street}
/>
</div>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

<TextFieldInput
  name="address.area"
  type="text"
  label="Area"

  placeholder="Enter area"
  error={errors.address?.area}
/>

<TextFieldInput

  name="address.landmark"
  type="text"
  label="Landmark"
  placeholder="Enter landmark"
  error={errors.address?.landmark}
/>
</div>

{/* <Section title="School Information" /> */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
<TextFieldInput
  name="principalName"
  type="text"
  label="Principal Name"
  placeholder="Enter principal name"
  error={errors.principalName}
/>

<TextFieldInput
  name="establishedYear"
  label="Established Year"
  type="number"
  placeholder="e.g. 1998"
  error={errors.establishedYear}
/>
</div>

<TextFieldInput
  name="website"
  label="Website"
  type="text"
  placeholder="https://example.com"
  error={errors.website}
/>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

  <Controller
    name="state"
    control={control}
    render={({ field }) => (
      <SearchableDropdown
        label="State"
        placeholder="Select state"
        searchable
        options={stateOptions}
        value={field.value}
        onChange={field.onChange}
        error={errors.state?.message}
      />
    )}
  />


  <Controller
    name="city"
    control={control}
    render={({ field }) => (
      <SearchableDropdown
        label="City"
        placeholder={
          selectedState
            ? "Select city"
            : "Select state first"
        }
        searchable
        options={cityOptions}
        value={field.value}
        onChange={field.onChange}
        error={errors.city?.message}
      />
    )}
  />

</div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              error={errors.type?.message}
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
              error={errors.board?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextFieldInput
          name="phone"
          label="School Phone"
          type="number"
          placeholder="Enter phone number"
          error={errors.phone}
        />

        <TextFieldInput
  name="email"
  label="School Email"
  type="email"
  placeholder="Enter school email"
  error={errors.email?.message}
/>
      </div>

      {/* <Section title="Admin account" /> */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextFieldInput
          name="adminFirstName"
          label="First Name"
          type="text"
          placeholder="Enter first name"
          error={errors.adminFirstName}
        />

        <TextFieldInput
          name="adminLastName"
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          error={errors.adminLastName}
        />
      </div>

      <TextFieldInput
        name="adminEmail"
        label="Admin Email"
        type="email"
        placeholder="Enter admin email"
        error={errors.adminEmail}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextFieldInput
          name="adminPassword"
          label="Password"
          type="password"
          placeholder="Enter password"
          error={errors.adminPassword}
        />

        <TextFieldInput
          name="adminPhone"
          label="Phone"
          type="number"
          placeholder="Enter phone number"
          error={errors.adminPhone}
        />
      </div>

      {/* <Section title="Supporting Documents" /> */}

<Controller
  name="supportingDocument"
  control={control}
  render={({ field }) => (
    <div className="space-y-2 rounded-2xl border border-dashed border-slate-300 p-4 sm:p-5">

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600 transition-colors hover:bg-slate-50 sm:flex-row sm:justify-center">
        <span className="font-medium">Upload Supporting Document</span>

        <input
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
         onChange={(event) => {
  const file = event.target.files?.[0];

  if (!file) return;


  const allowedTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
  ];


  if (!allowedTypes.includes(file.type)) {
    toast.error(
      "Unsupported file type. Please upload PDF, JPG, JPEG, or PNG files only."
    );

    event.target.value = "";
    field.onChange(undefined);

    return;
  }


  field.onChange(file);
}}
        />
      </label>


      {field.value && (
        <p className="text-sm text-slate-500">
          Selected file: {field.value.name}
        </p>
      )}


      {errors.supportingDocument && (
        <p className="text-xs text-red-500">
          {errors.supportingDocument.message}
        </p>
      )}

    </div>
  )}
/>

      <Captcha onChange={setCaptcha} />

      <Button
      rounded="lg"
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        loading={registerSchool.isPending}
        className="mt-2"
        // rounded="xl"
      >
        Register school
      </Button>
    </form>
  );
}