import {
  Activity,
  Copy,
  Eye,
  KeyRound,
  Plus,
  ShieldCheck,
  Trash2,
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

const apiKeys = [
  {
    name: "Frontend Application",
    key: "as_live_••••••••••••••7F21",
    created: "Aug 28, 2026",
    status: "Active",
  },
  {
    name: "Development Environment",
    key: "as_test_••••••••••••••9A82",
    created: "Aug 20, 2026",
    status: "Active",
  },
];

export default function ApiAccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-400" />

            <span className="text-xs uppercase tracking-[0.25em] text-violet-400">
              Developer Security
            </span>
          </div>

          <h1 className="text-4xl font-semibold">
            API Access
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Create and manage credentials used to communicate
            with the AuthSphere API.
          </p>

        </div>

        <Card className="mb-6 border-violet-400/20 bg-violet-400/[0.04]">

          <CardContent className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/10">
                <KeyRound className="h-6 w-6 text-violet-400" />
              </div>

              <div>

                <h3 className="font-semibold">
                  Protect your API keys
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Never expose secret API credentials in client-side
                  applications or public repositories.
                </p>

              </div>

            </div>

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create key
            </Button>

          </CardContent>

        </Card>

        <Card className="border-white/[0.08] bg-white/[0.025]">

          <CardHeader>
            <CardTitle>API Keys</CardTitle>

            <CardDescription className="text-zinc-500">
              Credentials authorized to access AuthSphere services.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">

            {apiKeys.map((apiKey, index) => (

              <div key={apiKey.name}>

                {index > 0 && (
                  <Separator className="bg-white/[0.06]" />
                )}

                <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">

                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                      <KeyRound className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>

                      <h3 className="font-medium">
                        {apiKey.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                        <code>{apiKey.key}</code>

                        <button className="hover:text-white">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-zinc-600">
                        Created {apiKey.created}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <Badge className="bg-emerald-400/10 text-emerald-400">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {apiKey.status}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 hover:bg-white/5 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 hover:bg-red-400/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>

                </div>

              </div>

            ))}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}