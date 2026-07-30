import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import AppleLoginButton from "./AppleLoginButton";

export default function SocialLoginButtons() {
  return (
    <div className="w-full">
      <div className="flex w-full gap-3">
        <GoogleLoginButton
          onClick={() => toast("Google sign-up is coming soon")}
        />

        <AppleLoginButton
          onClick={() => toast("Apple sign-up is coming soon")}
        />
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Or continue with email
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}