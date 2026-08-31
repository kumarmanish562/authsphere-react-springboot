import {
  Activity,
  Code2,
  Gauge,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useState } from "react";
import type { ComponentType } from "react";

import {
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import useAuth from "@/auth/store";


// =====================================================
// USER LAYOUT
// =====================================================

function Userlayout() {
  const checkLogin = useAuth(
    (state) => state.checkLogin
  );

  const user = useAuth(
    (state) => state.user
  );

  const logout = useAuth(
    (state) => state.logout
  );

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);


  // ===================================================
  // PROTECTED ROUTE
  // ===================================================

  if (!checkLogin()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };


  return (
    <div
      className="
        relative
        flex
        min-h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >

      {/* =================================================
          FUTURISTIC BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >

        {/* Top glow */}

        <div
          className="
            absolute
            left-[35%]
            -top-50
            h-125
            w-125
            rounded-full
            bg-primary/4
            blur-[150px]
          "
        />


        {/* Bottom glow */}

        <div
          className="
            absolute
            -bottom-50
            -right-25
            h-112.5
            w-112.5
            rounded-full
            bg-primary/3
            blur-[140px]
          "
        />

      </div>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-border/50
          bg-background/95
          backdrop-blur-2xl
          transition-transform
          duration-300
          lg:static
          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-border/50
            px-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-primary-foreground
                shadow-lg
              "
            >

              <ShieldCheck
                className="h-5 w-5"
              />

            </div>


            <div>

              <p
                className="
                  text-sm
                  font-bold
                  tracking-tight
                "
              >
                AuthSphere
              </p>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-muted-foreground
                "
              >
                Security Platform
              </p>

            </div>

          </div>


          {/* Mobile close */}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() =>
              setMobileOpen(false)
            }
          >

            <X
              className="h-4 w-4"
            />

          </Button>

        </div>


        {/* =================================================
            USER CARD
        ================================================= */}

        <div className="p-4">

          <div
            className="
              rounded-2xl
              border
              border-border/50
              bg-card/50
              p-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                "
              >

                <User
                  className="
                    h-5
                    w-5
                    text-primary
                  "
                />

              </div>


              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                  "
                >
                  {user?.name ||
                    "Authenticated User"}
                </p>


                <p
                  className="
                    truncate
                    text-xs
                    text-muted-foreground
                  "
                >
                  {user?.email ||
                    "Secure account"}
                </p>

              </div>

            </div>


            {/* Session */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                rounded-lg
                bg-green-500/5
                px-2.5
                py-1.5
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-green-500
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  text-green-500
                "
              >
                SESSION ACTIVE
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4
          "
        >

          {/* Workspace */}

          <p
            className="
              mb-2
              px-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            Workspace
          </p>


          <nav className="space-y-1">

            <SidebarLink
              to="/dashboard"
              icon={LayoutDashboard}
              label="Overview"
              end
              onClick={() =>
                setMobileOpen(false)
              }
            />


            <SidebarLink
              to="/dashboard/profile"
              icon={User}
              label="Profile"
              onClick={() =>
                setMobileOpen(false)
              }
            />

          </nav>


          {/* Security */}

          <p
            className="
              mb-2
              mt-7
              px-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            Security
          </p>


          <nav className="space-y-1">

            <SidebarLink
              to="/dashboard/security"
              icon={Shield}
              label="Security"
              onClick={() =>
                setMobileOpen(false)
              }
            />


            <SidebarLink
              to="/dashboard/sessions"
              icon={Activity}
              label="Sessions"
              onClick={() =>
                setMobileOpen(false)
              }
            />


            <SidebarLink
              to="/dashboard/api"
              icon={Code2}
              label="API Access"
              onClick={() =>
                setMobileOpen(false)
              }
            />

          </nav>


          {/* Account */}

          <p
            className="
              mb-2
              mt-7
              px-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            Account
          </p>


          <nav className="space-y-1">

            <SidebarLink
              to="/dashboard/settings"
              icon={Settings}
              label="Settings"
              onClick={() =>
                setMobileOpen(false)
              }
            />


            <SidebarLink
              to="/dashboard/about"
              icon={Info}
              label="About AuthSphere"
              onClick={() =>
                setMobileOpen(false)
              }
            />

          </nav>


          {/* =================================================
              SECURITY STATUS CARD
          ================================================= */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-primary/15
              bg-primary/3
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                "
              >

                <ShieldCheck
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />

              </div>


              <Badge
                variant="outline"
                className="
                  border-green-500/20
                  text-[9px]
                  text-green-500
                "
              >
                SECURE
              </Badge>

            </div>


            <p
              className="
                mt-3
                text-xs
                font-semibold
              "
            >
              Security status
            </p>


            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-muted-foreground
              "
            >
              Your authentication session
              is currently protected.
            </p>

          </div>

        </div>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div className="p-4">

          <Separator
            className="mb-4"
          />


          <Button
            variant="ghost"
            onClick={handleLogout}
            className="
              w-full
              cursor-pointer
              justify-start
              gap-3
              rounded-xl
              text-muted-foreground
              hover:text-destructive
            "
          >

            <LogOut
              className="h-4 w-4"
            />

            Sign out

          </Button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section
        className="
          relative
          flex
          min-w-0
          flex-1
          flex-col
        "
      >

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-16
            items-center
            justify-between
            border-b
            border-border/50
            bg-background/75
            px-4
            backdrop-blur-xl
            sm:px-6
          "
        >

          {/* Left */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* Mobile menu */}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() =>
                setMobileOpen(true)
              }
            >

              <Menu
                className="h-5 w-5"
              />

            </Button>


            <div
              className="
                hidden
                items-center
                gap-2
                sm:flex
              "
            >

              <Gauge
                className="
                  h-4
                  w-4
                  text-primary
                "
              />

              <span
                className="
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                Authentication Dashboard
              </span>

            </div>

          </div>


          {/* Right */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* API STATUS */}

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-border/50
                px-3
                py-1.5
                sm:flex
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-green-500
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  text-muted-foreground
                "
              >
                API ONLINE
              </span>

            </div>


            {/* USER */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-border/50
                bg-card/50
                px-2
                py-1
              "
            >

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                "
              >

                <User
                  className="
                    h-3.5
                    w-3.5
                    text-primary
                  "
                />

              </div>


              <span
                className="
                  hidden
                  max-w-32
                  truncate
                  text-xs
                  font-medium
                  sm:block
                "
              >
                {user?.name || "User"}
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div
          className="
            relative
            flex-1
          "
        >

          <Outlet />

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          className="
            border-t
            border-border/40
            px-4
            py-4
            sm:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-2
              text-[10px]
              text-muted-foreground
              sm:flex-row
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <ShieldCheck
                className="
                  h-3.5
                  w-3.5
                  text-primary
                "
              />

              <span>
                AuthSphere
              </span>

              <span>
                •
              </span>

              <span>
                Secure Authentication Platform
              </span>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <span>
                JWT
              </span>

              <span>
                OAuth2
              </span>

              <span>
                HTTPS
              </span>

            </div>

          </div>

        </footer>

      </section>

    </div>
  );
}


// =====================================================
// SIDEBAR LINK TYPES
// =====================================================

type SidebarLinkProps = {
  to: string;

  label: string;

  icon: ComponentType<{
    className?: string;
  }>;

  end?: boolean;

  onClick?: () => void;
};


// =====================================================
// SIDEBAR LINK COMPONENT
// =====================================================

function SidebarLink({
  to,
  label,
  icon: Icon,
  end,
  onClick,
}: SidebarLinkProps) {

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `
          group
          flex
          items-center
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-sm
          transition-all
          duration-200

          ${
            isActive
              ? `
                bg-primary/10
                font-medium
                text-foreground
                shadow-sm
              `
              : `
                text-muted-foreground
                hover:bg-muted/60
                hover:text-foreground
              `
          }
        `
      }
    >

      {({ isActive }) => (
        <>

          <Icon
            className={`
              h-4
              w-4
              transition-colors

              ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }
            `}
          />


          <span>
            {label}
          </span>


          {isActive && (
            <span
              className="
                ml-auto
                h-1.5
                w-1.5
                rounded-full
                bg-primary
              "
            />
          )}

        </>
      )}

    </NavLink>
  );
}


export default Userlayout;