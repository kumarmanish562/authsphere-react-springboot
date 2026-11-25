import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Activity,
  Check,
  Copy,
  KeyRound,
  Plus,
  ShieldAlert,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "@/features/apikeys/services/ApiKeyService";
import type { ApiKey } from "@/features/apikeys/models/ApiKey";

export default function ApiAccessPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [keyName, setKeyName] = useState("");
  const [environment, setEnvironment] = useState<"LIVE" | "TEST">("LIVE");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listApiKeys();
      setApiKeys(data);
    } catch {
      toast.error("Failed to load API keys.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    if (!keyName.trim()) {
      toast.error("Please enter a key name.");
      return;
    }

    try {
      setCreating(true);
      const created = await createApiKey({
        name: keyName.trim(),
        environment,
        scopes: "read,write",
      });
      setApiKeys((prev) => [created, ...prev]);
      setCreatedSecret(created.plainTextKey ?? null);
      setKeyName("");
      setDialogOpen(false);
      toast.success("API key created. Copy your secret now!");
    } catch {
      toast.error("Unable to create API key.");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success("API key revoked.");
    } catch {
      toast.error("Unable to revoke API key.");
    }
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Clipboard unavailable.");
    }
  };

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

          <h1 className="text-4xl font-semibold">API Access</h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Create and manage credentials used to communicate with the AuthSphere API.
          </p>
        </div>

        {createdSecret && (
          <Card className="mb-6 border-emerald-500/30 bg-emerald-500/[0.06]">
            <CardContent className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                  <ShieldAlert className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-300">
                    Copy your new secret API key
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    For security reasons, this key will only be shown once. Store it securely.
                  </p>
                  <code className="mt-2 block break-all rounded-lg border border-emerald-500/20 bg-black/40 px-3 py-2 text-xs text-emerald-300">
                    {createdSecret}
                  </code>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  onClick={() => copyText(createdSecret, "new-secret")}
                >
                  {copiedId === "new-secret" ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Copy Secret
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCreatedSecret(null)}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-violet-400/20 bg-violet-400/[0.04]">
          <CardContent className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/10">
                <KeyRound className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <h3 className="font-semibold">Protect your API keys</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Never expose secret API credentials in client-side applications or public repositories.
                </p>
              </div>
            </div>

            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create key
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="border-white/10 bg-[#0d0d0d] text-white">
                <DialogHeader>
                  <DialogTitle>Generate API Key</DialogTitle>
                  <DialogDescription className="text-zinc-500">
                    Create a new secret key for programmatic access.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g. Production Backend"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="border-white/10 bg-white/[0.03]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={environment === "LIVE" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setEnvironment("LIVE")}
                      >
                        Live (as_live_)
                      </Button>
                      <Button
                        type="button"
                        variant={environment === "TEST" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setEnvironment("TEST")}
                      >
                        Test (as_test_)
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? "Generating..." : "Generate Key"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            {loading ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                Loading API keys...
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-500">
                No API keys created yet. Click "Create key" to generate one.
              </div>
            ) : (
              apiKeys.map((apiKey, index) => (
                <div key={apiKey.id}>
                  {index > 0 && <Separator className="bg-white/[0.06]" />}

                  <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <KeyRound className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <Badge
                            variant="outline"
                            className="border-white/10 text-xs text-zinc-400"
                          >
                            {apiKey.environment}
                          </Badge>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                          <code>{apiKey.maskedKey}</code>

                          <button
                            type="button"
                            onClick={() => copyText(apiKey.maskedKey, apiKey.id)}
                            className="hover:text-white"
                          >
                            {copiedId === apiKey.id ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-xs text-zinc-600">
                          Created {format(new Date(apiKey.createdAt), "MMM d, yyyy")} · Scopes: {apiKey.scopes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-400/10 text-emerald-400">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {apiKey.active ? "Active" : "Inactive"}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevoke(apiKey.id)}
                        className="text-zinc-500 hover:bg-red-400/10 hover:text-red-400"
                        title="Revoke key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
