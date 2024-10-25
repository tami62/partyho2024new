import { AuthSession, fetchAuthSession } from "aws-amplify/auth";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const GenerateImageService = {
  generateClient: (credentials: AuthSession["credentials"]) => {
    return new BedrockRuntimeClient({
      region: "us-east-1",
      credentials,
    });
  },
  generateImages: async (
    prompt: string,
    numberOfImages: number
  ): Promise<string[]> => {
    const userSession = await fetchAuthSession();
    const bedrockClient = GenerateImageService.generateClient(
      userSession.credentials
    );
    const body = {
      textToImageParams: {
        // text: `${formValues.name} movie with ${clue} clue`,
        text: prompt,
      },
      taskType: "TEXT_IMAGE",
      imageGenerationConfig: {
        width: 1024,
        height: 1024,
        numberOfImages,
      },
    };
    const command = new InvokeModelCommand({
      body: JSON.stringify(body),
      modelId: "amazon.titan-image-generator-v2:0",
      contentType: "application/json",
      accept: "application/json",
    });
    const response = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.images;
  },
};
