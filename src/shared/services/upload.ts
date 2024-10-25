import {
  TransferProgressEvent,
  uploadData,
  UploadDataWithPathInput,
} from "aws-amplify/storage";

export type FileProgressHandler = (event: TransferProgressEvent) => void;

export const UploadService = {
  uploadFile: async (
    file: File,
    path: UploadDataWithPathInput["path"],
    onProgress?: FileProgressHandler
  ) => {
    const response = await uploadData({
      path,
      data: file,
      options: {
        onProgress,
        ...(file && file.type ? { contentType: file.type } : {}),
      },
    }).result;
    return response;
  },
};
