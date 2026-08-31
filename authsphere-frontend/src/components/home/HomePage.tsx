import { useNavigate } from "react-router";
import {
  ArrowRight,
  Check,
  Globe,
  KeyRound,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative flex min-h-[calc(100vh-4rem)] items-center">
        
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute left-10 top-1/3 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Hero Content */}
          <div className="text-center lg:text-left">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Secure Authentication Platform
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              Identity
              <span className="block bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
                without complexity.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
              AuthSphere provides a complete authentication and authorization
              system for modern applications using JWT, OAuth2, role-based
              authorization, and secure refresh-token management.
            </p>

            {/* Hero Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

              <Button
                size="lg"
                className="cursor-pointer gap-2"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>

            </div>

            {/* Small Tech Labels */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {["JWT", "OAuth2", "RBAC", "Spring Security"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>

          </div>


          {/* Hero Security Card */}
          <div className="relative mx-auto w-full max-w-md">

            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

            <Card className="relative overflow-hidden border-primary/20 bg-card/70 shadow-2xl backdrop-blur-xl">

              <CardContent className="p-0">

                {/* Terminal Header */}
                <div className="flex items-center gap-2 border-b px-5 py-4">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  </div>

                  <span className="ml-2 text-xs text-muted-foreground">
                    authsphere.security
                  </span>

                </div>

                {/* Terminal Body */}
                <div className="space-y-5 p-6 font-mono text-sm">

                  <div>
                    <span className="text-muted-foreground">
                      $ authsphere
                    </span>
                    <span className="text-primary">
                      {" "}authenticate
                    </span>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4">

                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Authentication successful
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Identity verified
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Provider
                        </span>
                        <span>OAuth2</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Access Token
                        </span>
                        <span className="text-green-500">
                          ACTIVE
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Role
                        </span>
                        <span>ROLE_USER</span>
                      </div>

                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-500">
                    <Check className="h-4 w-4" />
                    Secure session established
                  </div>

                </div>

              </CardContent>

            </Card>

          </div>

        </div>
      </section>


      {/* =====================================================
          TRUST / INTRO SECTION
      ===================================================== */}

      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Built for modern applications
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One authentication layer.
              <br />
              Complete security control.
            </h2>

            <p className="mt-4 text-muted-foreground">
              AuthSphere separates identity, authentication, authorization,
              and token management into a clean security architecture.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          CORE FEATURES
      ===================================================== */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Core Features
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything authentication needs.
            </h2>

            <p className="mt-4 max-w-2xl text-muted-foreground">
              Designed around real-world authentication requirements.
            </p>
          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="JWT Authentication"
              description="Short-lived access tokens provide secure authentication for protected APIs."
            />

            <FeatureCard
              icon={<Globe className="h-5 w-5" />}
              title="OAuth2 Login"
              description="Authenticate users through Google and GitHub OAuth2 providers."
            />

            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Role-Based Access"
              description="Control access to resources using application roles and authorities."
            />

            <FeatureCard
              icon={<RefreshCw className="h-5 w-5" />}
              title="Refresh Token Rotation"
              description="Rotate refresh tokens and revoke previous tokens to reduce replay attacks."
            />

            <FeatureCard
              icon={<Lock className="h-5 w-5" />}
              title="Secure Cookies"
              description="Store refresh tokens in HttpOnly cookies to reduce client-side exposure."
            />

            <FeatureCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Provider Identity"
              description="Track authentication providers and associate external identities with users."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          REQUIREMENTS
      ===================================================== */}

      <section className="border-y bg-muted/20 py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Text */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Requirements
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Built with a modern stack.
              </h2>

              <p className="mt-5 max-w-xl text-muted-foreground">
                AuthSphere combines a Spring Boot security backend with a
                modern React frontend to provide a complete authentication
                experience.
              </p>

              <div className="mt-8 space-y-4">

                <Requirement
                  title="Java & Spring Boot"
                  description="Backend authentication and authorization layer."
                />

                <Requirement
                  title="React & TypeScript"
                  description="Modern frontend application and user interface."
                />

                <Requirement
                  title="MYSQL"
                  description="Persistent storage for users, roles and refresh tokens."
                />

                <Requirement
                  title="JWT"
                  description="Access-token based API authentication."
                />

                <Requirement
                  title="OAuth2"
                  description="Google and GitHub social authentication."
                />

              </div>

            </div>


            {/* Stack Card */}
            <Card className="overflow-hidden border-primary/20">

              <CardContent className="p-0">

                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-primary" />

                    <div>
                      <h3 className="font-semibold">
                        Architecture Stack
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        AuthSphere technology layers
                      </p>
                    </div>
                  </div>
                </div>


                <div className="divide-y">

                  <StackItem
                    icon={<Zap />}
                    name="React"
                    type="Frontend"
                  />

                  <StackItem
                    icon={<Shield />}
                    name="Spring Security"
                    type="Security"
                  />

                  <StackItem
                    icon={<KeyRound />}
                    name="JWT"
                    type="Authentication"
                  />

                  <StackItem
                    icon={<Globe />}
                    name="OAuth2"
                    type="Identity Provider"
                  />

                  <StackItem
                    icon={<Server />}
                    name="MYSQL"
                    type="Database"
                  />

                </div>

              </CardContent>

            </Card>

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              How It Works
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Authentication in four steps.
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-4">

            <Step
              number="01"
              title="Authenticate"
              description="User signs in using credentials or OAuth2."
            />

            <Step
              number="02"
              title="Verify"
              description="Spring Security verifies the authenticated identity."
            />

            <Step
              number="03"
              title="Issue Tokens"
              description="AuthSphere generates access and refresh tokens."
            />

            <Step
              number="04"
              title="Access APIs"
              description="The access token is used to access protected resources."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          SECURITY ARCHITECTURE
      ===================================================== */}

      <section className="border-y bg-muted/20 py-24">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Security Architecture
          </p>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Designed around secure boundaries.
          </h2>

          <div className="mt-12 overflow-hidden rounded-2xl border bg-card p-6 text-left shadow-sm">

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

              <ArchitectureBox
                icon={<Users />}
                title="React"
                subtitle="Client"
              />

              <ArrowRight className="hidden text-muted-foreground md:block" />

              <ArchitectureBox
                icon={<Shield />}
                title="Spring Security"
                subtitle="Security Layer"
              />

              <ArrowRight className="hidden text-muted-foreground md:block" />

              <ArchitectureBox
                icon={<KeyRound />}
                title="JWT"
                subtitle="Token Layer"
              />

              <ArrowRight className="hidden text-muted-foreground md:block" />

              <ArchitectureBox
                icon={<Server />}
                title="Database"
                subtitle="Persistence"
              />

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SECURITY PRINCIPLES
      ===================================================== */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-5 md:grid-cols-3">

            <Principle
              icon={<Lock />}
              title="Secure by Design"
              description="Security is built into authentication, token handling and authorization."
            />

            <Principle
              icon={<RefreshCw />}
              title="Token Rotation"
              description="Refresh tokens can be rotated and revoked to maintain session security."
            />

            <Principle
              icon={<UserCheck />}
              title="Identity First"
              description="External identities are mapped to application users and roles."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          GITHUB / DEVELOPER SECTION
      ===================================================== */}

      <section className="border-y bg-muted/20 py-20">

        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left">

          <div>

            <div className="flex items-center justify-center gap-3 md:justify-start">

              <FaGithub className="h-6 w-6" />

              <h2 className="text-2xl font-bold">
                Built for developers.
              </h2>

            </div>

            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore the architecture, authentication flow and security
              implementation behind AuthSphere.
            </p>

          </div>

          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer gap-2"
          >
            <FaGithub className="h-4 w-4" />
            View Project
          </Button>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden py-28">

        <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-primary/5 to-background" />

        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to secure your application?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Start with AuthSphere and build authentication into your
            application without starting from zero.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Button
              size="lg"
              className="cursor-pointer gap-2"
              onClick={() => navigate("/signup")}
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row lg:px-8">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              AS
            </div>

            <span className="font-medium text-foreground">
              AuthSphere
            </span>

          </div>

          <p>
            Secure authentication for modern applications.
          </p>

          <p>
            © 2026 AuthSphere
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   FEATURE CARD
============================================================ */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">

      <CardContent className="p-6">

        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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


