import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services";
import type { UserRole } from "../../../shared/types/index.ts";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BookOpenCheck,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "../../../shared/store/authStore";
import { roleOrder, roleProfiles } from "../../../shared/auth/roles";
import GoogleLoginButton from "../components/GoogleLoginButton.tsx";
import AppleLoginButton from "../components/AppleLoginButton.tsx";
import Logo from "../components/Logo.tsx";
import Divider from "../components/Divider.tsx";
import { useForm , FormProvider} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "../schemas/login-schema/loginSchema.ts";
import TextFieldInput from "@/shared/components/ui/TextFieldInput.tsx"
import Button from "@/shared/components/ui/customButton/button.tsx"
const demoPassword = "Admin@123";

const featureList = [
  { icon: Zap, text: "AI-powered study tools" },
  { icon: BookOpenCheck, text: "Role-aware content workspace" },
  { icon: Sparkles, text: "Real-time analytics & insights" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("SuperAdmin");
  const { login } = useAuthStore();
  const navigate = useNavigate();

const methods = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  mode: "onSubmit",
  reValidateMode: "onChange",
  defaultValues: {
    email: "",
    password: "",
  },
});


const {
  handleSubmit,
  setValue,
  clearErrors, // <-- Extract clearErrors here
  formState: {
    errors,
    isSubmitting,
  },
} = methods;


const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    
    // Clear any existing validation errors immediately on tab switch
    clearErrors(); 
    
    setValue("email", roleProfiles[role].email);
    setValue("password", demoPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login(data.email, data.password);
      login(res);
      toast.success(`Welcome back, ${res.user.firstName}!`);
      
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      )?.response?.data?.message;

      toast.error(msg ?? "Invalid credentials");
    }
  };

  const currentProfile = roleProfiles[selectedRole];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-100/80 lg:bg-[var(--color-sidebar)] lg:text-[var(--color-surface)]">
      <div className="grid min-h-screen lg:h-full lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left: Hero panel (UNTOUCHED DESKTOP VIEW) ──────────────── */}
        <section className="relative hidden lg:flex lg:flex-col lg:justify-between lg:overflow-hidden lg:px-12 lg:py-8">
          {/* Background layers */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(37,99,235,0.4) 0%, transparent 42%), " +
                "radial-gradient(circle at 85% 10%, rgba(99,102,241,0.3) 0%, transparent 35%), " +
                "radial-gradient(circle at 50% 80%, rgba(14,165,233,0.15) 0%, transparent 40%), " +
                "linear-gradient(150deg, #020617 0%, #0c1a3a 50%, #080f1e 100%)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-600)] shadow-xl shadow-[var(--color-primary-600)]/50">
              <BookOpenCheck size={22} />
            </div>

            <div>
              <div className="text-[16px] font-bold tracking-tight">VidyaAI</div>
              <div className="text-[11px] font-medium text-[var(--color-surface)]/45">
                Learning Platform
              </div>
            </div> */}
            <Logo />
          </div>

          {/* Hero copy */}
          <div className="relative max-w-2xl py-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/15 px-3.5 py-1.5 text-[12px] font-semibold text-[var(--color-primary-300)]">
              <Sparkles size={13} />
              Role-aware intelligent learning platform
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[var(--color-surface)] md:text-5xl xl:text-[56px]">
              One platform.
              <br />
              <span className="bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-700)] bg-clip-text text-transparent">
                Five unique
              </span>
              <br />
              experiences.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              Sign in as any role and the platform reshapes to serve that person
              — global admin, school operator, teacher, student, or parent
              guardian.
            </p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2">
              {featureList.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-600)]/30 text-[var(--color-primary-400)]">
                    <Icon size={13} />
                  </span>
                  <span className="text-[13px] font-medium text-[var(--color-surface)]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Role selector cards */}
          <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
            {roleOrder.map((role) => {
              const p = roleProfiles[role];
              const active = selectedRole === role;
              return (
              <button
  key={role}
  type="button"
  onClick={() => selectRole(role)}
  disabled={isSubmitting}
  className={clsx(
    "group rounded-xl border p-3.5 text-left transition-all duration-200",
    isSubmitting && "cursor-not-allowed opacity-60",
    active
      ? "border-blue-400/50 bg-[var(--color-primary-600)]/20 shadow-lg shadow-blue-900/40 ring-1 ring-blue-500/30"
      : clsx(
          "border-white/[0.07] bg-[var(--color-surface)]/[0.04]",
          !isSubmitting &&
            "hover:border-white/15 hover:bg-[var(--color-surface)]/[0.07]"
        ),
  )}
>
  <div
    className={clsx(
      "mb-2.5 h-1 w-8 rounded-full bg-gradient-to-r",
      p.accent,
    )}
  />
  <div
    className={clsx(
      "text-[13px] font-bold",
      active ? "text-blue-200" : "text-white/90",
    )}
  >
    {p.label}
  </div>
  <div
    className={clsx(
      "mt-1 text-[11px] leading-4",
      active ? "text-blue-300/70" : "text-white/40",
    )}
  >
    {p.scope}
  </div>
</button>
              );
            })}
          </div>
        </section>

       {/* ── Right: Login form ───────────────────────────────────────────── */}
<section className="flex min-h-screen items-center justify-center overflow-hidden p-4 lg:min-h-0 lg:bg-[var(--color-surface)] lg:p-8 lg:text-[var(--color-text)]">
  {/* Card */}
  <div className="w-full max-w-[440px] rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/60 lg:max-w-[400px] lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">

    {/* Mobile Logo */}
    <div className="mb-8 flex items-center gap-3 lg:hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
        <BookOpenCheck size={20} />
      </div>

      <span className="text-xl font-bold tracking-tight text-slate-900">
        VidyaAI
      </span>
    </div>

    {/* Heading */}
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-[30px] lg:font-extrabold lg:text-[var(--color-text)]">
        Welcome back
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 lg:text-[15px] lg:text-[var(--color-text-muted)]">
        {currentProfile.description}
      </p>
    </div>

    {/* Form */}
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}
        <TextFieldInput
          name="email"
          label="Email address"
          type="email"
          placeholder="your@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email}
          required
        />

        {/* Password */}
        <div>
          <TextFieldInput
            name="password"
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            leftIcon={
              <LockKeyhole
                size={15}
                className="text-slate-400 lg:text-[var(--color-text-muted)]"
              />
            }
            error={errors.password}
          />

          <div className="mt-[-10px] flex justify-end">
            <Link
              to="/reset-password"
              className="text-xs font-medium text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)]"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit */}
      <Button
  type="submit"
  fullWidth
  loading={isSubmitting}
  className="mt-1.5"
  leftIcon={
    isSubmitting && ( 

    <Loader2
      size={17}
      className="animate-spin"
    />)
  }
 
  rightIcon={<ArrowRight size={16} />}
>
  Sign in
</Button>
      </form>
    </FormProvider>

    {/* Footer */}
    <div className="mt-8 border-t border-slate-200 pt-6 text-center">
      <p className="text-xs text-slate-500 lg:text-[13px] lg:text-[var(--color-text-muted)]">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)]"
        >
          Register a school or join one
        </Link>
      </p>
    </div>
  </div>
</section>
      </div>
    </div>
  );
}
