import { useState } from "react";

import { motion } from "framer-motion";

import {
  Activity,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock3,
  Code2,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  LogIn,
  Monitor,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  Users,
  Zap,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { getCurrentUser } from "@/services/AuthService";

import useAuth from "@/auth/store";

import type UserT from "@/models/User";


// =====================================================
// ANIMATION
// =====================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};


// =====================================================
// COMPONENT
// =====================================================

function Userhome() {

  // ===================================================
  // AUTH STATE
  // ===================================================

  const user = useAuth(
    (state) => state.user
  );


  // ===================================================
  // LOCAL STATE
  // ===================================================

  const [currentUser, setCurrentUser] =
    useState<UserT | null>(null);

  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // GET CURRENT USER
  // ===================================================

  const getUserData = async () => {

    if (!user?.email) {

      toast.error(
        "User information is not available."
      );

      return;
    }


    try {

      setLoading(true);


      const response =
        await getCurrentUser(user.email);


      setCurrentUser(response);


      toast.success(
        "Secure API access verified."
      );

    } catch (error) {

      console.error(
        "Error getting current user:",
        error
      );


      toast.error(
        "Unable to access secured API."
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // STATS
  // ===================================================

  const stats = [

    {
      title: "Authentication",
      value: "Active",
      description: "Session authenticated",
      icon: ShieldCheck,
    },

    {
      title: "Security Score",
      value: "98%",
      description: "Excellent protection",
      icon: Shield,
    },

    {
      title: "Active Sessions",
      value: "03",
      description: "Devices currently active",
      icon: Monitor,
    },

    {
      title: "API Status",
      value: "Online",
      description: "All services operational",
      icon: Server,
    },

  ];


  // ===================================================
  // REQUIREMENTS
  // ===================================================

  const requirements = [

    {
      title: "JWT Authentication",
      description:
        "Short-lived access tokens protect secured API resources.",
      icon: KeyRound,
    },

    {
      title: "Refresh Token Rotation",
      description:
        "Refresh tokens are rotated to reduce token replay risks.",
      icon: RefreshCw,
    },

    {
      title: "HttpOnly Cookies",
      description:
        "Sensitive refresh credentials remain protected from JavaScript access.",
      icon: LockKeyhole,
    },

    {
      title: "OAuth2 Login",
      description:
        "Authenticate through external identity providers such as Google and GitHub.",
      icon: Fingerprint,
    },

    {
      title: "Role-Based Authorization",
      description:
        "Application resources can be protected according to user roles.",
      icon: Users,
    },

    {
      title: "Secure API Layer",
      description:
        "Protected APIs validate authentication before returning sensitive data.",
      icon: Code2,
    },

  ];


  // ===================================================
  // ACTIVITY
  // ===================================================

  const activities = [

    {
      title: "Successful login",
      description: "Chrome · Windows",
      time: "Just now",
      icon: LogIn,
    },

    {
      title: "Security verification",
      description: "JWT access token validated",
      time: "2 min ago",
      icon: ShieldCheck,
    },

    {
      title: "Session active",
      description: "Current browser session",
      time: "Today",
      icon: Monitor,
    },

    {
      title: "OAuth provider ready",
      description: "Google / GitHub authentication",
      time: "Today",
      icon: Fingerprint,
    },

  ];


  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        px-4
        py-6
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
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            left-1/2
            top-0
            h-112.5
            w-112.5
            -translate-x-1/2
            rounded-full
            bg-primary/6
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-0
           -right-37.5
            h-100
            w-100
            rounded-full
            bg-primary/4
            blur-[130px]
          "
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            duration: 0.5,
          }}
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                "
              >

                <ShieldCheck
                  className="h-4 w-4 text-primary"
                />

              </span>


              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-primary
                "
              >
                AuthSphere Control Center
              </span>

            </div>


            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >

              Welcome back,

              <span className="block text-muted-foreground">

                {user?.name || "User"}

              </span>

            </h1>


            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Monitor your authentication state,
              security posture, sessions and protected
              API access from one secure dashboard.
            </p>

          </div>


          {/* STATUS */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-green-500/20
              bg-green-500/5
              px-4
              py-2
            "
          >

            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-green-500
              "
            />

            <span className="text-xs font-medium">
              Authentication Active
            </span>

          </div>

        </motion.div>


        {/* =================================================
            STATS
        ================================================= */}

        <div
          className="
            mb-8
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          {stats.map(
            (stat, index) => {

              const Icon = stat.icon;

              return (

                <motion.div
                  key={stat.title}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >

                  <Card
                    className="
                      h-full
                      rounded-2xl
                      border-border/60
                      bg-card/60
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary/30
                    "
                  >

                    <CardContent className="p-5">

                      <div
                        className="
                          mb-5
                          flex
                          items-center
                          justify-between
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

                          <Icon
                            className="
                              h-5
                              w-5
                              text-primary
                            "
                          />

                        </div>


                        <ArrowUpRight
                          className="
                            h-4
                            w-4
                            text-muted-foreground
                          "
                        />

                      </div>


                      <p
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {stat.title}
                      </p>


                      <h2
                        className="
                          mt-1
                          text-2xl
                          font-bold
                        "
                      >
                        {stat.value}
                      </h2>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {stat.description}
                      </p>

                    </CardContent>

                  </Card>

                </motion.div>

              );

            }
          )}

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-3
          "
        >


          {/* =================================================
              SECURITY OVERVIEW
          ================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="lg:col-span-2"
          >

            <Card
              className="
                rounded-2xl
                border-border/60
                bg-card/60
                backdrop-blur-xl
              "
            >

              <CardHeader>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <CardTitle>
                      Security Overview
                    </CardTitle>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-muted-foreground
                      "
                    >
                      Current authentication posture
                    </p>

                  </div>


                  <Badge
                    variant="outline"
                    className="
                      gap-1
                      border-green-500/20
                      text-green-500
                    "
                  >

                    <CircleCheck
                      className="h-3 w-3"
                    />

                    Protected

                  </Badge>

                </div>

              </CardHeader>


              <CardContent>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  {/* JWT */}

                  <SecurityItem
                    icon={KeyRound}
                    title="JWT Access Token"
                    value="Active"
                  />


                  {/* Refresh */}

                  <SecurityItem
                    icon={RefreshCw}
                    title="Refresh Token"
                    value="Protected"
                  />


                  {/* Cookie */}

                  <SecurityItem
                    icon={LockKeyhole}
                    title="HttpOnly Cookie"
                    value="Enabled"
                  />


                  {/* OAuth */}

                  <SecurityItem
                    icon={Fingerprint}
                    title="OAuth2"
                    value="Available"
                  />

                </div>

              </CardContent>

            </Card>

          </motion.div>


          {/* =================================================
              API ACCESS
          ================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
          >

            <Card
              className="
                h-full
                rounded-2xl
                border-primary/20
                bg-primary/3
                backdrop-blur-xl
              "
            >

              <CardHeader>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                  "
                >

                  <Server
                    className="
                      h-5
                      w-5
                      text-primary
                    "
                  />

                </div>


                <CardTitle className="mt-4">
                  Protected API
                </CardTitle>

                <p
                  className="
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  Verify that your current
                  authentication can access
                  secured backend resources.
                </p>

              </CardHeader>


              <CardContent>

                <Button
                  onClick={getUserData}
                  disabled={loading}
                  className="
                    w-full
                    cursor-pointer
                    rounded-xl
                  "
                >

                  {loading ? (

                    <>
                      <RefreshCw
                        className="
                          mr-2
                          h-4
                          w-4
                          animate-spin
                        "
                      />

                      Verifying...

                    </>

                  ) : (

                    <>
                      <Zap
                        className="mr-2 h-4 w-4"
                      />

                      Test Secure API

                    </>

                  )}

                </Button>


                {currentUser && (

                  <div
                    className="
                      mt-4
                      rounded-xl
                      border
                      border-green-500/20
                      bg-green-500/5
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <CircleCheck
                        className="
                          h-4
                          w-4
                          text-green-500
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        API access verified
                      </span>

                    </div>


                    <p
                      className="
                        mt-2
                        text-xs
                        text-muted-foreground
                      "
                    >
                      Authenticated user:
                      {" "}
                      {currentUser.name}
                    </p>

                  </div>

                )}

              </CardContent>

            </Card>

          </motion.div>

        </div>


        {/* =================================================
            REQUIREMENTS
        ================================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="mt-6"
        >

          <Card
            className="
              rounded-2xl
              border-border/60
              bg-card/60
              backdrop-blur-xl
            "
          >

            <CardHeader>

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

                  <CardTitle>
                    Security Requirements
                  </CardTitle>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Authentication capabilities
                    enabled by AuthSphere.
                  </p>

                </div>

              </div>

            </CardHeader>


            <CardContent>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >

                {requirements.map(
                  (requirement) => {

                    const Icon =
                      requirement.icon;

                    return (

                      <div
                        key={requirement.title}
                        className="
                          group
                          rounded-xl
                          border
                          border-border/50
                          bg-background/30
                          p-4
                          transition-all
                          duration-300
                          hover:border-primary/30
                          hover:bg-primary/3
                        "
                      >

                        <div
                          className="
                            mb-4
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-muted
                            "
                          >

                            <Icon
                              className="
                                h-4
                                w-4
                                text-primary
                              "
                            />

                          </div>


                          <Check
                            className="
                              h-4
                              w-4
                              text-green-500
                            "
                          />

                        </div>


                        <h3
                          className="
                            text-sm
                            font-semibold
                          "
                        >
                          {requirement.title}
                        </h3>


                        <p
                          className="
                            mt-2
                            text-xs
                            leading-5
                            text-muted-foreground
                          "
                        >
                          {requirement.description}
                        </p>

                      </div>

                    );

                  }
                )}

              </div>

            </CardContent>

          </Card>

        </motion.div>


        {/* =================================================
            BOTTOM GRID
        ================================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >


          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.5,
              delay: 0.35,
            }}
          >

            <Card
              className="
                rounded-2xl
                border-border/60
                bg-card/60
                backdrop-blur-xl
              "
            >

              <CardHeader>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <CardTitle>
                      Recent Activity
                    </CardTitle>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-muted-foreground
                      "
                    >
                      Latest authentication events
                    </p>

                  </div>


                  <Activity
                    className="
                      h-5
                      w-5
                      text-primary
                    "
                  />

                </div>

              </CardHeader>


              <CardContent>

                <div className="space-y-5">

                  {activities.map(
                    (activity) => {

                      const Icon =
                        activity.icon;

                      return (

                        <div
                          key={activity.title}
                          className="
                            flex
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
                              rounded-full
                              bg-muted
                            "
                          >

                            <Icon
                              className="
                                h-4
                                w-4
                                text-primary
                              "
                            />

                          </div>


                          <div className="min-w-0 flex-1">

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3
                              "
                            >

                              <p
                                className="
                                  text-sm
                                  font-medium
                                "
                              >
                                {activity.title}
                              </p>


                              <span
                                className="
                                  shrink-0
                                  text-[10px]
                                  text-muted-foreground
                                "
                              >
                                {activity.time}
                              </span>

                            </div>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {activity.description}
                            </p>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </CardContent>

            </Card>

          </motion.div>


          {/* =================================================
              SESSION INFORMATION
          ================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.5,
              delay: 0.4,
            }}
          >

            <Card
              className="
                h-full
                rounded-2xl
                border-border/60
                bg-card/60
                backdrop-blur-xl
              "
            >

              <CardHeader>

                <CardTitle>
                  Current Session
                </CardTitle>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Information about your
                  authenticated session.
                </p>

              </CardHeader>


              <CardContent>

                <div className="space-y-4">

                  <SessionRow
                    icon={User}
                    label="Account"
                    value={
                      user?.email ||
                      "Authenticated user"
                    }
                  />


                  <Separator />


                  <SessionRow
                    icon={Monitor}
                    label="Device"
                    value="Current browser"
                  />


                  <Separator />


                  <SessionRow
                    icon={Smartphone}
                    label="Authentication"
                    value="JWT + Refresh Token"
                  />


                  <Separator />


                  <SessionRow
                    icon={Clock3}
                    label="Session status"
                    value="Active"
                  />

                </div>

              </CardContent>

            </Card>

          </motion.div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            mt-8
            flex
            flex-col
            items-center
            justify-between
            gap-3
            border-t
            border-border/50
            pt-5
            text-xs
            text-muted-foreground
            sm:flex-row
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <ShieldCheck
              className="h-3.5 w-3.5"
            />

            AuthSphere Security Platform

          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span>
              Protected environment
            </span>

            <span>
              •
            </span>

            <span>
              v1.0.0
            </span>

          </div>

        </div>

      </div>

    </main>

  );
}


// =====================================================
// SECURITY ITEM
// =====================================================

type SecurityItemProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  value: string;
};


function SecurityItem({
  icon: Icon,
  title,
  value,
}: SecurityItemProps) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-border/50
        bg-background/30
        p-4
      "
    >

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
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-muted
          "
        >

          <Icon
            className="
              h-4
              w-4
              text-primary
            "
          />

        </div>


        <span className="text-sm">
          {title}
        </span>

      </div>


      <Badge
        variant="outline"
        className="
          border-green-500/20
          text-green-500
        "
      >
        {value}
      </Badge>

    </div>

  );
}


// =====================================================
// SESSION ROW
// =====================================================

type SessionRowProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
};


function SessionRow({
  icon: Icon,
  label,
  value,
}: SessionRowProps) {

  return (

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
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          bg-muted
        "
      >

        <Icon
          className="
            h-4
            w-4
            text-primary
          "
        />

      </div>


      <div className="min-w-0">

        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          {label}
        </p>


        <p
          className="
            truncate
            text-sm
            font-medium
          "
        >
          {value}
        </p>

      </div>

    </div>

  );
}


export default Userhome;