import React, { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { HiCheck, HiOutlineX } from "react-icons/hi";

interface FileStatusCardProps {
  file: File;
  progress: number;
  onRemove: () => void;
}

export const FileStatusCard: React.FC<FileStatusCardProps> = ({
  file,
  progress,
  onRemove,
}) => {
  const [imagePreview, setImagePreview] = useState("");

  useLayoutEffect(() => {
    let imagePreview = "";
    if (file) {
      imagePreview = URL.createObjectURL(file);
      setImagePreview(imagePreview);
    }
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [file]);

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image fill src={imagePreview} alt="" />
          </div>
          <h4 className="text-sm font-medium truncate w-1/2">{file.name}</h4>
        </div>
        <HiOutlineX className="cursor-pointer" onClick={onRemove} />
      </div>
      <div className="mt-3">
        {progress >= 100 ? (
          <div className="flex text-green-500 text-sm items-center gap-1">
            <HiCheck />
            <span>Uploaded</span>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">{progress}%</p>
        )}
      </div>
    </div>
  );
};
