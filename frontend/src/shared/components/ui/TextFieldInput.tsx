import {
  forwardRef,
  useState,
} from "react"

import {
  Controller,
  useFormContext,
} from "react-hook-form"

import {
  Eye,
  EyeOff,
  X,
} from "lucide-react"

import clsx from "clsx"

import type {
  TextFieldInputProps,
} from "@/shared/types/index"



const sanitizeInput = (
  text: string,
  type?: string
): string => {

  switch (type) {

    case "phone":
      return text
        .replace(/\D/g, "")
        .slice(0, 10)


    case "age":
      return text
        .replace(/\D/g, "")
        .slice(0, 3)


    case "pincode":
      return text
        .replace(/\D/g, "")
        .slice(0, 6)


    case "year":
      return text
        .replace(/\D/g, "")
        .slice(0, 4)


    case "bankaccount":
      return text
        .replace(/\D/g, "")
        .slice(0, 18)


    case "gst":
      return text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 15)


    case "pan":
      return text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10)


    case "ifsc":
      return text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 11)


    case "email":
      return text
        .replace(
          /[^a-zA-Z0-9@._-]/g,
          ""
        )
        .replace(
          /@(?=.*@)/g,
          ""
        )
        .slice(0, 32)


    case "username":
      return text
        .replace(
          /[^a-zA-Z0-9._]/g,
          ""
        )
        .slice(0, 24)


    case "name":
      return text
        .replace(
          /[^a-zA-Z\s]/g,
          ""
        )
        .slice(0, 32)


    case "password":
      return text.slice(0, 24)


    case "address":
      return text
        .replace(
          /[^a-zA-Z0-9\s,.\-/#]/g,
          ""
        )
        .slice(0, 120)


    default:
      return text
  }
}




const getInputMode = (
  type?: string
) => {

  switch(type){

    case "phone":
    case "age":
    case "pincode":
    case "year":
    case "bankaccount":
      return "numeric"


    case "email":
      return "email"


    default:
      return "text"
  }
}




const TextFieldInput = forwardRef<
  HTMLInputElement,
  TextFieldInputProps
>(
(
{
  name,

  label,

  type = "text",

  placeholder,

  required = false,

  error,

  disabled = false,

  readOnly = false,

  leftIcon,

  rightIcon,

  clearable = false,

  countryCode = "+91",

  className,

  ...props

},
ref
)=>{


  const {
    control,
  } = useFormContext()



  const [
    showPassword,
    setShowPassword
  ] = useState(false)



  const [
    isFocused,
    setIsFocused
  ] = useState(false)



  if(!control){
    return null
  }



  return (

    <Controller

      name={name}

      control={control}

      defaultValue=""

      render={({field})=>{


        const {
          value,
          onChange,
          onBlur,
        } = field



        const hasError =
          Boolean(error)



        const hasValue =
          value !== undefined &&
          value !== null &&
          String(value).length > 0



        return (
  <div className="w-full">

    {label && (
      <div
        className="
          mb-1.5
          flex
          items-center
        "
      >
        <label
          className="
            text-sm
            font-medium
            text-[var(--color-text)]
          "
        >
          {label}
        </label>

        {required && (
          <span
            className="
              ml-1
              text-red-500
            "
          >
            *
          </span>
        )}
      </div>
    )}



    <div
     className={clsx(
  `
  flex
  h-11
  w-full
  items-center
  rounded-lg
  border
  px-3
  transition-colors
  bg-[var(--color-surface)]
  `,

  hasError &&
    "border-[var(--color-danger)]",

  !hasError &&
    isFocused &&
    "border-[var(--color-primary-600)]",

  !hasError &&
    !isFocused &&
    "border-[var(--color-border)]",

  disabled &&
    "cursor-not-allowed opacity-60"
)}
    >


      {leftIcon && (
        <span
          className="
            mr-2
            flex
            shrink-0
            items-center
            text-[var(--color-text-muted)]
          "
        >
          {leftIcon}
        </span>
      )}



      {type === "phone" && (
        <span
          className="
            mr-2
            shrink-0
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          {countryCode}
        </span>
      )}




      <input

        {...props}

        ref={ref}

        value={value ?? ""}

        disabled={disabled}

        readOnly={readOnly}


        type={
          type === "password"
            ? showPassword
              ? "text"
              : "password"
            : type
        }


        inputMode={getInputMode(type)}


        placeholder={
          placeholder ?? label
        }


        className={clsx(
          `
          min-w-0
          h-full
          flex-1
          bg-transparent
          outline-none
          text-sm
          leading-none
          text-[var(--color-text)]
          placeholder:text-[var(--color-text-muted)]
          `,
          className
        )}



        onChange={(event) => {

          onChange(
            sanitizeInput(
              event.target.value,
              type
            )
          )

        }}



        onFocus={() => {
          setIsFocused(true)
        }}



        onBlur={() => {

          setIsFocused(false)

          onBlur()

        }}

      />




      {type === "password" && (
        <button

          type="button"

          onClick={() =>
            setShowPassword(
              previous => !previous
            )
          }

          className="
            ml-2
            flex
            shrink-0
            items-center
            text-[var(--color-text-muted)]
            hover:text-[var(--color-text)]
          "

          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }

        >

          {showPassword ? (
            <EyeOff size={18}/>
          ) : (
            <Eye size={18}/>
          )}

        </button>
      )}





      {clearable &&
        hasValue &&
        !disabled &&
        !readOnly && (

        <button

          type="button"

          onClick={() =>
            onChange("")
          }

          className="
            ml-2
            flex
            shrink-0
            items-center
            text-[var(--color-text-muted)]
            hover:text-[var(--color-text)]
          "

        >

          <X size={16}/>

        </button>

      )}






      {rightIcon &&
        type !== "password" && (

        <span
          className="
            ml-2
            flex
            shrink-0
            items-center
            text-[var(--color-text-muted)]
          "
        >
          {rightIcon}
        </span>

      )}

    </div>




    {/* Always reserve error space */}
    <p
      className="
        mt-1
        min-h-[16px]
        text-xs
        text-[var(--color-danger)]
      "
    >
      {
        typeof error === "string"
          ? error
          : error?.message ?? ""
      }
    </p>


  </div>
)

      }}

    />

  )

})



TextFieldInput.displayName =
"TextFieldInput"



export default TextFieldInput