import { useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Globe2,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  Monitor,
  MoreHorizontal,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  Wifi,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";


// ============================================================
// TYPES
// ============================================================

type Session = {
  id: number;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  secure: boolean;
};


// ============================================================
// SESSION DATA
// ============================================================

const initialSessions: Session[] = [
  {
    id: 1,
    device: "Windows Desktop",
    browser: "Firefox",
    location: "Bengaluru, India",
    ip: "192.168.1.20",
    lastActive: "Now",
    current: true,
    secure: true,
  },
  {
    id: 2,
    device: "Android Phone",
    browser: "Mobile Browser",
    location: "Bengaluru, India",
    ip: "103.24.xx.xx",
    lastActive: "12 minutes ago",
    current: false,
    secure: true,
  },
  {
    id: 3,
    device: "MacBook Pro",
    browser: "Safari",
    location: "Mumbai, India",
    ip: "49.36.xx.xx",
    lastActive: "2 hours ago",
    current: false,
    secure: true,
  },
  {
    id: 4,
    device: "Windows Laptop",
    browser: "Edge",
    location: "Delhi, India",
    ip: "117.98.xx.xx",
    lastActive: "Yesterday",
    current: false,
    secure: false,
  },
];


// ============================================================
// DEVICE ICON
// ============================================================

function DeviceIcon({ device }: { device: string }) {
  if (device.toLowerCase().includes("android")) {
    return <Smartphone className="h-5 w-5" />;
  }

  if (device.toLowerCase().includes("macbook")) {
    return <Laptop className="h-5 w-5" />;
  }

  if (device.toLowerCase().includes("tablet")) {
    return <Tablet className="h-5 w-5" />;
  }

  return <Monitor className="h-5 w-5" />;
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function SessionsPage() {
  const [sessions, setSessions] =
    useState<Session[]>(initialSessions);

  const [copiedIp, setCopiedIp] =
    useState<string | null>(null);


  // ============================================================
  // REVOKE SESSION
  // ============================================================

  const revokeSession = (id: number) => {
    setSessions((current) =>
      current.filter((session) => session.id !== id)
    );
  };


  // ============================================================
  // REVOKE ALL OTHER SESSIONS
  // ============================================================

  const revokeOtherSessions = () => {
    setSessions((current) =>
      current.filter((session) => session.current)
    );
  };


  // ============================================================
  // COPY IP
  // ============================================================

  const copyIp = async (ip: string) => {
    try {
      await navigator.clipboard.writeText(ip);

      setCopiedIp(ip);

      setTimeout(() => {
        setCopiedIp(null);
      }, 1500);
    } catch {
      // Ignore clipboard errors
    }
  };


  // ============================================================
  // COUNTS
  // ============================================================

  const activeSessions = sessions.length;

  const secureSessions =
    sessions.filter((session) => session.secure).length;

  const riskySessions =
    sessions.filter((session) => !session.secure).length;


  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ======================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="
            absolute
            left-[10%]
            top-[10%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-cyan-500/[0.04]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[5%]
            top-[30%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-violet-500/[0.04]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            left-[40%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-blue-500/[0.03]
            blur-[120px]
          "
        />

      </div>


      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-cyan-400/20
                  bg-cyan-400/10
                "
              >
                <Activity className="h-4 w-4 text-cyan-400" />
              </div>

              <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                Security Center
              </span>

            </div>


            <h1
              className="
                text-3xl
                font-semibold
                tracking-tight
                md:text-5xl
              "
            >
              Active Sessions
            </h1>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
              Monitor devices connected to your AuthSphere account,
              review activity, and terminate suspicious sessions.
            </p>

          </div>


          <Button
            variant="outline"
            className="
              border-white/10
              bg-white/[0.03]
              text-zinc-300
              hover:bg-white/[0.08]
              hover:text-white
            "
            onClick={() => setSessions(initialSessions)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

        </div>


        {/* ====================================================
            SECURITY STATUS
        ==================================================== */}

        <Alert
          className="
            mb-8
            border-emerald-500/20
            bg-emerald-500/[0.05]
            text-emerald-300
          "
        >

          <ShieldCheck className="h-5 w-5" />

          <AlertTitle>
            Your account is protected
          </AlertTitle>

          <AlertDescription className="text-emerald-400/70">
            All active sessions are monitored. Review any device
            or location that you don't recognize.
          </AlertDescription>

        </Alert>


        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">


          {/* ACTIVE */}

          <Card
            className="
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
            "
          >

            <CardContent className="p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Active Sessions
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {activeSessions}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    p-3
                  "
                >
                  <Wifi className="h-5 w-5 text-cyan-400" />
                </div>

              </div>

            </CardContent>

          </Card>


          {/* SECURE */}

          <Card
            className="
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
            "
          >

            <CardContent className="p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Secure Devices
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {secureSessions}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                    p-3
                  "
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

              </div>

            </CardContent>

          </Card>


          {/* RISK */}

          <Card
            className="
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
            "
          >

            <CardContent className="p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Attention Required
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {riskySessions}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-amber-400/20
                    bg-amber-400/10
                    p-3
                  "
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ====================================================
            SESSION LIST
        ==================================================== */}

        <Card
          className="
            overflow-hidden
            border-white/[0.08]
            bg-white/[0.025]
            backdrop-blur-xl
          "
        >

          <CardHeader>

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <CardTitle className="text-xl">
                  Connected Devices
                </CardTitle>

                <CardDescription className="mt-1 text-zinc-500">
                  Devices currently authenticated with your account.
                </CardDescription>

              </div>


              <Button
                variant="destructive"
                size="sm"
                onClick={revokeOtherSessions}
                disabled={sessions.length <= 1}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out other devices
              </Button>

            </div>

          </CardHeader>


          <CardContent className="p-0">

            {sessions.map((session, index) => (

              <div key={session.id}>

                {index > 0 && (
                  <Separator className="bg-white/[0.06]" />
                )}


                <div
                  className="
                    group
                    p-5
                    transition
                    hover:bg-white/[0.025]
                    md:p-6
                  "
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


                    {/* DEVICE */}

                    <div className="flex items-start gap-4">

                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          ${
                            session.current
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                              : "border-white/10 bg-white/[0.04] text-zinc-400"
                          }
                        `}
                      >

                        <DeviceIcon
                          device={session.device}
                        />

                      </div>


                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-medium">
                            {session.device}
                          </h3>


                          {session.current && (
                            <Badge
                              className="
                                border-cyan-400/20
                                bg-cyan-400/10
                                text-cyan-400
                                hover:bg-cyan-400/10
                              "
                            >
                              Current device
                            </Badge>
                          )}


                          {session.secure ? (
                            <Badge
                              variant="outline"
                              className="
                                border-emerald-400/20
                                text-emerald-400
                              "
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Secure
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="
                                border-amber-400/20
                                text-amber-400
                              "
                            >
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Review
                            </Badge>
                          )}

                        </div>


                        <p className="mt-1 text-sm text-zinc-500">
                          {session.browser}
                        </p>


                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-x-5
                            gap-y-2
                            text-xs
                            text-zinc-500
                          "
                        >

                          <span className="flex items-center gap-1.5">
                            <Globe2 className="h-3.5 w-3.5" />
                            {session.location}
                          </span>


                          <button
                            onClick={() => copyIp(session.ip)}
                            className="
                              flex
                              items-center
                              gap-1.5
                              transition
                              hover:text-white
                            "
                          >

                            {copiedIp === session.ip ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}

                            {session.ip}

                          </button>


                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {session.lastActive}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* ACTION */}

                    <div className="flex items-center gap-2">

                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            revokeSession(session.id)
                          }
                          className="
                            border-white/10
                            bg-white/[0.03]
                            text-zinc-300
                            hover:border-red-400/20
                            hover:bg-red-400/10
                            hover:text-red-400
                          "
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Revoke
                        </Button>
                      )}


                      <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="
                              text-zinc-500
                              hover:bg-white/[0.06]
                              hover:text-white
                            "
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>

                        </DropdownMenuTrigger>


                        <DropdownMenuContent
                          align="end"
                          className="
                            w-48
                            border-white/10
                            bg-[#101010]
                            text-white
                          "
                        >

                          <DropdownMenuItem
                            className="cursor-pointer"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            View security
                          </DropdownMenuItem>


                          <DropdownMenuItem
                            className="cursor-pointer"
                          >
                            <Clock3 className="mr-2 h-4 w-4" />
                            Activity history
                          </DropdownMenuItem>


                          {!session.current && (
                            <>
                              <DropdownMenuSeparator className="bg-white/10" />

                              <DropdownMenuItem
                                onClick={() =>
                                  revokeSession(session.id)
                                }
                                className="
                                  cursor-pointer
                                  text-red-400
                                  focus:bg-red-400/10
                                  focus:text-red-400
                                "
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Revoke session
                              </DropdownMenuItem>
                            </>
                          )}

                        </DropdownMenuContent>

                      </DropdownMenu>

                    </div>

                  </div>

                </div>

              </div>

            ))}


            {/* EMPTY STATE */}

            {sessions.length === 0 && (

              <div className="p-12 text-center">

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                  "
                >
                  <LockKeyhole className="h-6 w-6 text-zinc-500" />
                </div>

                <h3 className="font-medium">
                  No active sessions
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Your account currently has no active sessions.
                </p>

              </div>

            )}

          </CardContent>

        </Card>


        {/* ====================================================
            SECURITY REQUIREMENTS
        ==================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
              Protection Layer
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Security Requirements
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Recommended controls for keeping your authentication
              sessions protected.
            </p>

          </div>


          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


            {/* REQUIREMENT 1 */}

            <Card className="border-white/[0.08] bg-white/[0.025]">

              <CardContent className="p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <KeyRound className="h-5 w-5 text-emerald-400" />
                </div>

                <h3 className="font-medium">
                  Strong Authentication
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Use a strong password and avoid reusing
                  credentials across services.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Enabled
                </div>

              </CardContent>

            </Card>


            {/* REQUIREMENT 2 */}

            <Card className="border-white/[0.08] bg-white/[0.025]">

              <CardContent className="p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                </div>

                <h3 className="font-medium">
                  Token Protection
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Refresh tokens are protected and rotated
                  during authentication.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Protected
                </div>

              </CardContent>

            </Card>


            {/* REQUIREMENT 3 */}

            <Card className="border-white/[0.08] bg-white/[0.025]">

              <CardContent className="p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                  <LockKeyhole className="h-5 w-5 text-violet-400" />
                </div>

                <h3 className="font-medium">
                  Secure Cookies
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Authentication refresh tokens are stored
                  using protected HTTP cookies.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-violet-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Enabled
                </div>

              </CardContent>

            </Card>


            {/* REQUIREMENT 4 */}

            <Card className="border-white/[0.08] bg-white/[0.025]">

              <CardContent className="p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
                  <Globe2 className="h-5 w-5 text-amber-400" />
                </div>

                <h3 className="font-medium">
                  Session Monitoring
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Review device, location and session activity
                  regularly.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Recommended
                </div>

              </CardContent>

            </Card>

          </div>

        </section>


        {/* ====================================================
            IMPORT / EXPORT SECTION
        ==================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
              Account Tools
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Import & Export
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Manage session information and authentication
              security data.
            </p>

          </div>


          <div className="grid gap-4 md:grid-cols-2">


            {/* EXPORT */}

            <Card
              className="
                border-white/[0.08]
                bg-gradient-to-br
                from-white/[0.04]
                to-white/[0.01]
              "
            >

              <CardContent className="p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <div
                      className="
                        mb-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                      "
                    >
                      <ArrowDownToLine className="h-5 w-5 text-cyan-400" />
                    </div>

                    <h3 className="font-semibold">
                      Export Security Data
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                      Export a copy of your active session
                      information for auditing or security review.
                    </p>

                  </div>

                </div>


                <Button
                  className="
                    mt-5
                    border
                    border-white/10
                    bg-white/[0.06]
                    hover:bg-white/[0.1]
                  "
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Export Data
                </Button>

              </CardContent>

            </Card>


            {/* IMPORT */}

            <Card
              className="
                border-white/[0.08]
                bg-gradient-to-br
                from-white/[0.04]
                to-white/[0.01]
              "
            >

              <CardContent className="p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <div
                      className="
                        mb-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-violet-400/20
                        bg-violet-400/10
                      "
                    >
                      <ArrowUpFromLine className="h-5 w-5 text-violet-400" />
                    </div>

                    <h3 className="font-semibold">
                      Import Security Configuration
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                      Restore supported authentication settings
                      from a previously exported configuration.
                    </p>

                  </div>

                </div>


                <Button
                  variant="outline"
                  className="
                    mt-5
                    border-white/10
                    bg-white/[0.03]
                    hover:bg-white/[0.08]
                  "
                >
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Import Configuration
                </Button>

              </CardContent>

            </Card>

          </div>

        </section>


        {/* ====================================================
            FOOTER SECURITY NOTE
        ==================================================== */}

        <div
          className="
            mt-10
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.02]
            p-5
          "
        >

          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

          <div>

            <p className="text-sm font-medium">
              Session security
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              If you notice a device, location, or activity that
              you don't recognize, revoke the session immediately
              and change your password.
            </p>

          </div>

        </div>


      </div>

    </div>
  );
}