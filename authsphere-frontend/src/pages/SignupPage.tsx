import { useState } from "react";
import { useNavigate } from "react-router";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type RegisterData from "@/models/RegisterData";
import { registerUser } from "@/services/AuthService";
import { toast } from "sonner";


// =====================================================
// TYPES
// =====================================================




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

function SignupPage() {

  const navigate = useNavigate();


  // ===================================================
  // FORM STATE
  // ===================================================

  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });


  // ===================================================
  // UI STATE
  // ===================================================

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = event.target;

    setData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ===================================================
  // FORM SUBMIT
  // ===================================================

  const handleFormSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    // -----------------------------------------------
    // Prevent duplicate submission
    // -----------------------------------------------

    if (loading) {
      return;
    }


    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (data.name.trim() === "") {
      toast.error("Name is required.");
      return;
    }


    if (data.email.trim() === "") {
      toast.error("Email is required.");
      return;
    }


    if (data.password.trim() === "") {
      toast.error("Password is required.");
      return;
    }


    if (data.password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );
      return;
    }


    // -----------------------------------------------
    // Register user
    // -----------------------------------------------

    try {

      setLoading(true);

      const result = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      console.log(
        "Registration response:",
        result
      );


      // ---------------------------------------------
      // Success
      // ---------------------------------------------

      toast.success(
        "Account created successfully!"
      );


      // Clear form

      setData({
        name: "",
        email: "",
        password: "",
      });


      // Go to login

      navigate("/login");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      // ---------------------------------------------
      // Error message
      // ---------------------------------------------

      if (error instanceof Error) {

        toast.error(error.message);

      } else {

        toast.error(
          "Unable to create account. Please try again."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // GOOGLE SIGNUP
  // ===================================================

  const handleGoogleSignup = () => {

    window.location.href =
      `${BASE_URL}/oauth2/authorization/google`;

  };


  // ===================================================
  // GITHUB SIGNUP
  // ===================================================

  const handleGithubSignup = () => {

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

        {/* Center glow */}

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
          SIGNUP CARD
      ================================================= */}

      <div className="relative z-10 w-full max-w-md">

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
              HEADER
          ================================================= */}

          <div
            className="
              mb-7
              flex
              items-center
              justify-between
            "
          >

            <div className="flex items-center gap-3">

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
                  className="h-5 w-5 text-primary"
                />

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


            {/* Security status */}

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
              Get started
            </p>


            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
              "
            >

              Create your

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
                AuthSphere account.
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
              Create a secure account and start using
              AuthSphere authentication.
            </p>

          </div>


          {/* =================================================
              SIGNUP FORM
          ================================================= */}

          <form
            onSubmit={handleFormSubmit}
            className="space-y-4"
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div className="space-y-2">

              <Label htmlFor="name">
                Name
              </Label>


              <div className="relative">

                <User
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
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  value={data.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="
                    h-11
                    bg-background/50
                    pl-10
                  "
                />

              </div>

            </div>


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
                  disabled={loading}
                  className="
                    h-11
                    bg-background/50
                    pl-10
                  "
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="space-y-2">

              <Label htmlFor="password">
                Password
              </Label>


              <div className="relative">

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="
                    h-11
                    bg-background/50
                    pl-10
                    pr-11
                  "
                />


                {/* Show / hide password */}

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
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
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}

                </button>

              </div>


              <p className="text-[11px] text-muted-foreground">
                Use at least 8 characters.
              </p>

            </div>


            {/* =================================================
                CREATE ACCOUNT
            ================================================= */}

            <Button
              type="submit"
              disabled={loading}
              className="
                h-11
                w-full
                cursor-pointer
                gap-2
              "
            >

              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account

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
              my-6
              flex
              items-center
              gap-3
            "
          >

            <div className="h-px flex-1 bg-border" />

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

            <div className="h-px flex-1 bg-border" />

          </div>


          {/* =================================================
              OAUTH BUTTONS
          ================================================= */}

          <div className="space-y-3">

            {/* Google */}

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={loading}
              onClick={handleGoogleSignup}
              className="
                h-11
                w-full
                cursor-pointer
                justify-center
                gap-3
                bg-background/40
              "
            >

              <FaGoogle className="h-4 w-4" />

              Continue with Google

            </Button>


            {/* GitHub */}

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={loading}
              onClick={handleGithubSignup}
              className="
                h-11
                w-full
                cursor-pointer
                justify-center
                gap-3
                bg-background/40
              "
            >

              <FaGithub className="h-4 w-4" />

              Continue with GitHub

            </Button>

          </div>


          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="mt-6 text-center">

            <p className="text-sm text-muted-foreground">

              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="
                  cursor-pointer
                  font-medium
                  text-foreground
                  underline-offset-4
                  hover:underline
                "
              >
                Sign in
              </button>

            </p>

          </div>


          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div
            className="
              mt-6
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

            <LockKeyhole className="h-3 w-3" />

            <span>
              Protected by AuthSphere security
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}

export default SignupPage;