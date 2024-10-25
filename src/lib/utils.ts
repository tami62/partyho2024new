import { get, FieldErrors } from "react-hook-form";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isErrorMessage = (field: string, errors: FieldErrors): string =>
  get(errors, `${field}.message`);

export const isError = (
  field: string,
  errors: FieldErrors,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touchFields: Partial<Readonly<Record<string, any>>>
): boolean => get(touchFields, field) && Boolean(isErrorMessage(field, errors));

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function base64ToFile(base64String: string, filename: string) {
  // Convert Base64 to binary
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the binary data
  const blob = new Blob([byteArray], { type: "image/png" });

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: "image/png" });

  return file;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatErrorMessage = (error: any) => {
  let errorMsg = "Something went wrong!. Please try again";
  if ("errors" in error && Array.isArray(error["errors"])) {
    const obj = error.errors[0];
    if (obj.errorType === "Unauthorized") {
      errorMsg = "You are not authorized to access this.";
    }
    if (obj.errorType === "DynamoDB:ConditionalCheckFailedException") {
      errorMsg = "Duplication error. Please add unique facilities.";
    } else {
      errorMsg = obj.message;
    }
  }
  // if (error instanceof AxiosError) {
  //   errorMsg = error.response?.data.message;
  //   return errorMsg;
  // }

  if (!window.navigator.onLine || error?.message?.includes("NetworkOffline")) {
    errorMsg = "Please check your internet connection first";
  }

  if (error instanceof Error) {
    errorMsg = error.message;
  }

  return errorMsg;
};
