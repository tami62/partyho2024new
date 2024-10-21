import { SignOutButton } from "./components/SignOutButton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-3 w-full overflow-hidden flex justify-end">
        <SignOutButton />
      </header>
      {children}
    </>
  );
}
