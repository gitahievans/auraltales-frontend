import React, { useCallback, useEffect, useState } from "react";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FormDataOne } from "@/types/types";

const BookPoster = ({ errorFormOne, formDataOne, setFormDataOne }) => {
  // Separate state for preview URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0]; // Take only the first file

      // Create preview URL for the new file
      const newPreviewUrl = URL.createObjectURL(file);

      // Update preview URL
      setPreviewUrl(newPreviewUrl);

      // Update form data with the new file
      setFormDataOne((prev: FormDataOne) => ({
        ...prev,
        poster: [file], // Keep only the latest file
      }));
    },
    [setFormDataOne]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removePoster = useCallback(() => {
    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Reset preview and form data
    setPreviewUrl(null);
    setFormDataOne((prev: FormDataOne) => ({
      ...prev,
      poster: [],
    }));
  }, [previewUrl, setFormDataOne]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Create preview URL when component mounts if there's an existing poster
  useEffect(() => {
    if (formDataOne.poster.length > 0 && !previewUrl) {
      const newPreviewUrl = URL.createObjectURL(formDataOne.poster[0]);
      setPreviewUrl(newPreviewUrl);
    }
  }, [formDataOne.poster, previewUrl]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Book Poster
        </label>
        {!previewUrl ? (
          <div
            {...getRootProps()}
            className={`
              relative 
              border-2 
              border-dashed 
              rounded-lg 
              p-8 
              transition-all 
              duration-200 
              cursor-pointer
              ${
                isDragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }
              ${errorFormOne ? "border-red-500 bg-red-50" : ""}
              hover:border-green-500 
              focus:outline-none 
              focus:ring-2 
              focus:ring-green-500 
              focus:ring-offset-2
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4">
              <IconUpload
                size={52}
                className={`${
                  isDragActive ? "text-green-500" : "text-gray-400"
                }`}
              />

              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag a poster image here or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden group">
            <div className="aspect-w-2 aspect-h-3 relative h-[300px]">
              <Image
                src={previewUrl}
                alt="Book poster"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <button
              type="button"
              onClick={removePoster}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50"
              aria-label="Remove poster"
            >
              <IconX size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {errorFormOne && (
        <p className="text-sm text-red-500 mt-2">
          Please upload a poster image for the book
        </p>
      )}
    </div>
  );
};

export default BookPoster;
