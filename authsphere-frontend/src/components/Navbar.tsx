import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 sm:gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/40 text-xs font-bold text-primary-foreground shadow-sm sm:h-9 sm:w-9 sm:text-sm">
            AS
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              AuthSphere
            </span>

            <span className="mt-1 hidden text-[10px] text-muted-foreground sm:block">
              Secure Authentication
            </span>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer px-2 sm:px-3"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            size="sm"
            className="cursor-pointer px-3 sm:px-4"
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;