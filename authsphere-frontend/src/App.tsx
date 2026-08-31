import { Button } from "@/components/ui/button";
import { Calendar } from "./components/ui/calendar";



function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>
        Login with Google
      </Button>
      <Calendar/>
          </div>
  );
}

export default App;