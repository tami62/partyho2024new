import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import {
  generateServerClientUsingCookies,
  generateServerClientUsingReqRes,
} from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import amplifyConfig from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const reqResBasedClient = generateServerClientUsingReqRes({
  config: amplifyConfig,
});

export const cookieBasedClient = generateServerClientUsingCookies({
  config: amplifyConfig,
  cookies,
});
