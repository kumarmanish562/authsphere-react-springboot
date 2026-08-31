import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useAuth from "@/auth/store";

import { toast } from "sonner";


// =====================================================
// TYPES
// =====================================================

interface LoginData {
  email: string;
  password: string;
}


// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_BASE_URL is not defined in .env"
  );
}


// =====================================================
// COMPONENT
// =====================================================

function LoginPage() {

  const navigate = useNavigate();


  // ===================================================
  // AUTH STORE
  // ===================================================

  const login = useAuth(
    (state) => state.login
  );

  const authLoading = useAuth(
    (state) => state.authLoading
  );


  // ===================================================
  // FORM STATE
  // ===================================================

  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
  });


  // ===================================================
  // PASSWORD VISIBILITY
  // ===================================================

  const [showPassword, setShowPassword] =
    useState(false);


  // ===================================================
  // ERROR MESSAGE
  // ===================================================

  const [errorMessage, setErrorMessage] =
    useState("");


  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = event.target;


    setData((previous) => ({
      ...previous,
      [name]: value,
    }));


    // Clear previous error
    if (errorMessage) {
      setErrorMessage("");
    }
  };


  // ===================================================
  // LOGIN SUBMIT
  // ===================================================

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    // -----------------------------------------------
    // Prevent duplicate request
    // -----------------------------------------------

    if (authLoading) {
      return;
    }


    // -----------------------------------------------
    // Clear previous error
    // -----------------------------------------------

    setErrorMessage("");


    // -----------------------------------------------
    // Validate email
    // -----------------------------------------------

    if (!data.email.trim()) {

      setErrorMessage(
        "Email is required."
      );

      return;
    }


    // -----------------------------------------------
    // Validate email format
    // -----------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email.trim())) {

      setErrorMessage(
        "Please enter a valid email address."
      );

      return;
    }


    // -----------------------------------------------
    // Validate password
    // -----------------------------------------------

    if (!data.password) {

      setErrorMessage(
        "Password is required."
      );

      return;
    }


    // -----------------------------------------------
    // Login
    // -----------------------------------------------

    try {

      await login({
        email: data.email.trim(),
        password: data.password,
      });


      // ---------------------------------------------
      // Success
      // ---------------------------------------------

      setErrorMessage("");

      toast.success(
        "Login successful!"
      );


      // ---------------------------------------------
      // Dashboard
      // ---------------------------------------------

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // ---------------------------------------------
      // Backend error
      // ---------------------------------------------

      if (error instanceof Error) {

        setErrorMessage(
          error.message ||
          "Invalid email or password."
        );

      } else {

        setErrorMessage(
          "Invalid email or password."
        );

      }

    }
  };


  // ===================================================
  // GOOGLE LOGIN
  // ===================================================

  const handleGoogleLogin = () => {

    window.location.href =
      `${BASE_URL}/oauth2/authorization/google`;

  };


  // ===================================================
  // GITHUB LOGIN
  // ===================================================

  const handleGithubLogin = () => {

    window.location.href =
      `${BASE_URL}/oauth2/authorization/github`;

  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <main
      className="
        relative
        flex
        min-h-[calc(100vh-4rem)]
        items-center
        justify-center
        overflow-hidden
        bg-[#050505]
        px-4
        py-10
        sm:py-12
      "
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >

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
            -top-37.5
            h-87.5
            w-150
            -translate-x-1/2
            rounded-full
            bg-primary/4
            blur-[120px]
          "
        />


        {/* Left glow */}

        <div
          className="
            absolute
            -left-25
            top-[30%]
            h-65.5
            w-65.5
            rounded-full
            bg-primary/[0.035]
            blur-[100px]
          "
        />


        {/* Right glow */}

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


      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >

        {/* Card glow */}

        <div
          className="
            absolute
            -inset-1
            rounded-3xl
            bg-primary/4
            blur-2xl
          "
        />


        <div
          className="
            relative
            rounded-3xl
            border
            border-white/10
            bg-card/80
            p-6
            shadow-2xl
            backdrop-blur-xl
            sm:p-8
          "
        >


          {/* =================================================
              SECURITY HEADER
          ================================================= */}

          <div
            className="
              mb-8
              flex
              items-center
              justify-between
            "
          >

            {/* Brand */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                "
              >

                <ShieldCheck
                  className="
                    h-5
                    w-5
                    text-primary
                  "
                />

              </div>


              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  AuthSphere
                </p>


                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  Secure authentication
                </p>

              </div>

            </div>


            {/* Secure status */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/3
                px-3
                py-1.5
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-green-500
                "
              />


              <span
                className="
                  text-[10px]
                  font-medium
                  text-muted-foreground
                "
              >
                SECURE
              </span>

            </div>

          </div>


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-7">

            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-primary
              "
            >
              Welcome back
            </p>


            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
              "
            >

              Sign in to

              <span
                className="
                  block
                  bg-linear-to-r
                  from-primary
                  to-primary/40
                  bg-clip-text
                  text-transparent
                "
              >
                AuthSphere.
              </span>

            </h1>


            <p
              className="
                mt-3
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Access your account and securely
              manage your authentication session.
            </p>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {errorMessage && (

            <div
              role="alert"
              className="
                mb-5
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-400
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                {/* Error icon */}

                <div
                  className="
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500/20
                    text-xs
                    font-bold
                    text-red-400
                  "
                >
                  !
                </div>


                {/* Error text */}

                <p
                  className="
                    leading-5
                  "
                >
                  {errorMessage}
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleFormSubmit}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="space-y-2">

              <Label htmlFor="email">
                Email
              </Label>


              <div className="relative">

                <Mail
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />


                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleInputChange}
                  disabled={authLoading}
                  className="
                    h-11
                    bg-background/60
                    pl-10
                  "
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="space-y-2">

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <Label htmlFor="password">
                  Password
                </Label>


                <button
                  type="button"
                  disabled={authLoading}
                  onClick={() =>
                    setErrorMessage(
                      "Password recovery is not available yet."
                    )
                  }
                  className="
                    cursor-pointer
                    text-xs
                    text-muted-foreground
                    transition-colors
                    hover:text-foreground
                    disabled:cursor-not-allowed
                  "
                >
                  Forgot password?
                </button>

              </div>


              <div className="relative">

                {/* Password icon */}

                <LockKeyhole
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />


                <Input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={data.password}
                  onChange={handleInputChange}
                  disabled={authLoading}
                  className="
                    h-11
                    bg-background/60
                    pl-10
                    pr-11
                  "
                />


                {/* Show / Hide password */}

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={authLoading}
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    cursor-pointer
                    text-muted-foreground
                    transition-colors
                    hover:text-foreground
                    disabled:cursor-not-allowed
                  "
                >

                  {showPassword ? (

                    <EyeOff
                      className="h-4 w-4"
                    />

                  ) : (

                    <Eye
                      className="h-4 w-4"
                    />

                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <Button
              type="submit"
              disabled={authLoading}
              className="
                h-11
                w-full
                cursor-pointer
                gap-2
              "
            >

              {authLoading ? (

                "Signing in..."

              ) : (

                <>
                  Sign In

                  <ArrowRight
                    className="h-4 w-4"
                  />
                </>

              )}

            </Button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className="
              my-7
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                h-px
                flex-1
                bg-border
              "
            />


            <span
              className="
                text-[10px]
                font-medium
                tracking-wider
                text-muted-foreground
              "
            >
              OR CONTINUE WITH
            </span>


            <div
              className="
                h-px
                flex-1
                bg-border
              "
            />

          </div>


          {/* =================================================
              SOCIAL LOGIN
          ================================================= */}

          <div className="space-y-3">

            {/* Google */}

            <Button
              type="button"
              variant="outline"
              disabled={authLoading}
              onClick={handleGoogleLogin}
              className="
                h-11
                w-full
                cursor-pointer
                justify-center
                gap-3
                bg-background/50
              "
            >

              <FaGoogle
                className="h-4 w-4"
              />

              Continue with Google

            </Button>


            {/* GitHub */}

            <Button
              type="button"
              variant="outline"
              disabled={authLoading}
              onClick={handleGithubLogin}
              className="
                h-11
                w-full
                cursor-pointer
                justify-center
                gap-3
                bg-background/50
              "
            >

              <FaGithub
                className="h-4 w-4"
              />

              Continue with GitHub

            </Button>

          </div>


          {/* =================================================
              SIGNUP
          ================================================= */}

          <div
            className="
              mt-7
              text-center
            "
          >

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >

              Don't have an account?{" "}

              <button
                type="button"
                disabled={authLoading}
                onClick={() =>
                  navigate("/signup")
                }
                className="
                  cursor-pointer
                  font-medium
                  text-foreground
                  underline-offset-4
                  hover:underline
                  disabled:cursor-not-allowed
                "
              >
                Create account
              </button>

            </p>

          </div>


          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div
            className="
              mt-7
              flex
              items-center
              justify-center
              gap-2
              border-t
              pt-5
              text-[10px]
              text-muted-foreground
            "
          >

            <LockKeyhole
              className="h-3 w-3"
            />

            <span>
              Your authentication is protected
              by AuthSphere
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}


export default LoginPage;