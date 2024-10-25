"use server";

import { runWithAmplifyServerContext } from "@/src/lib/amplify-utils";
import {
  fetchUserAttributes,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth/server";
import { cookies } from "next/headers";

export async function getCurrentAuthUser() {
  const currentUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });

  return currentUser;
}
export async function getCurrentUserSession() {
  const userSession = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });

  return userSession;
}
export async function getCurrentUserAttributes() {
  const currentUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  return currentUser;
}
