import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  Activity,
  Lock,
  RefreshCw,
  Shield,
  ShieldAlert,
  Unlock,
  Users,
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
  getAdminStats,
  getAdminUsers,
  toggleAdminUserStatus,
  unlockAdminUser,
  updateAdminUserRole,
} from "@/features/admin/services/AdminService";
import type { AdminStats } from "@/features/admin/models/Admin";
import type User from "@/features/user/models/User";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, u] = await Promise.all([getAdminStats(), getAdminUsers()]);
      setStats(s);
      setUsers(u);
    } catch {
      toast.error("Admin access required or failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleToggleStatus = async (user: User) => {
    try {
      const updated = await toggleAdminUserStatus(user.id, !user.enabled);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast.success(`User ${updated.enabled ? "enabled" : "disabled"}.`);
    } catch {
      toast.error("Failed to update user status.");
    }
  };

  const handleUnlock = async (userId: string) => {
    try {
      await unlockAdminUser(userId);
      await loadAdminData();
      toast.success("Account unlocked.");
    } catch {
      toast.error("Failed to unlock account.");
    }
  };

  const handleRoleToggle = async (user: User) => {
    const isAdmin = user.roles?.some((r) => r.name === "ROLE_ADMIN");
    const nextRole = isAdmin ? "ROLE_USER" : "ROLE_ADMIN";
    try {
      const updated = await updateAdminUserRole(user.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast.success(`Updated role to ${nextRole}.`);
    } catch {
      toast.error("Failed to update role.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-amber-400">
                Administration
              </span>
            </div>
            <h1 className="text-4xl font-semibold">Admin Console</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Monitor platform metrics, manage user roles, and review system audit logs.
            </p>
          </div>

          <Button
            variant="outline"
            disabled={loading}
            onClick={loadAdminData}
            className="border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Total Users
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {stats?.totalUsers ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Active Sessions
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {stats?.activeSessions ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Locked Accounts
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {stats?.lockedAccounts ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3">
                <Lock className="h-5 w-5 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* USERS */}
        <Card className="mb-8 border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription className="text-zinc-500">
              Manage account status, unlock locked users, and assign roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {users.map((u, i) => {
              const isAdmin = u.roles?.some((r) => r.name === "ROLE_ADMIN");
              return (
                <div key={u.id}>
                  {i > 0 && <Separator className="bg-white/[0.06]" />}
                  <div className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{u.name || "Unnamed User"}</p>
                        <Badge
                          className={
                            isAdmin
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-white/10 text-zinc-300"
                          }
                        >
                          {isAdmin ? "ADMIN" : "USER"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            u.enabled
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-red-500/30 text-red-400"
                          }
                        >
                          {u.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {u.email} · {u.provider}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 bg-white/[0.03]"
                        onClick={() => handleUnlock(u.id)}
                      >
                        <Unlock className="mr-1.5 h-3.5 w-3.5" />
                        Unlock
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 bg-white/[0.03]"
                        onClick={() => handleRoleToggle(u)}
                      >
                        {isAdmin ? "Set USER" : "Set ADMIN"}
                      </Button>
                      <Button
                        size="sm"
                        variant={u.enabled ? "destructive" : "default"}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.enabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AUDIT LOGS */}
        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Recent System Audit Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(stats?.recentAuditLogs ?? []).map((log, i) => (
              <div key={log.id}>
                {i > 0 && <Separator className="bg-white/[0.06]" />}
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert
                      className={`h-4 w-4 ${
                        log.status === "SUCCESS" ? "text-emerald-400" : "text-amber-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-zinc-500">
                        {log.description} · {log.ipAddress}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
