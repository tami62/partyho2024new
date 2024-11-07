"use client";

import React, { useEffect, useState } from "react";
import { FileStatusCard } from "./FileStatusCard";
import { useFileUpload } from "@/src/shared/hooks/useFileUpload";
import type { FileProgressHandler } from "@/src/shared/services/upload";

interface FileProps {
  file: File;
  progress: number;
  error?: string;
  path?: string;
}

export const FilesUploader = () => {
  const { uploadFile, isUploading, setIsUploading } = useFileUpload();
  const [previewFiles, setPreviewFiles] = useState<FileProps[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [showImages, setShowImages] = useState(false);

  const handleUpdateFileProgress = (
    progress: number,
    referenceIndex: number
  ) => {
    setPreviewFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[referenceIndex] = {
        ...updatedFiles[referenceIndex],
        progress,
      };
      return updatedFiles;
    });
  };

  const handleFileUpload = async (file: File, referenceIndex: number) => {
    try {
      const onProgress: FileProgressHandler = ({ transferredBytes, totalBytes }) => {
        if (totalBytes) {
          const percentCompleted = Math.round((transferredBytes / totalBytes) * 100);
          handleUpdateFileProgress(percentCompleted, referenceIndex);
        }
      };

      // Upload the file
      const { path } = await uploadFile(
        file,
        ({ identityId }) => `private/${identityId}/${file.name}`,
        onProgress
      );

      // Add the uploaded file info to the state
      setUploadedFiles((prev) => [...prev, { file, progress: 100, path }]);
    } catch (error) {
      console.error(error);
      handleUpdateFileProgress(-1, referenceIndex);  // Mark error in progress
    }
  };

  const handleFilesUpload = () => {
    setIsUploading(true);
    Promise.all(previewFiles.map((file, index) => handleFileUpload(file.file, index)))
      .finally(() => setIsUploading(false));
  };

  const handleOnSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const previewFiles = newFiles.map((file) => ({ file, progress: 0 }));
    setPreviewFiles(previewFiles);
  };

  const handleRemoveFile = (referenceIndex: number) => () => {
    setPreviewFiles((prev) => prev.filter((_, idx) => idx !== referenceIndex));
  };

  const handleGenerateRoll = () => setShowImages(true);

  return (
    <>
      {previewFiles.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          {previewFiles.map((fileEntry, index) => (
            <FileStatusCard
              key={index}
              file={fileEntry.file}
              progress={fileEntry.progress}
              onRemove={handleRemoveFile(index)}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex flex-col items-end gap-4 w-52">
          <button
            disabled={isUploading}
            className="bg-orange-400 text-black p-2 w-full disabled:opacity-50 disabled:pointer-events-none"
          >
            <label htmlFor="partyho-upload" className="cursor-pointer">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              id="partyho-upload"
              onChange={handleOnSelect}
              multiple
              hidden
            />
          </button>
          <button
            className="bg-orange-400 text-black p-2 w-full"
            onClick={handleGenerateRoll}
          >
            Generate Roll
          </button>
        </div>
      </div>

      {showImages && uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl">Uploaded Files:</h3>
          <ul className="grid grid-cols-3 gap-4">
            {uploadedFiles.map((fileEntry, index) => (
              <li key={index}>
                <img
                  src={fileEntry.path}
                  alt={fileEntry.file.name}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
                <p>{fileEntry.file.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
