import React from "react";
import { useNavigate } from "react-router";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  Clock3,
  Code2,
  Database,
  Eye,
  FileKey2,
  Fingerprint,
  Globe,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  MailCheck,
  MapPin,
  Monitor,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRoundCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();

  const securityScore = 86;

  // -----------------------------------------
  // SECURITY REQUIREMENTS
  // -----------------------------------------

  const securityRequirements = [
    {
      title: "Email verification",
      description: "Your primary email address is verified.",
      completed: true,
      icon: MailCheck,
    },
    {
      title: "Strong password",
      description: "Your account is protected with a strong password.",
      completed: true,
      icon: KeyRound,
    },
    {
      title: "Two-factor authentication",
      description: "Add another layer of protection to your account.",
      completed: false,
      icon: Smartphone,
    },
    {
      title: "Recovery method",
      description: "Configure a recovery option for account access.",
      completed: true,
      icon: RefreshCw,
    },
  ];

  // -----------------------------------------
  // AUTHENTICATION METHODS
  // -----------------------------------------

  const authenticationMethods = [
    {
      title: "Password",
      description: "Primary authentication method",
      icon: Lock,
      status: "Active",
      active: true,
    },
    {
      title: "Google",
      description: "OAuth 2.0 authentication",
      icon: Globe,
      status: "Connected",
      active: true,
    },
    {
      title: "GitHub",
      description: "OAuth 2.0 authentication",
      icon: Code2,
      status: "Connected",
      active: true,
    },
    {
      title: "Passkey",
      description: "Passwordless biometric authentication",
      icon: Fingerprint,
      status: "Not configured",
      active: false,
    },
  ];

  // -----------------------------------------
  // ACTIVE SESSIONS
  // -----------------------------------------

  const sessions = [
    {
      device: "Windows Desktop",
      browser: "Chrome",
      location: "Bengaluru, India",
      ip: "127.0.0.1",
      time: "Current session",
      current: true,
      icon: Monitor,
    },
    {
      device: "Android Device",
      browser: "Chrome Mobile",
      location: "Bengaluru, India",
      ip: "192.168.x.x",
      time: "2 hours ago",
      current: false,
      icon: Smartphone,
    },
    {
      device: "Windows Laptop",
      browser: "Firefox",
      location: "Delhi, India",
      ip: "192.168.x.x",
      time: "Yesterday",
      current: false,
      icon: Laptop,
    },
  ];

  // -----------------------------------------
  // SECURITY ACTIVITY
  // -----------------------------------------

  const securityActivity = [
    {
      title: "Successful login",
      description: "Login completed using password authentication.",
      time: "Just now",
      icon: CheckCircle2,
      type: "success",
    },
    {
      title: "Google account connected",
      description: "Google OAuth provider was successfully linked.",
      time: "2 hours ago",
      icon: Globe,
      type: "success",
    },
    {
      title: "New session detected",
      description: "A new browser session was created.",
      time: "Yesterday",
      icon: Monitor,
      type: "warning",
    },
  ];

  // -----------------------------------------
  // SECURITY ARCHITECTURE
  // -----------------------------------------

  const securityArchitecture = [
    {
      title: "JWT Security",
      description: "Signed access tokens",
      icon: FileKey2,
    },
    {
      title: "Refresh Tokens",
      description: "Rotating session tokens",
      icon: RefreshCw,
    },
    {
      title: "Role Based Access",
      description: "Permission enforcement",
      icon: UserRoundCheck,
    },
    {
      title: "Secure Database",
      description: "Protected user records",
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Cyan glow */}
        <div className="absolute left-[8%] top-[8%] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.045] blur-[120px]" />

        {/* Purple glow */}
        <div className="absolute right-[5%] top-[35%] h-[380px] w-[380px] rounded-full bg-purple-500/[0.045] blur-[140px]" />

        {/* Green glow */}
        <div className="absolute bottom-[10%] left-[35%] h-[280px] w-[280px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">
        {/* =================================================
            BACK BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="group mb-8 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          <span>Back to dashboard</span>
        </button>

        {/* =================================================
            HEADER
        ================================================== */}

        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.03] px-3 py-1.5 text-zinc-400"
            >
              <ShieldCheck size={14} className="mr-2" />
              SECURITY CENTER
            </Badge>

            <Badge className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SYSTEM SECURE
            </Badge>
          </div>

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.045em] md:text-5xl lg:text-6xl">
                Security
                <span className="text-zinc-600"> Center.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
                Monitor authentication methods, active sessions, account
                protection and security activity from one centralized
                security environment.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>

              <Button
                type="button"
                className="bg-white text-black hover:bg-zinc-200"
                onClick={() => navigate("/dashboard/settings")}
              >
                <Settings2 size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </section>

        {/* =================================================
            SECURITY OVERVIEW
        ================================================== */}

        <section className="mb-8 grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Security Score */}

          <Card className="relative overflow-hidden border-white/[0.08] bg-white/[0.025]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/[0.06] blur-3xl" />

            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-xs tracking-[0.16em] text-zinc-600">
                    SECURITY SCORE
                  </CardDescription>

                  <CardTitle className="mt-2 text-2xl">
                    Account protection
                  </CardTitle>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <ShieldCheck
                    size={25}
                    className="text-emerald-400"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-3 flex items-end justify-between">
                <div className="text-5xl font-semibold tracking-tight">
                  {securityScore}
                  <span className="text-xl text-zinc-600">/100</span>
                </div>

                <span className="mb-1 text-sm text-emerald-400">
                  Strong protection
                </span>
              </div>

              <Progress
                value={securityScore}
                className="h-2 bg-white/[0.06]"
              />

              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Your account has good protection. Enable two-factor
                authentication to increase your security score.
              </p>
            </CardContent>
          </Card>

          {/* Authentication */}

          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardHeader>
              <CardDescription className="text-xs tracking-[0.16em] text-zinc-600">
                AUTHENTICATION
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Lock size={21} className="text-zinc-300" />
                </div>

                <div>
                  <p className="text-2xl font-semibold">3</p>

                  <p className="text-sm text-zinc-600">
                    active methods
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions */}

          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardHeader>
              <CardDescription className="text-xs tracking-[0.16em] text-zinc-600">
                ACTIVE SESSIONS
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Monitor size={21} className="text-zinc-300" />
                </div>

                <div>
                  <p className="text-2xl font-semibold">3</p>

                  <p className="text-sm text-zinc-600">
                    connected devices
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* =================================================
            SECURITY REQUIREMENTS
        ================================================== */}

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
              PROTECTION CHECK
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Security requirements
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Complete these requirements to strengthen your account.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {securityRequirements.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.035]"
                >
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`shrink-0 rounded-xl border p-3 ${
                          item.completed
                            ? "border-emerald-500/20 bg-emerald-500/10"
                            : "border-amber-500/20 bg-amber-500/10"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={
                            item.completed
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium">{item.title}</p>

                        <p className="mt-1 text-sm leading-5 text-zinc-600">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {item.completed ? (
                      <CheckCircle2
                        size={21}
                        className="shrink-0 text-emerald-400"
                      />
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-zinc-500 hover:text-white"
                      >
                        Setup
                        <ChevronRight
                          size={15}
                          className="ml-1"
                        />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* =================================================
            TWO COLUMN SECTION
        ================================================== */}

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          {/* =================================================
              AUTHENTICATION METHODS
          ================================================== */}

          <section>
            <div className="mb-5">
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
                AUTHENTICATION
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Authentication methods
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Manage the ways you sign in to AuthSphere.
              </p>
            </div>

            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardContent className="p-0">
                {authenticationMethods.map((method, index) => {
                  const Icon = method.icon;

                  return (
                    <React.Fragment key={method.title}>
                      <div className="flex items-center justify-between gap-4 p-5">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                            <Icon
                              size={20}
                              className="text-zinc-300"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {method.title}
                              </p>

                              {method.active && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              )}
                            </div>

                            <p className="mt-1 text-sm text-zinc-600">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <Badge
                            variant="outline"
                            className={
                              method.active
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                                : "border-white/10 text-zinc-600"
                            }
                          >
                            {method.status}
                          </Badge>

                          <ChevronRight
                            size={17}
                            className="text-zinc-700"
                          />
                        </div>
                      </div>

                      {index <
                        authenticationMethods.length - 1 && (
                        <Separator className="bg-white/[0.06]" />
                      )}
                    </React.Fragment>
                  );
                })}
              </CardContent>
            </Card>
          </section>

          {/* =================================================
              SECURITY CONTROLS
          ================================================== */}

          <section>
            <div className="mb-5">
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
                IMPORTANT
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Security controls
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Configure additional protection for your account.
              </p>
            </div>

            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardContent className="p-0">
                {/* 2FA */}

                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 gap-4">
                    <div className="shrink-0 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3">
                      <Fingerprint
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        Two-factor authentication
                      </p>

                      <p className="mt-1 max-w-xs text-sm leading-5 text-zinc-600">
                        Require a second verification step during login.
                      </p>
                    </div>
                  </div>

                  <Switch />
                </div>

                <Separator className="bg-white/[0.06]" />

                {/* Login notifications */}

                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 gap-4">
                    <div className="shrink-0 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                      <Eye size={20} className="text-blue-400" />
                    </div>

                    <div>
                      <p className="font-medium">
                        Login notifications
                      </p>

                      <p className="mt-1 max-w-xs text-sm leading-5 text-zinc-600">
                        Receive alerts when a new login is detected.
                      </p>
                    </div>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator className="bg-white/[0.06]" />

                {/* Suspicious Login */}

                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 gap-4">
                    <div className="shrink-0 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                      <Zap size={20} className="text-cyan-400" />
                    </div>

                    <div>
                      <p className="font-medium">
                        Suspicious login detection
                      </p>

                      <p className="mt-1 max-w-xs text-sm leading-5 text-zinc-600">
                        Automatically detect unusual authentication
                        activity.
                      </p>
                    </div>
                  </div>

                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* =================================================
            ACTIVE SESSIONS
        ================================================== */}

        <section className="mt-12">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
                SESSION MANAGEMENT
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Active sessions
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Review devices that currently have access to your
                account.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="border-red-500/20 bg-red-500/[0.04] text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={16} className="mr-2" />
              Sign out all
            </Button>
          </div>

          <div className="grid gap-3">
            {sessions.map((session) => {
              const Icon = session.icon;

              return (
                <Card
                  key={session.device}
                  className="border-white/[0.07] bg-white/[0.02]"
                >
                  <CardContent className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                        <Icon
                          size={20}
                          className="text-zinc-300"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">
                            {session.device}
                          </p>

                          {session.current && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
                              Current
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                          <span>{session.browser}</span>

                          <span>•</span>

                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {session.location}
                          </span>

                          <span>•</span>

                          <span>{session.ip}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 md:justify-end">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Clock3 size={13} />
                        {session.time}
                      </div>

                      {!session.current && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* =================================================
            SECURITY ACTIVITY
        ================================================== */}

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
              AUDIT TRAIL
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Security activity
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Recent authentication and account security events.
            </p>
          </div>

          <Card className="border-white/[0.07] bg-white/[0.02]">
            <CardContent className="p-0">
              {securityActivity.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <React.Fragment key={activity.title}>
                    <div className="flex gap-4 p-5">
                      <div
                        className={`mt-0.5 shrink-0 rounded-xl border p-3 ${
                          activity.type === "success"
                            ? "border-emerald-500/20 bg-emerald-500/10"
                            : "border-amber-500/20 bg-amber-500/10"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            activity.type === "success"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                          <p className="font-medium">
                            {activity.title}
                          </p>

                          <span className="text-xs text-zinc-700">
                            {activity.time}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-zinc-600">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    {index < securityActivity.length - 1 && (
                      <Separator className="bg-white/[0.06]" />
                    )}
                  </React.Fragment>
                );
              })}
            </CardContent>
          </Card>
        </section>

        {/* =================================================
            SECURITY ARCHITECTURE
        ================================================== */}

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-600">
              AUTHSPHERE INFRASTRUCTURE
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Security architecture
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Core components protecting your authentication
              environment.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {securityArchitecture.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14]"
                >
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
                      <Icon
                        size={20}
                        className="text-zinc-400"
                      />
                    </div>

                    <p className="mt-5 font-medium">{item.title}</p>

                    <p className="mt-1 text-sm text-zinc-600">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                      <CircleCheck size={13} />
                      Protected
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* =================================================
            DANGER ZONE
        ================================================== */}

        <section className="mt-12 pb-16">
          <Card className="border-red-500/15 bg-red-500/[0.025]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <AlertTriangle
                    size={20}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <CardTitle className="text-red-300">
                    Danger zone
                  </CardTitle>

                  <CardDescription className="mt-1 text-red-400/50">
                    These actions can permanently affect your account.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="font-medium">
                    Delete authentication account
                  </p>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-600">
                    Permanently remove your AuthSphere account, sessions,
                    authentication providers and associated data.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete account
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="border-white/10 bg-[#090909] text-white">
                    <DialogHeader>
                      <DialogTitle>
                        Delete your AuthSphere account?
                      </DialogTitle>

                      <DialogDescription className="text-zinc-500">
                        This action cannot be undone. All authentication
                        data and active sessions will be permanently
                        removed.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 bg-transparent text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Permanently delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default SecurityPage;