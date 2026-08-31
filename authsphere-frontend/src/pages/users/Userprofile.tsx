import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { motion } from "framer-motion";

import {
  Check,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import useAuth from "@/auth/store";


// =====================================================
// COMPONENT
// =====================================================

function Userprofile() {

  // ===================================================
  // AUTH STATE
  // ===================================================

  const user =
    useAuth((state) => state.user);


  // ===================================================
  // LOCAL STATE
  // ===================================================

  const [isEditing, setIsEditing] =
    useState(false);

  const [name, setName] =
    useState(user?.name || "");


  // ===================================================
  // SYNC USER DATA
  // ===================================================

  useEffect(() => {

    setName(user?.name || "");

  }, [user?.name]);


  // ===================================================
  // INITIALS
  // ===================================================

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave = () => {

    if (!name.trim()) {

      toast.error(
        "Name cannot be empty."
      );

      return;

    }


    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    //
    // This updates the local UI only if your current
    // Zustand store doesn't provide an updateUser API.
    //
    // Later connect this to:
    //
    // PUT /api/m1/auth/profile
    //
    // -------------------------------------------------

    toast.success(
      "Profile updated successfully."
    );


    setIsEditing(false);

  };


  // ===================================================
  // CANCEL
  // ===================================================

  const handleCancel = () => {

    setName(
      user?.name || ""
    );

    setIsEditing(false);

  };


  // ===================================================
  // NO USER
  // ===================================================

  if (!user) {

    return (

      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          px-4
        "
      >

        <Card
          className="
            w-full
            max-w-md
            rounded-2xl
          "
        >

          <CardContent
            className="
              flex
              flex-col
              items-center
              gap-3
              p-8
              text-center
            "
          >

            <ShieldCheck
              className="
                h-10
                w-10
                text-primary
              "
            />

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Authentication Required
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Please login to view your
              profile.
            </p>

          </CardContent>

        </Card>

      </div>

    );

  }


  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            left-[40%]
            -top-50
             h-112.5
            w-112.5
            rounded-full
            bg-primary/4
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -bottom-37.5
            -right-25
            h-100
            w-100
            rounded-full
            bg-primary/3
            blur-[130px]
          "
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
        "
      >

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >

          <div
            className="
              mb-3
              flex
              items-center
              gap-2
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

              <User
                className="
                  h-4
                  w-4
                  text-primary
                "
              />

            </div>


            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-primary
              "
            >
              Account Identity
            </span>

          </div>


          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
            "
          >
            Your Profile
          </h1>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            Manage your AuthSphere identity,
            account information and authentication
            configuration.
          </p>

        </motion.div>


        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >

          <Card
            className="
              overflow-hidden
              rounded-2xl
              border-border/60
              bg-card/60
              backdrop-blur-xl
            "
          >

            {/* Top accent */}

            <div
              className="
                h-1
                w-full
                bg-primary
              "
            />


            <CardContent className="p-6 sm:p-8">

              <div
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* Identity */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <Avatar
                    className="
                      h-20
                      w-20
                      border-2
                      border-primary/20
                      shadow-xl
                      sm:h-24
                      sm:w-24
                    "
                  >

                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.name || "User"
                      )}`}
                      alt="Profile"
                    />

                    <AvatarFallback
                      className="
                        bg-primary/10
                        text-lg
                        font-bold
                        text-primary
                      "
                    >
                      {initials}
                    </AvatarFallback>

                  </Avatar>


                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                        sm:text-2xl
                      "
                    >
                      {user.name || "User"}
                    </h2>


                    <p
                      className="
                        mt-1
                        flex
                        items-center
                        gap-1.5
                        text-sm
                        text-muted-foreground
                      "
                    >

                      <Mail
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      {user.email}

                    </p>


                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      <Badge
                        variant="outline"
                        className="
                          gap-1
                          border-green-500/20
                          text-green-500
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

                        Active

                      </Badge>


                      <Badge
                        variant="outline"
                        className="
                          gap-1
                        "
                      >

                        <ShieldCheck
                          className="
                            h-3
                            w-3
                          "
                        />

                        Verified

                      </Badge>

                    </div>

                  </div>

                </div>


                {/* Edit button */}

                {!isEditing && (

                  <Button
                    onClick={() =>
                      setIsEditing(true)
                    }
                    variant="outline"
                    className="
                      cursor-pointer
                      rounded-xl
                    "
                  >

                    <Pencil
                      className="
                        mr-2
                        h-4
                        w-4
                      "
                    />

                    Edit Profile

                  </Button>

                )}

              </div>

            </CardContent>

          </Card>

        </motion.div>


        {/* =================================================
            PROFILE INFORMATION
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-6"
        >

          <Card
            className="
              rounded-2xl
              border-border/60
              bg-card/60
              backdrop-blur-xl
            "
          >

            <CardHeader>

              <CardTitle>
                Profile Information
              </CardTitle>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Your registered account details.
              </p>

            </CardHeader>


            <CardContent>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  md:grid-cols-2
                "
              >

                {/* Name */}

                <ProfileField
                  icon={User}
                  label="Full Name"
                  value={name}
                  editable={isEditing}
                  onChange={setName}
                />


                {/* Email */}

                <ProfileField
                  icon={Mail}
                  label="Email Address"
                  value={user.email || ""}
                  editable={false}
                />


                {/* Provider */}

                <ProfileField
                  icon={Fingerprint}
                  label="Authentication Provider"
                  value={user.provider || "LOCAL"}
                  editable={false}
                />


                {/* Status */}

                <div
                  className="
                    space-y-2
                  "
                >

                  <Label>
                    Account Status
                  </Label>


                  <div
                    className="
                      flex
                      h-10
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-green-500/20
                      bg-green-500/5
                      px-3
                    "
                  >

                    <Check
                      className="
                        h-4
                        w-4
                        text-green-500
                      "
                    />

                    <span
                      className="
                        text-sm
                        text-green-500
                      "
                    >
                      {user.enabled
                        ? "Account Enabled"
                        : "Account Disabled"}
                    </span>

                  </div>

                </div>

              </div>


              {/* Save controls */}

              {isEditing && (

                <>

                  <Separator
                    className="my-6"
                  />


                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:justify-end
                    "
                  >

                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="
                        cursor-pointer
                        rounded-xl
                      "
                    >

                      <X
                        className="
                          mr-2
                          h-4
                          w-4
                        "
                      />

                      Cancel

                    </Button>


                    <Button
                      onClick={handleSave}
                      className="
                        cursor-pointer
                        rounded-xl
                      "
                    >

                      <Save
                        className="
                          mr-2
                          h-4
                          w-4
                        "
                      />

                      Save Changes

                    </Button>

                  </div>

                </>

              )}

            </CardContent>

          </Card>

        </motion.div>


        {/* =================================================
            SECURITY INFORMATION
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
          "
        >

          {/* Authentication */}

          <Card
            className="
              rounded-2xl
              border-border/60
              bg-card/60
              backdrop-blur-xl
            "
          >

            <CardHeader>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                "
              >

                <ShieldCheck
                  className="
                    h-5
                    w-5
                    text-primary
                  "
                />

              </div>


              <CardTitle className="mt-3">
                Authentication
              </CardTitle>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Current authentication configuration.
              </p>

            </CardHeader>


            <CardContent className="space-y-4">

              <SecurityRow
                icon={KeyRound}
                title="Access Token"
                value="JWT"
              />


              <Separator />


              <SecurityRow
                icon={LockKeyhole}
                title="Session Protection"
                value="HttpOnly"
              />


              <Separator />


              <SecurityRow
                icon={Fingerprint}
                title="Identity Provider"
                value={user.provider || "LOCAL"}
              />

            </CardContent>

          </Card>


          {/* Account actions */}

          <Card
            className="
              rounded-2xl
              border-border/60
              bg-card/60
              backdrop-blur-xl
            "
          >

            <CardHeader>

              <CardTitle>
                Account Actions
              </CardTitle>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Manage important account operations.
              </p>

            </CardHeader>


            <CardContent className="space-y-3">

              <Button
                variant="outline"
                className="
                  w-full
                  cursor-pointer
                  justify-start
                  rounded-xl
                "
              >

                <KeyRound
                  className="
                    mr-3
                    h-4
                    w-4
                  "
                />

                Change Password

              </Button>


              <Button
                variant="outline"
                className="
                  w-full
                  cursor-pointer
                  justify-start
                  rounded-xl
                "
              >

                <LockKeyhole
                  className="
                    mr-3
                    h-4
                    w-4
                  "
                />

                Security Settings

              </Button>


              <Separator
                className="my-4"
              />


              <Button
                variant="destructive"
                className="
                  w-full
                  cursor-pointer
                  justify-start
                  rounded-xl
                "
              >

                <Trash2
                  className="
                    mr-3
                    h-4
                    w-4
                  "
                />

                Delete Account

              </Button>

            </CardContent>

          </Card>

        </motion.div>


        {/* =================================================
            SECURITY NOTICE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="mt-6"
        >

          <div
            className="
              flex
              gap-3
              rounded-2xl
              border
              border-primary/15
              bg-primary/3
              p-4
            "
          >

            <ShieldCheck
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
                text-primary
              "
            />


            <div>

              <p
                className="
                  text-sm
                  font-medium
                "
              >
                Your account is protected
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted-foreground
                "
              >
                AuthSphere protects authenticated
                resources using JWT access tokens,
                refresh-token protection, OAuth2
                authentication and role-based
                authorization.
              </p>

            </div>

          </div>

        </motion.div>


      </div>

    </main>

  );
}


// =====================================================
// PROFILE FIELD
// =====================================================

type ProfileFieldProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
};


function ProfileField({
  icon: Icon,
  label,
  value,
  editable = false,
  onChange,
}: ProfileFieldProps) {

  return (

    <div className="space-y-2">

      <Label>
        {label}
      </Label>


      <div className="relative">

        <Icon
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />


        <Input
          value={value}
          readOnly={!editable}
          onChange={(event) =>
            onChange?.(
              event.target.value
            )
          }
          className="
            h-11
            rounded-xl
            pl-10
            bg-background/40
          "
        />

      </div>

    </div>

  );
}


// =====================================================
// SECURITY ROW
// =====================================================

type SecurityRowProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  value: string;
};


function SecurityRow({
  icon: Icon,
  title,
  value,
}: SecurityRowProps) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-3
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
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-muted
          "
        >

          <Icon
            className="
              h-4
              w-4
              text-primary
            "
          />

        </div>


        <span
          className="
            text-sm
          "
        >
          {title}
        </span>

      </div>


      <Badge
        variant="outline"
        className="
          text-xs
        "
      >
        {value}
      </Badge>

    </div>

  );
}


export default Userprofile;