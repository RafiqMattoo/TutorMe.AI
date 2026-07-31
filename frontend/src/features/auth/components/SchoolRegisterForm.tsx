
// import { useState } from 'react'
// import { useMutation } from '@tanstack/react-query'
// import { Loader2 } from 'lucide-react'
// import toast from 'react-hot-toast'

// import { authApi } from '../services'
// import type { BoardType, SchoolType } from '../../../shared/types/index.ts'
// import { Field, Section } from './FormControls'
// import { PasswordInput } from './FormControls'
// function err(e: unknown) {
//   return (
//     e as {
//       response?: {
//         data?: {
//           message?: string
//         }
//       }
//     }
//   )?.response?.data?.message
// }


// export default function SchoolRegisterForm({
//   onSuccess
// }: {
//   onSuccess: (message: string) => void
// }) {

//   const [captcha, setCaptcha] = useState<string | undefined>()

//   const [school, setSchool] = useState({

//     schoolName: '',
//     city: '',
//     state: '',
//     phone: '',
//     email: '',

//     type: 'Private' as SchoolType,
//     board: 'CBSE' as BoardType,

//     adminFirstName: '',
//     adminLastName: '',
//     adminEmail: '',
//     adminPassword: '',
//     adminPhone: '',

//   })


//   const registerSchool = useMutation({

//     mutationFn: () =>
//       authApi.registerSchool({
//         ...school,
//         captchaToken: captcha
//       }),

//     onSuccess: r => onSuccess(r.message),

//     onError: e =>
//       toast.error(
//         err(e) ?? 'Could not register school'
//       ),

//   })


//   return (

//     <div className="space-y-3">

//       <Section title="School details" />


//       <Field id="schoolName" label="School name *">
//         <input
//           id="schoolName"
//           className="input"
//           placeholder="School name *"
//           value={school.schoolName}
//           onChange={e =>
//             setSchool(s => ({
//               ...s,
//               schoolName: e.target.value
//             }))
//           }
//         />
//       </Field>


//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

//         <Field id="city" label="City">
//           <input
//             id="city"
//             className="input"
//             placeholder="City"
//             value={school.city}
//             onChange={e =>
//               setSchool(s => ({
//                 ...s,
//                 city: e.target.value
//               }))
//             }
//           />
//         </Field>


//         <Field id="state" label="State">
//           <input
//             id="state"
//             className="input"
//             placeholder="State"
//             value={school.state}
//             onChange={e =>
//               setSchool(s => ({
//                 ...s,
//                 state: e.target.value
//               }))
//             }
//           />
//         </Field>

//       </div>


//       <Section title="Admin account" />


//       <Field id="adminEmail" label="Admin email *">
//         <input
//           id="adminEmail"
//           type="email"
//           className="input"
//           placeholder="Admin email *"
//           value={school.adminEmail}
//           onChange={e =>
//             setSchool(s => ({
//               ...s,
//               adminEmail: e.target.value
//             }))
//           }
//         />
//       </Field>


//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

//         <Field id="adminPassword" label="Password *">
//           <input
//             id="adminPassword"
//             type="password"
//             className="input"
//             placeholder="Password *"
//             value={school.adminPassword}
//             onChange={e =>
//               setSchool(s => ({
//                 ...s,
//                 adminPassword: e.target.value
//               }))
//             }
//           />
//         </Field>


//         <Field id="adminPhone" label="Phone">
//           <input
//             id="adminPhone"
//             className="input"
//             placeholder="Phone"
//             value={school.adminPhone}
//             onChange={e =>
//               setSchool(s => ({
//                 ...s,
//                 adminPhone: e.target.value
//               }))
//             }
//           />
//         </Field>

//       </div>


//       <button
//         onClick={() => registerSchool.mutate()}
//         disabled={registerSchool.isPending}
//         className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3"
//       >

//         {
//           registerSchool.isPending
//             ?
//             <>
//               <Loader2 size={16} className="animate-spin" />
//               Submitting...
//             </>
//             :
//             'Register school'
//         }

//       </button>

//     </div>

//   )

// }

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "../services";
import type { BoardType, SchoolType } from "../../../shared/types";
import { Section } from "./FormControls";
import TextFieldInput from "@/shared/components/ui/TextFieldInput";

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

type SchoolRegisterFormData = {
  schoolName: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  type: SchoolType;
  board: BoardType;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone: string;
};

export default function SchoolRegisterForm({
  onSuccess,
}: {
  onSuccess: (message: string) => void;
}) {
  const [captcha, setCaptcha] = useState<string>();

  const methods = useForm<SchoolRegisterFormData>({
    mode: "onChange",
    defaultValues: {
      schoolName: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      type: "Private",
      board: "CBSE",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminPassword: "",
      adminPhone: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const registerSchool = useMutation({
    mutationFn: (data: SchoolRegisterFormData) =>
      authApi.registerSchool({
        ...data,
        captchaToken: captcha,
      }),

    onSuccess: (r) => onSuccess(r.message),

    onError: (e) =>
      toast.error(err(e) ?? "Could not register school"),
  });

  const onSubmit = (data: SchoolRegisterFormData) => {
    registerSchool.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <Section title="School details" />
                <TextFieldInput
          name="schoolName"
          label="School Name"
          type="name"
          placeholder="School name"
          required
          error={errors.schoolName}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextFieldInput
            name="city"
            label="City"
            type="name"
            placeholder="City"
            error={errors.city}
          />

          <TextFieldInput
            name="state"
            label="State"
            type="name"
            placeholder="State"
            error={errors.state}
          />
        </div>

        <TextFieldInput
          name="email"
          label="School Email"
          type="email"
          placeholder="School email"
          error={errors.email}
        />

        <TextFieldInput
          name="phone"
          label="School Phone"
          type="phone"
          placeholder="School phone"
          error={errors.phone}
        />

        <Section title="Admin Account" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextFieldInput
            name="adminFirstName"
            label="First Name"
            type="name"
            placeholder="First name"
            error={errors.adminFirstName}
          />

          <TextFieldInput
            name="adminLastName"
            label="Last Name"
            type="name"
            placeholder="Last name"
            error={errors.adminLastName}
          />
        </div>

        <TextFieldInput
          name="adminEmail"
          label="Admin Email"
          type="email"
          placeholder="Admin email"
          required
          error={errors.adminEmail}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextFieldInput
            name="adminPassword"
            label="Password"
            type="password"
            placeholder="Password"
            required
            error={errors.adminPassword}
          />

          <TextFieldInput
            name="adminPhone"
            label="Phone"
            type="phone"
            placeholder="Phone"
            error={errors.adminPhone}
          />
        </div>

        <button
          type="submit"
          disabled={registerSchool.isPending}
          className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerSchool.isPending ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Submitting...
            </>
          ) : (
            "Register School"
          )}
        </button>
              </form>
    </FormProvider>
  );
}