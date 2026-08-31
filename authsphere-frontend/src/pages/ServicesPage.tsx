import {
  ShieldCheck,
  KeyRound,
  LockKeyhole,
  Fingerprint,
  Users,
  Server,
  RefreshCw,
  Globe2,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


// =====================================================
// SERVICES PAGE
// =====================================================

function ServicesPage() {
  const navigate = useNavigate();

  return (
    <main
      className="
        relative
        min-h-[calc(100vh-4rem)]
        overflow-hidden
        bg-[#050505]
        px-4
        py-12
        text-foreground
        sm:px-6
        lg:px-8
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

        {/* Main glow */}

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
            bg-primary/5
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
            bg-primary/[0.035]
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
            bg-primary/3
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
            bg-primary/3
            blur-[110px]
          "
        />

      </div>


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          mx-auto
          max-w-5xl
          text-center
        "
      >

        {/* Icon */}

        <div
          className="
            mx-auto
            mb-5
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-primary/20
            bg-primary/10
          "
        >

          <ShieldCheck
            className="
              h-7
              w-7
              text-primary
            "
          />

        </div>


        <p
          className="
            mb-3
            text-xs
            font-semibold
            uppercase
            tracking-[0.25em]
            text-primary
          "
        >
          AuthSphere Services
        </p>


        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
            sm:text-5xl
            lg:text-6xl
          "
        >

          Authentication

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
            without compromise.
          </span>

        </h1>


        <p
          className="
            mx-auto
            mt-5
            max-w-2xl
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
          "
        >
          AuthSphere provides the essential authentication
          services required to build secure, modern and
          scalable applications.
        </p>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section
        className="
          mx-auto
          mt-16
          max-w-6xl
        "
      >

        <div
          className="
            mb-8
            text-center
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-primary
            "
          >
            Core Services
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-bold
              sm:text-3xl
            "
          >
            Everything your application needs
          </h2>

        </div>


        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <ServiceCard
            icon={<Users />}
            title="User Registration"
            description="Create and manage user accounts with secure registration and validation."
          />


          <ServiceCard
            icon={<LockKeyhole />}
            title="Secure Login"
            description="Authenticate users using email and password credentials."
          />


          <ServiceCard
            icon={<KeyRound />}
            title="JWT Authentication"
            description="Generate and validate access tokens for protected application resources."
          />


          <ServiceCard
            icon={<Fingerprint />}
            title="OAuth2 Authentication"
            description="Allow users to authenticate using external identity providers such as Google and GitHub."
          />


          <ServiceCard
            icon={<RefreshCw />}
            title="Token Refresh"
            description="Refresh expired access tokens while maintaining the authenticated session."
          />


          <ServiceCard
            icon={<ShieldCheck />}
            title="Protected APIs"
            description="Secure backend endpoints and allow access only to authenticated users."
          />


          <ServiceCard
            icon={<Server />}
            title="Session Management"
            description="Manage authentication sessions and maintain secure client state."
          />


          <ServiceCard
            icon={<Globe2 />}
            title="REST API"
            description="Connect the React application with a Spring Boot authentication backend."
          />


          <ServiceCard
            icon={<ShieldCheck />}
            title="Security Controls"
            description="Use authentication and authorization mechanisms to protect application resources."
          />

        </div>

      </section>


      {/* =================================================
          AUTHENTICATION ARCHITECTURE
      ================================================= */}

      <section
        className="
          mx-auto
          mt-16
          max-w-6xl
        "
      >

        <Card
          className="
            rounded-3xl
            border-white/10
            bg-card/60
            shadow-2xl
            backdrop-blur-xl
          "
        >

          <CardContent
            className="
              p-6
              sm:p-8
              lg:p-10
            "
          >

            <div
              className="
                grid
                gap-10
                lg:grid-cols-2
                lg:items-center
              "
            >

              {/* Left */}

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-primary
                  "
                >
                  Architecture
                </p>


                <h2
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    sm:text-3xl
                  "
                >
                  A complete authentication pipeline
                </h2>


                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  AuthSphere connects the frontend,
                  authentication services and protected
                  backend APIs into a single authentication
                  workflow.
                </p>

              </div>


              {/* Right */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-background/50
                  p-5
                "
              >

                <FlowItem
                  number="01"
                  title="React Client"
                  text="User interacts with the authentication interface."
                />


                <FlowLine />


                <FlowItem
                  number="02"
                  title="Spring Security"
                  text="Credentials and OAuth2 authentication are processed."
                />


                <FlowLine />


                <FlowItem
                  number="03"
                  title="JWT Token"
                  text="Authenticated users receive an access token."
                />


                <FlowLine />


                <FlowItem
                  number="04"
                  title="Protected API"
                  text="The access token authorizes secured requests."
                />

              </div>

            </div>

          </CardContent>

        </Card>

      </section>


      {/* =================================================
          TECHNOLOGY STACK
      ================================================= */}

      <section
        className="
          mx-auto
          mt-16
          max-w-5xl
        "
      >

        <div
          className="
            mb-8
            text-center
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-primary
            "
          >
            Technology
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-bold
              sm:text-3xl
            "
          >
            Built for modern applications
          </h2>

        </div>


        <div
          className="
            grid
            grid-cols-2
            gap-4
            sm:grid-cols-4
          "
        >

          <TechCard name="React" />

          <TechCard name="TypeScript" />

          <TechCard name="Spring Boot" />

          <TechCard name="Spring Security" />

          <TechCard name="JWT" />

          <TechCard name="OAuth2" />

          <TechCard name="Zustand" />

          <TechCard name="shadcn/ui" />

        </div>

      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section
        className="
          mx-auto
          mt-16
          max-w-3xl
          pb-8
          text-center
        "
      >

        <Card
          className="
            rounded-3xl
            border-primary/10
            bg-primary/3
          "
        >

          <CardContent
            className="
              p-8
              sm:p-10
            "
          >

            <ShieldCheck
              className="
                mx-auto
                h-8
                w-8
                text-primary
              "
            />


            <h2
              className="
                mt-4
                text-2xl
                font-bold
              "
            >
              Experience secure authentication
            </h2>


            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Create your AuthSphere account and explore
              the authentication platform.
            </p>


            <div
              className="
                mt-6
                flex
                flex-col
                justify-center
                gap-3
                sm:flex-row
              "
            >

              <Button
                onClick={() =>
                  navigate("/signup")
                }
                className="
                  cursor-pointer
                  gap-2
                "
              >
                Create Account

                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />

              </Button>


              <Button
                variant="outline"
                onClick={() =>
                  navigate("/login")
                }
                className="
                  cursor-pointer
                "
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
// SERVICE CARD
// =====================================================

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {

  return (
    <Card
      className="
        group
        rounded-2xl
        border-white/10
        bg-card/50
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/20
        hover:bg-card/80
      "
    >

      <CardContent
        className="
          p-6
        "
      >

        <div
          className="
            mb-5
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
            transition-transform
            duration-300
            group-hover:scale-105
          "
        >
          {icon}
        </div>


        <h3
          className="
            font-semibold
          "
        >
          {title}
        </h3>


        <p
          className="
            mt-2
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {description}
        </p>

      </CardContent>

    </Card>
  );
}


// =====================================================
// FLOW ITEM
// =====================================================

function FlowItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {

  return (
    <div
      className="
        flex
        items-start
        gap-4
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-primary/10
          text-xs
          font-bold
          text-primary
        "
      >
        {number}
      </div>


      <div>

        <p
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </p>


        <p
          className="
            mt-1
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {text}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// FLOW LINE
// =====================================================

function FlowLine() {

  return (
    <div
      className="
        ml-4.5
        h-5
        w-px
        bg-border
      "
    />
  );
}


// =====================================================
// TECHNOLOGY CARD
// =====================================================

function TechCard({
  name,
}: {
  name: string;
}) {

  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-card/50
        p-4
        text-center
        transition-all
        hover:border-primary/20
        hover:bg-card
      "
    >

      <span
        className="
          text-sm
          font-semibold
        "
      >
        {name}
      </span>

    </div>
  );
}


export default ServicesPage;