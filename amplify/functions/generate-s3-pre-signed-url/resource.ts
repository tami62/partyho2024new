import { defineFunction } from "@aws-amplify/backend";

export const partyhoGenerateS3PreSignedUrl = defineFunction({
  name: "partyho-generate-s3-pre-signed-url",
  entry: "./handler.ts",
  runtime: 20,
});
