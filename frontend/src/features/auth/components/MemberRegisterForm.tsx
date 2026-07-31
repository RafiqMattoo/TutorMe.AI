// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Select from "react-select";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

// import { authApi } from "../services";
// import type { UserRole } from "../../../shared/types";
// import Captcha from "../../../../src/shared/components/Captcha";
// import { Field, Section, PasswordInput } from "./FormControls";

// import { SignupFormData,signupSchema } from "../schemas/register-schema/registerSchema";
  
 


// function err(e: unknown) {
//   return (
//     e as {
//       response?: {
//         data?: {
//           message?: string;
//         };
//       };
//     }
//   )?.response?.data?.message;
// }

// export default function MemberRegisterForm({
//   onSuccess,
// }: {
//   onSuccess: (message: string) => void;
// }) {
//   const [captcha, setCaptcha] = useState<string | undefined>();

//   const { data: schools } = useQuery({
//     queryKey: ["public-schools"],
//     queryFn: authApi.publicSchools,
//   });




//  const options = [
//   ...(schools ?? []).map((school) => ({
//     value: school.id,
//     label: school.name,
//   })),

//   { value: "demo-1", label: "Green Valley School" },
//   { value: "demo-2", label: "Delhi Public School" },
//   { value: "demo-3", label: "Oxford Public School" },
//   { value: "demo-4", label: "St. Mary's School" },
//   { value: "demo-5", label: "Bright Future Academy" },
// ];






//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//     mode: "onChange",
//     defaultValues: {
//       schoolId: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "Student",
//       phone: "",
//       termsAccepted: false,
//     },
//   });

//   const registerMember = useMutation({
//     mutationFn: (data: SignupFormData) => {
//       const { confirmPassword, termsAccepted, ...memberData } = data;

//       return authApi.registerMember({
//         ...memberData,
//         captchaToken: captcha,
//       });
//     },

//     onSuccess: (r) => onSuccess(r.message),

//     onError: (e) =>
//       toast.error(err(e) ?? "Could not submit registration"),
//   });

//   const onSubmit = (data: SignupFormData) => {
//     registerMember.mutate(data);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-3"
//     >
//       <Section title="Your school" />

//       <Field id="schoolId" label="School *">
//         <Controller
//           control={control}
//           name="schoolId"
//           render={({ field }) => (
//             <Select
//               options={options}
//               placeholder="Select your school"
//               value={options.find(
//                 (o) => o.value === field.value
//               )}
//               onChange={(selected) =>
//                 field.onChange(selected?.value ?? "")
//               }
//               isSearchable
//             />
            
//           )}
//         />
//         {errors.schoolId && (
//           <p className="mt-1 text-sm text-red-500">
//             {errors.schoolId.message}
//           </p>
//         )}
//       </Field>

//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//         <Field id="firstName" label="First name *">
//           <input
//             id="firstName"
//             className="input"
//             placeholder="First name"
//             {...register("firstName")}
//           />
//           {errors.firstName && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.firstName.message}
//             </p>
//           )}
//         </Field>

//         <Field id="lastName" label="Last name *">
//           <input
//             id="lastName"
//             className="input"
//             placeholder="Last name"
//             {...register("lastName")}
//           />
//           {errors.lastName && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.lastName.message}
//             </p>
//           )}
//         </Field>
//       </div>

//       <Field id="email" label="Email *">
//         <input
//           id="email"
//           type="email"
//           className="input"
//           placeholder="Email"
//           {...register("email")}
//         />
//         {errors.email && (
//           <p className="mt-1 text-sm text-red-500">
//             {errors.email.message}
//           </p>
//         )}
//       </Field>
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//         <Field id="password" label="Password *">
//           <Controller
//             control={control}
//             name="password"
//             render={({ field }) => (
//               <PasswordInput
//                 id="password"
//                 placeholder="Password"
//                 value={field.value}
//                 onChange={field.onChange}
//               />
//             )}
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.password.message}
//             </p>
//           )}
//         </Field>

//         <Field id="confirmPassword" label="Confirm Password *">
//           <Controller
//             control={control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <PasswordInput
//                 id="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={field.value}
//                 onChange={field.onChange}
//               />
//             )}
//           />
//           {errors.confirmPassword && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.confirmPassword.message}
//             </p>
//           )}
//         </Field>
//       </div>

//       <Field id="role" label="Role *">
//         <Controller
//           control={control}
//           name="role"
//           render={({ field }) => (
//             <Select
//               options={[
//                 { value: "Student", label: "Student" },
//                 { value: "Teacher", label: "Teacher" },
//               ]}
//               value={[
//                 { value: "Student", label: "Student" },
//                 { value: "Teacher", label: "Teacher" },
//               ].find((option) => option.value === field.value)}
//               onChange={(option) =>
//                 field.onChange(option?.value as UserRole)
//               }
//               placeholder="Select role"
//             />
//           )}
//         />
//       </Field>

