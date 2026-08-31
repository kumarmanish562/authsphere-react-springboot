import { Button } from "./ui/button";
import { FaChrome, FaGithub } from "react-icons/fa";

function OAuth2Buttons() {

  const baseUrl =
    import.meta.env.VITE_BASE_URL ||
    "http://localhost:8083";

  return (
    <div className="space-y-3">

      {/* Google OAuth */}

      <a
        href={`${baseUrl}/oauth2/authorization/google`}
        className="block"
      >
        <Button
          type="button"
          variant="outline"
          className="
            flex
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-3
            rounded-2xl
          "
        >
          <FaChrome className="h-5 w-5" />

          Continue with Google
        </Button>
      </a>


      {/* GitHub OAuth */}

      <a
        href={`${baseUrl}/oauth2/authorization/github`}
        className="block"
      >
        <Button
          type="button"
          variant="outline"
          className="
            flex
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-3
            rounded-2xl
          "
        >
          <FaGithub className="h-5 w-5" />

          Continue with GitHub
        </Button>
      </a>

    </div>
  );
}

export default OAuth2Buttons;