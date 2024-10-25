"use client";

import React, { useCallback, useState } from "react";
import { Badge, Button, Input } from "@aws-amplify/ui-react";
import { z } from "zod";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import {
  base64ToFile,
  formatErrorMessage,
  isError,
  isErrorMessage,
} from "@/src/lib/utils";
import { FormErrorHelperMessage } from "@/src/components/FormErrorHelperMessage";
import { HiOutlineX } from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieSchema } from "@/src/lib/validations";
import { GenerateImageService } from "@/src/shared/services/generate-image";
import { ImagePreview } from "./ImagePreview";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useToast } from "@/src/shared/hooks/useToast";
import { useFileUpload } from "@/src/shared/hooks/useFileUpload";

export type MovieFormFields = z.infer<typeof MovieSchema>;

const client = generateClient<Schema>();

export const MovieForm = () => {
  const { uploadFile } = useFileUpload();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<{ image: File; isSelected: boolean }[]>(
    []
  );
  const { displayToast } = useToast();
  const {
    control,
    clearErrors,
    setError,
    trigger,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, touchedFields },
  } = useForm<MovieFormFields>({
    resolver: zodResolver(MovieSchema),
    defaultValues: {
      name: "",
      clues: [],
    },
  });

  const setCustomValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field: keyof MovieFormFields, value: any) => {
      setValue(field, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleClueInputKeyDown =
    (field: ControllerRenderProps<MovieFormFields>) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && field.name === "clues") {
        e.preventDefault();
        const clueInput = e.target as HTMLInputElement;
        const clueValue = clueInput.value.trim();
        if (clueValue !== "") {
          if (!field.value.includes(clueValue as never)) {
            setCustomValue("clues", [...(field.value as string[]), clueValue]);
            clueInput.value = "";
            clearErrors("clues");
          } else {
            return setError("clues", {
              type: "required",
              message: "The duplicate clues are not allowed!",
            });
          }
        } else {
          trigger();
        }
      }
    };

  const handleClueRemove =
    (tag: string, field: ControllerRenderProps<MovieFormFields>) =>
    (event: React.MouseEvent<HTMLOrSVGElement>) => {
      event.stopPropagation();
      const clues = field.value as string[];
      const newClues = clues.filter((t: string) => t !== tag);
      setCustomValue("clues", newClues);
    };

  const handleGenerateImages = async (values: MovieFormFields) => {
    try {
      setIsGenerating(true);
      const promises = values.clues.map(async (clue) => {
        const images = await GenerateImageService.generateImages(
          `${clue}. Don't add letters, words, digits in the images`,
          1
        );
        const image = images[0];
        const fileName = `${values.name}-${clue}.png`;
        const file = base64ToFile(image, fileName);
        return file;
      });
      const images = await Promise.all(promises);
      setImages((prev) => [
        ...prev,
        ...images.map((image) => ({ image, isSelected: false })),
      ]);
    } catch (error) {
      console.error(error);
      displayToast("error", formatErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOnImageChoose = (index: number) => () => {
    const updatedImages = [...images];
    const image = updatedImages[index];
    image.isSelected = !image.isSelected;
    setImages(updatedImages);
  };

  const handleSaveMovie = async () => {
    try {
      const selectedImages = images.filter((image) => image.isSelected);
      if (selectedImages.length === 0) {
        throw new Error("Please select images before saving!");
      }
      setIsSaving(true);
      const promises = selectedImages.map((imageEntry) =>
        uploadFile(
          imageEntry.image,
          ({ identityId }) =>
            `private/movie/${identityId}/${imageEntry.image.name}`
        )
      );
      const uploadedImages = await Promise.all(promises);
      const values = getValues();
      await client.models.Movie.create(
        {
          name: values.name,
          clues: values.clues.join(","),
          images: uploadedImages.map((image) => image.path),
        },
        {
          authMode: "userPool",
        }
      );
      reset();
      setImages([]);
      displayToast("success", "Successfully Saved!");
    } catch (error) {
      console.error(error);
      displayToast("error", formatErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleGenerateImages)}
      className="mt-5 flex flex-col gap-3"
    >
      <div>
        <label htmlFor="name" className="form-label">
          Movie Name
        </label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              placeholder="Movie Name"
              id="name"
              type="text"
              hasError={isError("name", errors, touchedFields)}
              {...field}
            />
          )}
        />

        <FormErrorHelperMessage message={isErrorMessage("name", errors)} />
      </div>

      <div className="flex items-center gap-5">
        <div className="flex-1">
          <label htmlFor="clues" className="form-label">
            Movie Clues
          </label>
          <Controller
            control={control}
            name="clues"
            render={({ field }) => (
              <>
                <Input
                  placeholder="Movie Clues"
                  id="clues"
                  type="text"
                  hasError={isError("clues", errors, touchedFields)}
                  name={field.name}
                  onBlur={field.onBlur}
                  onKeyDown={handleClueInputKeyDown(field)}
                />
                {field.value.length > 0 && (
                  <div className="flex items-center mt-2.5 gap-2.5">
                    {field.value.map((tag) => (
                      <Badge
                        key={tag}
                        className="uppercase !flex !items-center gap-3"
                        size="large"
                      >
                        <span>{tag}</span>
                        <HiOutlineX
                          className="w-5 h-5 cursor-pointer"
                          onClick={handleClueRemove(tag, field)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          />
          <FormErrorHelperMessage message={isErrorMessage("clues", errors)} />
        </div>
        <Button
          isLoading={isGenerating}
          type="submit"
          variation="primary"
          className="bg-orange-400 text-black"
        >
          Generate Images
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageEntry, index) => (
          <ImagePreview
            onClick={handleOnImageChoose(index)}
            key={index}
            image={imageEntry.image}
            selected={imageEntry.isSelected}
          />
        ))}
      </div>
      {images.length ? (
        <div className="flex justify-end">
          <Button
            isLoading={isSaving}
            type="button"
            onClick={handleSaveMovie}
            className="bg-orange-400 text-black"
          >
            Save Movie
          </Button>
        </div>
      ) : null}
    </form>
  );
};