//       <Field id="phone" label="Phone">
//         <input
//           id="phone"
//           className="input"
//           placeholder="Phone"
//           {...register("phone")}
//         />
//       </Field>

//       <label
//         htmlFor="termsAccepted"
//         className="flex items-start gap-2 text-sm text-slate-600"
//       >
//         <input
//           id="termsAccepted"
//           type="checkbox"
//           {...register("termsAccepted")}
//           className="mt-1 h-4 w-4"
//         />

//         <span>
//           I agree to Terms &amp; Conditions
//         </span>
//       </label>

//       {errors.termsAccepted && (
//         <p className="text-sm text-red-500">
//           {errors.termsAccepted.message}
//         </p>
//       )}

//       <Captcha onChange={setCaptcha} />

//       <button
//         type="submit"
//         disabled={
//           registerMember.isPending ||
//           !watch("termsAccepted")
//         }
//         className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {registerMember.isPending ? (
//           <>
//             <Loader2
//               size={16}
//               className="animate-spin"
//             />
//             Signing Up...
//           </>
//         ) : (
//           "Sign Up"
//         )}
//       </button>
//     </form>
//   );
// }


    import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Controller,
  FormProvider,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "../services";
import type { UserRole } from "../../../shared/types";
import Captcha from "../../../../src/shared/components/Captcha";
import { Section } from "./FormControls";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";

import {
  SignupFormData,
  signupSchema,
} from "../schemas/register-schema/registerSchema";

function err(e: unknown) {
  return (
    e as {
      response?: {
        data?: {
          message?: string;
        };
      };
    }
  )?.response?.data?.message;
}

export default function MemberRegisterForm({
  onSuccess,
}: {
  onSuccess: (message: string) => void;
}) {
  const [captcha, setCaptcha] = useState<string>();

  const { data: schools } = useQuery({
    queryKey: ["public-schools"],
    queryFn: authApi.publicSchools,
  });

  const options = [
    ...(schools ?? []).map((school) => ({
      value: school.id,
      label: school.name,
    })),

    { value: "demo-1", label: "Green Valley School" },
    { value: "demo-2", label: "Delhi Public School" },
    { value: "demo-3", label: "Oxford Public School" },
    { value: "demo-4", label: "St. Mary's School" },
    { value: "demo-5", label: "Bright Future Academy" },
  ];

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      schoolId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
      phone: "",
      termsAccepted: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const registerMember = useMutation({
    mutationFn: (data: SignupFormData) => {
      const {
        confirmPassword,
        termsAccepted,
        ...memberData
      } = data;

      return authApi.registerMember({
        ...memberData,
        captchaToken: captcha,
      });
    },

    onSuccess: (r) => onSuccess(r.message),

    onError: (e) =>
      toast.error(
        err(e) ?? "Could not submit registration"
      ),
  });

  const onSubmit = (data: SignupFormData) => {
    registerMember.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <Section title="Your school" />

        <Controller
          control={control}
          name="schoolId"
          render={({ field }) => (
            <Select
              options={options}
              placeholder="Select your school"
              value={options.find(
                (o) => o.value === field.value
              )}
              onChange={(selected) =>
                field.onChange(selected?.value ?? "")
              }
              isSearchable
            />
          )}
        />

        {errors.schoolId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.schoolId.message}
          </p>
        )}

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
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            required
            error={errors.password}
          />

          <TextFieldInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            required
            error={errors.confirmPassword}
          />
        </div>

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              options={[
                {
                  value: "Student",
                  label: "Student",
                },
                {
                  value: "Teacher",
                  label: "Teacher",
                },
              ]}
              value={[
                {
                  value: "Student",
                  label: "Student",
                },
                {
                  value: "Teacher",
                  label: "Teacher",
                },
              ].find(
                (option) =>
                  option.value === field.value
              )}
              onChange={(option) =>
                field.onChange(
                  option?.value as UserRole
                )
              }
              placeholder="Select role"
            />
          )}
        />

        <TextFieldInput
          name="phone"
          label="Phone"
          type="phone"
          placeholder="Phone"
          error={errors.phone}
        />

        <label
          htmlFor="termsAccepted"
          className="flex items-start gap-2 text-sm text-slate-600"
        >
          <input
            id="termsAccepted"
            type="checkbox"
            {...register("termsAccepted")}
            className="mt-1 h-4 w-4"
          />

          <span>
            I agree to Terms &amp; Conditions
          </span>
        </label>

        {errors.termsAccepted && (
          <p className="text-sm text-red-500">
            {errors.termsAccepted.message}
          </p>
        )}

        <Captcha onChange={setCaptcha} />

        <button
          type="submit"
          disabled={
            registerMember.isPending ||
            !watch("termsAccepted")
          }
          className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMember.isPending ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
              </form>
    </FormProvider>
  );
}




       