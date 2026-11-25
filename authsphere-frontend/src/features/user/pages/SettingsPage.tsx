import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Globe2,
  KeyRound,
  Lock,
  Palette,
  Save,
  Settings,
  Shield,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useAuth from "@/features/auth/store/authStore";
import {
  changePassword,
  getUserSettings,
  updateProfile,
  updateUserSettings,
} from "@/features/user/services/UserService";
import type { UserSettings } from "@/features/user/models/UserSettings";

export default function SettingsPage() {
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);

  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    securityNotifications: true,
    locationTracking: true,
    loginMonitoring: true,
    automaticTokenRotation: true,
    theme: "dark",
  });

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    getUserSettings()
      .then((data) => setSettings(data))
      .catch(() => {
        // Keep defaults if settings fail to load
      });
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await updateProfile({
        name: name.trim(),
        image: user?.image,
      });
      setUser(updated);
      toast.success("Account information updated.");
    } catch {
      toast.error("Failed to update account information.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || newPassword.length < 8) {
      toast.error("Enter current password and a new password (min 8 chars).");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated successfully.");
    } catch {
      toast.error("Current password is incorrect or update failed.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleToggleSetting = async (key: keyof Omit<UserSettings, "theme">, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      const saved = await updateUserSettings(next);
      setSettings(saved);
      toast.success("Preference saved.");
    } catch {
      setSettings(settings);
      toast.error("Unable to save preference.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400">
              Account
            </span>
          </div>

          <h1 className="text-4xl font-semibold">Settings</h1>

          <p className="mt-3 text-sm text-zinc-500">
            Customize your AuthSphere account and security preferences.
          </p>
        </div>

        {/* PROFILE */}
        <Card className="mb-5 border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription className="text-zinc-500">
              Basic information associated with your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              <Save className="mr-2 h-4 w-4" />
              {savingProfile ? "Saving..." : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        {/* CHANGE PASSWORD */}
        <Card className="mb-5 border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription className="text-zinc-500">
              Update your account password to keep your credentials secure.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <Button onClick={handleChangePassword} disabled={savingPassword}>
              <Lock className="mr-2 h-4 w-4" />
              {savingPassword ? "Updating..." : "Update password"}
            </Button>
          </CardContent>
        </Card>

        {/* PREFERENCES */}
        <Card className="mb-5 border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="flex gap-4">
                <Bell className="mt-1 h-5 w-5 text-cyan-400" />
                <div>
                  <p className="font-medium">Security notifications</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Receive alerts about important account activity.
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

            <div className="flex items-center justify-between py-4">
              <div className="flex gap-4">
                <Globe2 className="mt-1 h-5 w-5 text-violet-400" />
                <div>
                  <p className="font-medium">Location tracking</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Store approximate login location for security events.
                  </p>
                </div>
              </div>

              <Switch
                checked={settings.locationTracking}
                onCheckedChange={(checked) =>
                  handleToggleSetting("locationTracking", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card className="mb-5 border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Security Preferences</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="flex gap-4">
                <Shield className="mt-1 h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium">Login activity monitoring</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Monitor authentication activity from new devices.
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

            <Separator className="bg-white/[0.06]" />

            <div className="flex items-center justify-between py-4">
              <div className="flex gap-4">
                <KeyRound className="mt-1 h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-medium">Automatic token rotation</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Rotate refresh tokens after authentication.
                  </p>
                </div>
              </div>

              <Switch
                checked={settings.automaticTokenRotation}
                onCheckedChange={(checked) =>
                  handleToggleSetting("automaticTokenRotation", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* APPEARANCE */}
        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Palette className="h-5 w-5 text-violet-400" />
              <div>
                <p className="font-medium">Dark interface</p>
                <p className="text-xs text-zinc-500">
                  AuthSphere uses a dark security-focused interface.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
