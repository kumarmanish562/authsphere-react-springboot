import {
  ShieldCheck,
  LockKeyhole,
  KeyRound,
  Server,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#050505] px-4 py-12 text-foreground sm:px-6 lg:px-8">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[140px]" />

        <div className="absolute -left-25 top-[20%] h-65.5 w-65.5 rounded-full bg-primary/3 blur-[100px]" />

        <div className="absolute bottom-[10%] -right-25 h-75 w-75 rounded-full bg-primary/3 blur-[110px]" />

      </div>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-5xl text-center">

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">

          <ShieldCheck className="h-7 w-7 text-primary" />

        </div>


        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          About AuthSphere
        </p>


        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">

          Authentication,

          <span className="block bg-linear-to-r from-primary to-primary/40 bg-clip-text text-transparent">
            built securely.
          </span>

        </h1>


        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">

          AuthSphere is a modern authentication application designed
          to demonstrate secure user registration, login, OAuth2
          authentication, JWT-based authorization and protected APIs.

        </p>

      </section>


      {/* =====================================================
          WHAT IS AUTHSPHERE
      ===================================================== */}

      <section className="mx-auto mt-16 max-w-5xl">

        <Card className="rounded-3xl border-white/10 bg-card/60 shadow-2xl backdrop-blur-xl">

          <CardContent className="p-6 sm:p-8 lg:p-10">

            <div className="grid gap-10 md:grid-cols-2">

              {/* Left */}

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  The Project
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  What is AuthSphere?
                </h2>

                <p className="mt-4 leading-7 text-muted-foreground">
                  AuthSphere is a full-stack authentication project
                  that connects a React frontend with a Spring Boot
                  backend.
                </p>

                <p className="mt-4 leading-7 text-muted-foreground">
                  The application provides a complete authentication
                  flow where users can create accounts, sign in,
                  authenticate using external providers and access
                  protected resources.
                </p>

              </div>


              {/* Right */}

              <div className="grid grid-cols-2 gap-4">

                <Feature
                  icon={<LockKeyhole />}
                  title="Secure Login"
                  text="Protected authentication flow"
                />

                <Feature
                  icon={<KeyRound />}
                  title="JWT"
                  text="Token-based authorization"
                />

                <Feature
                  icon={<Server />}
                  title="Spring Boot"
                  text="REST API backend"
                />

                <Feature
                  icon={<Code2 />}
                  title="React"
                  text="Modern frontend"
                />

              </div>

            </div>

          </CardContent>

        </Card>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="mx-auto mt-16 max-w-5xl">

        <div className="mb-8 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Core Features
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Everything required for authentication
          </h2>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<ShieldCheck />}
            title="User Registration"
            description="Users can create an account using their name, email and password."
          />

          <FeatureCard
            icon={<LockKeyhole />}
            title="Secure Login"
            description="Users can authenticate using their registered credentials."
          />

          <FeatureCard
            icon={<KeyRound />}
            title="JWT Authentication"
            description="Access tokens are used to authorize protected API requests."
          />

          <FeatureCard
            icon={<FaGithub />}
            title="OAuth2"
            description="Authentication can be extended using providers such as Google and GitHub."
          />

          <FeatureCard
            icon={<Server />}
            title="Protected APIs"
            description="Authenticated users can access secured backend resources."
          />

          <FeatureCard
            icon={<CheckCircle2 />}
            title="Session Management"
            description="Authentication state is maintained on the frontend using Zustand."
          />

        </div>

      </section>


      {/* =====================================================
          TECHNOLOGY STACK
      ===================================================== */}

      <section className="mx-auto mt-16 max-w-5xl">

        <div className="mb-8 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Technology Stack
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Built with modern technologies
          </h2>

        </div>


        <Card className="rounded-3xl border-white/10 bg-card/60 backdrop-blur-xl">

          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

            <Tech
              name="React"
              description="Frontend UI"
            />

            <Tech
              name="TypeScript"
              description="Type-safe development"
            />

            <Tech
              name="Spring Boot"
              description="Backend REST API"
            />

            <Tech
              name="Spring Security"
              description="Authentication & authorization"
            />

            <Tech
              name="JWT"
              description="Token authentication"
            />

            <Tech
              name="OAuth2"
              description="Social authentication"
            />

            <Tech
              name="Zustand"
              description="Global auth state"
            />

            <Tech
              name="shadcn/ui"
              description="UI components"
            />

          </CardContent>

        </Card>

      </section>


      {/* =====================================================
          AUTHENTICATION FLOW
      ===================================================== */}

      <section className="mx-auto mt-16 max-w-5xl">

        <div className="mb-8 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Authentication Flow
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            How AuthSphere works
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-4">

          <FlowStep
            number="01"
            title="Register"
            text="Create an AuthSphere account."
          />

          <FlowStep
            number="02"
            title="Authenticate"
            text="Login using credentials or OAuth2."
          />

          <FlowStep
            number="03"
            title="Authorize"
            text="Receive an access token."
          />

          <FlowStep
            number="04"
            title="Access"
            text="Use protected application resources."
          />

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mx-auto mt-16 max-w-3xl pb-8 text-center">

        <Card className="rounded-3xl border-primary/10 bg-primary/3 backdrop-blur-xl">

          <CardContent className="p-8 sm:p-10">

            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />

            <h2 className="mt-4 text-2xl font-bold">
              Ready to explore AuthSphere?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Create an account and experience the authentication
              flow yourself.
            </p>


            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

              <Button
                onClick={() => navigate("/signup")}
                className="cursor-pointer gap-2"
              >
                Create Account
                <ArrowRightIcon />
              </Button>


              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="cursor-pointer"
              >
                Sign In
              </Button>

            </div>

          </CardContent>

        </Card>

      </section>

    </main>
  );
}


// =====================================================
// FEATURE
// =====================================================

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/40 p-4">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">

        {icon}

      </div>

      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {text}
      </p>

    </div>
  );
}


// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group rounded-2xl border-white/10 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80">

      <CardContent className="p-6">

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

          {icon}

        </div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}


// =====================================================
// TECHNOLOGY
// =====================================================

function Tech({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-background/40 p-4">

      <p className="text-sm font-semibold">
        {name}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>

    </div>
  );
}


// =====================================================
// FLOW STEP
// =====================================================

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="rounded-2xl border-white/10 bg-card/50">

      <CardContent className="p-5">

        <span className="text-xs font-bold tracking-widest text-primary">
          {number}
        </span>

        <h3 className="mt-3 font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          {text}
        </p>

      </CardContent>

    </Card>
  );
}


// =====================================================
// ARROW ICON
// =====================================================

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}


export default AboutPage;