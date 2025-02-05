import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white">
      <div className="space-y-8 text-center">   
        <SignInButton forceRedirectUrl={"/drive"}/>
      </div>
    </div>
  );
}
