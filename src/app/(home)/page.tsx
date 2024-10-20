"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import axios from "axios";
import { FileStatusCard } from "./components/FileStatusCard";
import amplifyConfig from "@/amplify_outputs.json";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";

interface FileProps {
  file: File;
  progress: number;
  error?: string;
  isUploaded?: boolean;
  path?: string;
}

Amplify.configure(amplifyConfig, { ssr: true });

const client = generateClient<Schema>();

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<FileProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);

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
      const response = await client.queries.generateS3PreSignedUrl({
        contentType: file.type,
        key: `public/${file.name}`,
      });
      const uploadUrl = response.data as string;
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          handleUpdateFileProgress(percentCompleted, referenceIndex);
        },
      });
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
        isUploaded: false,
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

  return (
    <main className="flex flex-col max-w-4xl mx-auto p-4">
      <h1 className="mt-14 text-3xl font-medium">Gen Roll Create</h1>
      <p className="mt-5 text-neutral-500 font-medium">
        Simply upload the pictures of the Guests of Honor and let Gen AI create
        a reel for you to play at the party. For example, you can let this roll
        play when kids are saying Are you one, Are you two synchronized -
      </p>
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
          <button className="bg-orange-400 text-black p-2 w-full">
            Generate Roll
          </button>
        </div>
      </div>
    </main>
  );
}
