import { useState } from "react";
import { useNavigate } from "react-router";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8083/oauth2/authorization/google";
  };

  const handleGithubLogin = () => {
    window.location.href =
      "http://localhost:8083/oauth2/authorization/github";
  };

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#050505] px-4 py-12">

    {/* =====================================================
    BACKGROUND
===================================================== */}

<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

  {/* Main ambient glow */}
  <div
    className="
      absolute
      left-1/2
      top-1/2
      h-125
      w-125
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-primary/6
      blur-[140px]
    "
  />

  {/* Top glow */}
  <div
    className="
      absolute
      left-1/2
      top: -150px
      h-87.5
      w-150
      -translate-x-1/2
      rounded-full
      bg-primary/4
      blur-[120px]
    "
  />

  {/* Left ambient glow */}
  <div
    className="
      absolute
      -left-25
      top-[30%]
      h-62.5
      w-62.5
      rounded-full
      bg-primary/[0.035]
      blur-[100px]
    "
  />

  {/* Right ambient glow */}
  <div
    className="
      absolute
      bottom-[10%]
      -right-25
      h-75
      w-75
      rounded-full
      bg-primary/[0.035]
      blur-[110px]
    "
  />

</div>

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* Top glow */}
        <div className="absolute -inset-1 rounded-3xl bg-primary/10 blur-xl" />

        <div className="relative rounded-3xl border bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">


          {/* =================================================
              SECURITY HEADER
          ================================================= */}

          <div className="mb-8 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  AuthSphere
                </p>

                <p className="text-xs text-muted-foreground">
                  Secure authentication
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-[10px] font-medium text-muted-foreground">
                SECURE
              </span>

            </div>

          </div>


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-7">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Welcome back
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sign in to
              <span className="block bg-linear-to-r from-primary to-primary/40 bg-clip-text text-transparent">
                AuthSphere.
              </span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Access your account and securely manage your
              authentication session.
            </p>

          </div>

{/* =================================================
    LOGIN FORM
================================================= */}

<form className="space-y-5">

  {/* Email */}

  <div className="space-y-2">

    <Label htmlFor="email">
      Email
    </Label>

    <div className="relative">

      <Mail
        className="
          absolute left-3 top-1/2
          h-4 w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        className="h-11 bg-background/60 pl-10"
      />

    </div>

  </div>


  {/* Password */}

  <div className="space-y-2">

    <div className="flex items-center justify-between">

      <Label htmlFor="password">
        Password
      </Label>

      <button
        type="button"
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Forgot password?
      </button>

    </div>


    <div className="relative">

      {/* Password Icon */}

      <LockKeyhole
        className="
          absolute left-3 top-1/2
          h-4 w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        autoComplete="current-password"
        className="h-11 bg-background/60 pl-10 pr-11"
      />


      {/* Show / Hide Password */}

      <button
        type="button"
        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
        onClick={() =>
          setShowPassword((value) => !value)
        }
        className="
          absolute right-3 top-1/2
          -translate-y-1/2
          cursor-pointer
          text-muted-foreground
          transition-colors
          hover:text-foreground
        "
      >

        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}

      </button>

    </div>

  </div>


            {/* Login Button */}

            <Button
              type="submit"
              className="h-11 w-full cursor-pointer gap-2"
            >
              Sign In

              <ArrowRight className="h-4 w-4" />
            </Button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="my-7 flex items-center gap-3">

            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-border" />

          </div>


          {/* =================================================
              GOOGLE
          ================================================= */}

          <div className="space-y-3">

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer justify-center gap-3 bg-background/50"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="h-4 w-4" />

              Continue with Google
            </Button>


            {/* =================================================
                GITHUB
            ================================================= */}

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer justify-center gap-3 bg-background/50"
              onClick={handleGithubLogin}
            >
              <FaGithub className="h-4 w-4" />

              Continue with GitHub
            </Button>

          </div>


          {/* =================================================
              SIGNUP
          ================================================= */}

          <div className="mt-7 text-center">

            <p className="text-sm text-muted-foreground">

              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create account
              </button>

            </p>

          </div>


          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div className="mt-7 flex items-center justify-center gap-2 border-t pt-5 text-[10px] text-muted-foreground">

            <LockKeyhole className="h-3 w-3" />

            <span>
              Your authentication is protected by AuthSphere
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}

export default LoginPage;