/* ============================================================
   REQUIREMENT
============================================================ */

interface RequirementProps {
  title: string;
  description: string;
}

function Requirement({
  title,
  description,
}: RequirementProps) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-3 w-3 text-primary" />
      </div>

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

    </div>
  );
}


/* ============================================================
   STACK ITEM
============================================================ */

interface StackItemProps {
  icon: React.ReactNode;
  name: string;
  type: string;
}

function StackItem({
  icon,
  name,
  type,
}: StackItemProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">

      <div className="flex items-center gap-3">

        <div className="text-primary">
          {icon}
        </div>

        <span className="text-sm font-medium">
          {name}
        </span>

      </div>

      <span className="text-xs text-muted-foreground">
        {type}
      </span>

    </div>
  );
}


/* ============================================================
   STEP
============================================================ */

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({
  number,
  title,
  description,
}: StepProps) {
  return (
    <Card className="relative">

      <CardContent className="p-6">

        <span className="font-mono text-xs text-primary">
          {number}
        </span>

        <h3 className="mt-4 font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}


/* ============================================================
   ARCHITECTURE BOX
============================================================ */

interface ArchitectureBoxProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function ArchitectureBox({
  icon,
  title,
  subtitle,
}: ArchitectureBoxProps) {
  return (
    <div className="flex w-full flex-col items-center rounded-xl border bg-background p-5 text-center md:w-44">

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {subtitle}
      </p>

    </div>
  );
}


/* ============================================================
   SECURITY PRINCIPLE
============================================================ */

interface PrincipleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Principle({
  icon,
  title,
  description,
}: PrincipleProps) {
  return (
    <Card>

      <CardContent className="p-6">

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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

export default HomePage;