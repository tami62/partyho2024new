"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function SignIn() {
  const router = useRouter();
  const { authStatus, user } = useAuthenticator();

  useEffect(() => {
    if (authStatus === "authenticated" && user) {
      router.replace("/");
    }
  }, [authStatus, user, router]);

  return (
    <main className="relative w-full h-full flex flex-grow justify-center items-center p-9">
      <Authenticator />
    </main>
  );
}

export default SignIn;
