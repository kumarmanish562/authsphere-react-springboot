import { useNavigate } from "react-router";
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function OAuthFailure() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <Card className="w-full max-w-md border-red-500/20 bg-white/[0.025] backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <ShieldAlert className="h-7 w-7 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Authentication Failed
          </CardTitle>
          <CardDescription className="text-zinc-400">
            We couldn&apos;t complete sign-in with your OAuth provider.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-xs text-amber-200/80">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p>
              Please ensure your email address is accessible or try signing in
              again with another method.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OAuthFailure;
