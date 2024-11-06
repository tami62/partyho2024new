"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState<string[]>([]);
  const router = useRouter();

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
      const onProgress: FileProgressHandler = ({
        transferredBytes,
        totalBytes,
      }) => {
        if (totalBytes) {
          const percentCompleted = Math.round(
            (transferredBytes / totalBytes) * 100
          );
          handleUpdateFileProgress(percentCompleted, referenceIndex);
        }
      };
      const result = await uploadFile(
        file,
        ({ identityId }) => `private/${identityId}/${file.name}`,
        onProgress
      );
      if (result?.url) {
        setUploadedFileURLs((prev) => [...prev, result.url]); // Save the URL
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (files.length) {
      setIsUploading(true);
      Promise.allSettled(
        files.map((file, index) => handleFileUpload(file, index))
      ).finally(() => {
        setIsUploading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleOnSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
    const newFiles = event.target.files;
    if (newFiles) {
      const files = Array.from(newFiles);
      const previewFiles = files.map((file) => ({
        file,
        progress: 0,
      }));
      setPreviewFiles(previewFiles);
      setFiles(files);
    }
  };

  const handleRemoveFile = (referenceIndex: number) => () => {
    setPreviewFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles.splice(referenceIndex, 1);
      return updatedFiles;
    });
  };

  const handleGenerateRoll = () => {
    router.push({
      pathname: "/roll-display",
      query: { urls: JSON.stringify(uploadedFileURLs) },
    });
  };

  return (
    <>
      {previewFiles.length ? (
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
      ) : null}
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
            onClick={handleGenerateRoll}
            className="bg-orange-400 text-black p-2 w-full"
            disabled={uploadedFileURLs.length === 0} // Disable if no files are uploaded
          >
            Generate Roll
          </button>
        </div>
      </div>
    </>
  );
};
