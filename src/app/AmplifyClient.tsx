"use client";

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import amplifyConfig from "@/amplify_outputs.json";

Amplify.configure(amplifyConfig, { ssr: true });

export default function AmplifyClientSide({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
