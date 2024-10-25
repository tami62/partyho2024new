import { cn } from "@/src/lib/utils";
import Image from "next/image";
import React, { useLayoutEffect, useState } from "react";

interface ImagePreviewProsp {
  image: File;
  selected: boolean;
  onClick: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProsp> = ({
  image,
  selected,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState("");

  useLayoutEffect(() => {
    let imageBlobUrl: string | undefined;
    if (image) {
      imageBlobUrl = URL.createObjectURL(image);
      setImgSrc(imageBlobUrl);
    }

    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [image]);

  const handleOnClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className={cn(
        "relative w-full aspect-square",
        selected && "ring-2 ring-offset-2 ring-black"
      )}
    >
      <Image
        fill
        src={imgSrc}
        alt="Image"
        className="object-cover cursor-pointer"
      />
    </div>
  );
};
