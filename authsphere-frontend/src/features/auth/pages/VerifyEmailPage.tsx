import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyEmailToken } from "@/features/auth/services/AuthService";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );

  useEffect(() => {
    if (!token) return;
    verifyEmailToken(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <Card className="w-full max-w-md border-white/10 bg-white/[0.025] text-center backdrop-blur-xl">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            {status === "loading" && (
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            )}
            {status === "error" && (
              <ShieldAlert className="h-7 w-7 text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {status === "loading" && "Please wait while we confirm your token."}
            {status === "success" &&
              "Your email address has been verified. You can now sign in."}
            {status === "error" &&
              "This verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full" onClick={() => navigate("/login")}>
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
