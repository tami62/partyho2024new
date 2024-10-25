"use client";

import { Button } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <Button
      onClick={handleSignOut}
      variation="primary"
      className="bg-orange-400 text-black"
    >
      Sign out
    </Button>
  );
}
