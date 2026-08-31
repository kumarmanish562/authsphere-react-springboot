import {
  Bell,
  Globe2,
  KeyRound,
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

export default function SettingsPage() {
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

          <h1 className="text-4xl font-semibold">
            Settings
          </h1>

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
                  defaultValue="Manish Kumar"
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  defaultValue="user@example.com"
                  disabled
                  className="border-white/10 bg-white/[0.03]"
                />
              </div>

            </div>

            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save changes
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
                  <p className="font-medium">
                    Security notifications
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Receive alerts about important account activity.
                  </p>
                </div>
              </div>

              <Switch defaultChecked />

            </div>

            <Separator className="bg-white/[0.06]" />

            <div className="flex items-center justify-between py-4">

              <div className="flex gap-4">
                <Globe2 className="mt-1 h-5 w-5 text-violet-400" />

                <div>
                  <p className="font-medium">
                    Location tracking
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Store approximate login location for security events.
                  </p>
                </div>
              </div>

              <Switch defaultChecked />

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
                  <p className="font-medium">
                    Login activity monitoring
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Monitor authentication activity from new devices.
                  </p>
                </div>
              </div>

              <Switch defaultChecked />

            </div>

            <Separator className="bg-white/[0.06]" />

            <div className="flex items-center justify-between py-4">

              <div className="flex gap-4">
                <KeyRound className="mt-1 h-5 w-5 text-amber-400" />

                <div>
                  <p className="font-medium">
                    Automatic token rotation
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Rotate refresh tokens after authentication.
                  </p>
                </div>
              </div>

              <Switch defaultChecked />

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
                <p className="font-medium">
                  Dark interface
                </p>

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