import { auth } from "@clerk/nextjs/server";
import { CloudIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <>
    <CloudIcon className="mx-auto mt-16 text-gray-300" size={128} />
      <h1 className="mb-4 text-5xl font-bold md:text-6xl">
        Bald Drive
      </h1>
      <p className="mx-auto mb-8 max-w-md text-xl text-gray-300 md:text-2xl">
        Simple, secure, and hopefully fast file storage for the modern web.
      </p>
      <form
        action={async () => {
          "use server";

          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          return redirect("/drive");
        }}
      >
        <Button
          size="lg"
          type="submit"
          className="bg-white text-black hover:bg-gray-200"
        >
          Get Started
        </Button>
      </form>
      <footer className="mt-16 py-4 text-sm text-neutral-500">
        © {new Date().getFullYear()} Bald Drive. All rights reserved.
      </footer>
    </>
  );
}