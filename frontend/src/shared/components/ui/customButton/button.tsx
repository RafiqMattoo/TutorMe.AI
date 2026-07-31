import React from "react";
import "./button.css";

type ButtonColor =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "secondary";

type ButtonVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "link";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;

  fullWidth?: boolean;

  loading?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  rounded?: "sm" | "md" | "lg" | "full";
}

const Button = ({
  children,

  color = "primary",
  variant = "solid",
  size = "md",

  loading = false,
  disabled,

  leftIcon,
  rightIcon,

  fullWidth = false,

  rounded = "md",

  className = "",

  ...props
}: ButtonProps) => {
  const classes = [
    "btn",

    `btn-${variant}`,

    `btn-${color}`,

    `btn-${size}`,

    `rounded-${rounded}`,

    fullWidth && "btn-full",

    loading && "btn-loading",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;