import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "$amplify/env/partyho-generate-s3-pre-signed-url";
import { Schema } from "../../data/resource";

const s3Client = new S3Client();

export const handler: Schema["generateS3PreSignedUrl"]["functionHandler"] =
  async (event) => {
    const { contentType, key } = event.arguments;
    const command = new PutObjectCommand({
      Bucket: env.PARTYHO_MEDIAS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(s3Client, command);
  };
