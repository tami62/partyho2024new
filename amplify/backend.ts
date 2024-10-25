import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const partyhoBedrockStack = backend.createStack("PartyhoBedrockStack");

const bedrockPolicy = new Policy(partyhoBedrockStack, "BedrockPolicy", {
  policyName: "PartyhoBedrockPolicy",
  statements: [
    new PolicyStatement({
      sid: "PartyhoBedrockChatModel",
      resources: ["*"],
      actions: ["bedrock:Invoke*", "bedrock:List*", "bedrock:Retrieve*"],
      effect: Effect.ALLOW,
    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  bedrockPolicy
);
