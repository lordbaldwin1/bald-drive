export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <main className="text-center">{props.children}</main>
    </div>
  );
}