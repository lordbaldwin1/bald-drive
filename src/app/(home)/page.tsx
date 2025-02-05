import { Button } from "~/components/ui/button";
import { CloudIcon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white">
      <div className="space-y-8 text-center">
        <CloudIcon className="mx-auto h-24 w-24 text-gray-300" />
        <h1 className="text-5xl font-bold">Bald Drive</h1>
        <p className="mx-auto max-w-md text-xl text-gray-300">
          Simple, secure, and hopefully fast cloud storage for all your files.
        </p>
        <form action={async () => {
          "use server";
          
          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          return redirect("/drive");

        }}>
          <Button
            size="lg"
            type="submit"
            className="bg-white text-black hover:bg-gray-200"
          >
            Get Started
          </Button>
        </form>
      </div>
    </div>
  );
}
