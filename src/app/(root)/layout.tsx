import { SignOutButton } from "@/src/components/SignOutButton";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-3 w-full overflow-hidden flex justify-between">
        <div />
        <Link href="/movie">Movie</Link>
        <SignOutButton />
      </header>
      {children}
    </>
  );
}
