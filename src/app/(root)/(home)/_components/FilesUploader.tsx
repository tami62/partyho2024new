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
  const { uploadFile, isUploading, setIsUploading, identityId } = useFileUpload(); // Assuming identityId is available here
  const [previewFiles, setPreviewFiles] = useState<FileProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // New state for storing uploaded image URLs

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
      await uploadFile(
        file,
        ({ identityId }) => `private/${identityId}/${file.name}`, // Store the image in the identityId folder
        onProgress
      );
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

  // Fetch the uploaded images from the folder associated with the identityId
  const handleGenerateRoll = async () => {
    if (!identityId) {
      console.error("Identity ID not available");
      return;
    }

    try {
      // Fetch image URLs from the specific identityId folder in S3 (replace with actual logic)
      const fetchedImages = await fetchUploadedImagesFromS3(identityId);
      setUploadedImages(fetchedImages); // Update the state with image URLs
    } catch (error) {
      console.error("Error fetching uploaded images:", error);
    }
  };

  // Fetching images from S3 using the identityId folder
  const fetchUploadedImagesFromS3 = async (identityId: string) => {
    try {
      // You'd use AWS SDK or an API to list objects from the specific folder in S3
      // For now, we simulate the image fetching process

      // Simulating the image URLs that would come from the S3 `private/{identityId}` folder
      return [
        `https://your-bucket-name.s3.amazonaws.com/private/${identityId}/image1.jpg`,
        `https://your-bucket-name.s3.amazonaws.com/private/${identityId}/image2.jpg`,
        `https://your-bucket-name.s3.amazonaws.com/private/${identityId}/image3.jpg`,
      ];
    } catch (error) {
      throw new Error("Failed to fetch images from S3.");
    }
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
          >
            Generate Roll
          </button>
        </div>
      </div>

      {/* Display the uploaded images when Generate Roll is clicked */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl mb-4">Generated Roll</h3>
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="border p-2">
                <img
                  src={imageUrl}
                  alt={`Uploaded Image ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
