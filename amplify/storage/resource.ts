import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "partyho-medias",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read", "write"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "protected/{entity_id}/*": [
      allow.authenticated.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "private/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "private/movie/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
