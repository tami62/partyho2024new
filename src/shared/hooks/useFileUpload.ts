import { useState } from "react";
import {
  type FileProgressHandler,
  UploadService,
} from "@/src/shared/services/upload";
import { UploadDataWithPathInput } from "aws-amplify/storage";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    path: UploadDataWithPathInput["path"],
    onProgress?: FileProgressHandler
  ) => {
    const filePath = await UploadService.uploadFile(file, path, onProgress);
    return filePath;
  };

  return {
    isUploading,
    setIsUploading,
    uploadFile,
  };
};
