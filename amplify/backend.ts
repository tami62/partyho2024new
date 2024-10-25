import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const s3Bucket = backend.storage.resources.bucket;

const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;

cfnBucket.corsConfiguration = {
  corsRules: [
    {
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.PUT,
        s3.HttpMethods.HEAD,
        s3.HttpMethods.POST,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: ["*"],
      allowedHeaders: [
        "Authorization",
        "x-amz-date",
        "x-amz-content-sha256",
        "content-type",
      ],
      exposedHeaders: [
        "x-amz-server-side-encryption",
        "x-amz-request-id",
        "x-amz-id-2",
        "ETag",
        "Location",
      ],
      maxAge: 3000,
    },
  ],
};

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
