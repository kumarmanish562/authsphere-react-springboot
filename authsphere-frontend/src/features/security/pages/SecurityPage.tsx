import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import useAuth from "@/features/auth/store/authStore";
import {
  getSecurityOverview,
  setupTwoFactor,
  toggleTwoFactor,
  verifyEmail,
  verifyTwoFactor,
} from "@/features/security/services/SecurityService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getActiveSessions,
  revokeOtherSessions,
  revokeSession,
} from "@/features/sessions/services/SessionService";
import {
  deleteOwnAccount,
  getUserSettings,
  updateUserSettings,
} from "@/features/user/services/UserService";
import type { SecurityOverview } from "@/features/security/models/Security";
import type { UserSession } from "@/features/sessions/models/Session";
import type { UserSettings } from "@/features/user/models/UserSettings";

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
} from "@/components/ui/dialog";

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const setUser = useAuth((state) => state.setUser);

  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    securityNotifications: true,
    locationTracking: true,
    loginMonitoring: true,
    automaticTokenRotation: true,
    theme: "dark",
  });
  const [loading, setLoading] = useState(true);
  const [totpModalOpen, setTotpModalOpen] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [verifyingTotp, setVerifyingTotp] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, sess, sett] = await Promise.all([
        getSecurityOverview(),
        getActiveSessions(),
        getUserSettings(),
      ]);
      setOverview(ov);
      setSessions(sess);
      setSettings(sett);
    } catch {
      toast.error("Failed to load security overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTwoFactor = async (enabled: boolean) => {
    if (enabled) {
      try {
        const res = await setupTwoFactor();
        setTotpSecret(res.secret);
        setTotpUri(res.otpAuthUri);
        setTotpCode("");
        setTotpModalOpen(true);
      } catch {
        toast.error("Failed to initialize 2FA setup.");
      }
      return;
    }

    try {
      const updatedUser = await toggleTwoFactor(false);
      setUser(updatedUser);
      await loadData();
      toast.success("Two-factor authentication disabled.");
    } catch {
      toast.error("Failed to disable two-factor authentication.");
    }
  };

  const handleVerifyTotp = async () => {
    if (!totpCode.trim() || totpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    try {
      setVerifyingTotp(true);
      const res = await verifyTwoFactor(totpCode.trim());
      setUser(res.user);
      setBackupCodes(res.backupCodes);
      await loadData();
      toast.success("Two-factor authentication verified and enabled!");
    } catch {
      toast.error("Invalid 6-digit verification code.");
    } finally {
      setVerifyingTotp(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const updatedUser = await verifyEmail();
      setUser(updatedUser);
      await loadData();
      toast.success("Email verified successfully.");
    } catch {
      toast.error("Failed to verify email.");
    }
  };

  const handleToggleSetting = async (
    key: keyof Omit<UserSettings, "theme">,
    value: boolean
  ) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await updateUserSettings(next);
      toast.success("Security control updated.");
    } catch {
      setSettings(settings);
      toast.error("Failed to update security control.");
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session revoked.");
    } catch {
      toast.error("Failed to revoke session.");
    }
  };

  const handleRevokeAllOther = async () => {
    try {
      await revokeOtherSessions();
      setSessions((prev) => prev.filter((s) => s.current));
      toast.success("All other sessions signed out.");
    } catch {
      toast.error("Failed to sign out other sessions.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteOwnAccount();
      await logout(true);
      toast.success("Account permanently deleted.");
      navigate("/");
    } catch {
      toast.error("Failed to delete account.");
    }
  };

  const securityScore = overview?.securityScore ?? 0;

  const requirementIconMap: Record<string, React.ElementType> = {
    email_verified: MailCheck,
    strong_password: KeyRound,
    two_factor: Smartphone,
    no_suspicious_activity: RefreshCw,
  };

  const securityRequirements = (overview?.requirements ?? []).map((r) => ({
    ...r,
    icon: requirementIconMap[r.key] ?? ShieldCheck,
  }));

  const methodIconMap: Record<string, React.ElementType> = {
    password: Lock,
    google: Globe,
    github: Code2,
  };

  const authenticationMethods = (overview?.authMethods ?? []).map((m) => ({
    ...m,
    icon: methodIconMap[m.key] ?? Fingerprint,
  }));

  const securityActivity = (overview?.recentActivity ?? []).map((a) => ({
    id: a.id,
    title: a.action.replace(/_/g, " "),
    description: `${a.description} (${a.ipAddress})`,
    time: formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }),
    icon: a.status === "SUCCESS" ? CheckCircle2 : AlertTriangle,
    type: a.status === "SUCCESS" ? "success" : "warning",
  }));

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
                disabled={loading}
                onClick={loadData}
                className="border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white"
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
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
                  <p className="text-2xl font-semibold">
                    {authenticationMethods.filter((m) => m.active).length}
                  </p>

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
                  <p className="text-2xl font-semibold">{sessions.length}</p>

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
                        onClick={() => {
                          if (item.key === "two_factor") handleToggleTwoFactor(true);
                          else if (item.key === "email_verified") handleVerifyEmail();
                        }}
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

                  <Switch
                    checked={overview?.twoFactorEnabled ?? false}
                    onCheckedChange={handleToggleTwoFactor}
                  />
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

                  <Switch
                    checked={settings.securityNotifications}
                    onCheckedChange={(checked) =>
                      handleToggleSetting("securityNotifications", checked)
                    }
                  />
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

                  <Switch
                    checked={settings.loginMonitoring}
                    onCheckedChange={(checked) =>
                      handleToggleSetting("loginMonitoring", checked)
                    }
                  />
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
              onClick={handleRevokeAllOther}
              className="border-red-500/20 bg-red-500/[0.04] text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={16} className="mr-2" />
              Sign out all
            </Button>
          </div>

          <div className="grid gap-3">
            {sessions.map((session) => {
              const Icon = session.deviceName.toLowerCase().includes("android") || session.deviceName.toLowerCase().includes("iphone")
                ? Smartphone
                : session.deviceName.toLowerCase().includes("mac")
                ? Laptop
                : Monitor;

              return (
                <Card
                  key={session.id}
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
                            {session.deviceName}
                          </p>

                          {session.current && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
                              Current
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                          <span>{session.browser} · {session.os}</span>

                          <span>•</span>

                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {session.location}
                          </span>

                          <span>•</span>

                          <span>{session.ipAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 md:justify-end">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Clock3 size={13} />
                        {session.current
                          ? "Current session"
                          : formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                      </div>

                      {!session.current && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete account
                </Button>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                        onClick={handleDeleteAccount}
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

      <Dialog open={totpModalOpen} onOpenChange={(open) => {
        setTotpModalOpen(open);
        if (!open) setBackupCodes(null);
      }}>
        <DialogContent className="border-white/10 bg-[#0d0d0d] text-white">
          <DialogHeader>
            <DialogTitle>
              {backupCodes ? "Save Your Backup Recovery Codes" : "Setup Two-Factor Authentication"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {backupCodes
                ? "Store these single-use recovery codes in a safe place. Each code can be used once if you lose your authenticator device."
                : "Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below."}
            </DialogDescription>
          </DialogHeader>

          {backupCodes ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                {backupCodes.map((code) => (
                  <code key={code} className="text-center font-mono text-sm tracking-wider text-amber-300">
                    {code}
                  </code>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(backupCodes.join("\n"));
                    toast.success("Backup codes copied to clipboard.");
                  }}
                >
                  Copy All Codes
                </Button>
                <Button onClick={() => { setTotpModalOpen(false); setBackupCodes(null); }}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 py-2">
                {totpUri && (
                  <div className="rounded-xl bg-white p-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(totpUri)}`}
                      alt="TOTP QR Code"
                      className="h-40 w-40"
                    />
                  </div>
                )}

                <div className="w-full space-y-1 text-center">
                  <p className="text-xs text-zinc-500">Or enter this secret key manually:</p>
                  <code className="block rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs tracking-widest text-cyan-400">
                    {totpSecret}
                  </code>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="totp-code">6-Digit Verification Code</Label>
                  <Input
                    id="totp-code"
                    maxLength={6}
                    placeholder="123456"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    className="border-white/10 bg-white/[0.03] text-center text-lg tracking-widest"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setTotpModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleVerifyTotp} disabled={verifyingTotp}>
                  {verifyingTotp ? "Verifying..." : "Verify & Enable"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityPage;