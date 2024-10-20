import { defineStorage } from "@aws-amplify/backend";
import { partyhoGenerateS3PreSignedUrl } from "../functions/generate-s3-pre-signed-url/resource";

export const storage = defineStorage({
  name: "partyho-medias",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read", "write"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow.resource(partyhoGenerateS3PreSignedUrl).to(["write"]),
    ],
    "protected/{entity_id}/*": [
      allow.authenticated.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "private/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
