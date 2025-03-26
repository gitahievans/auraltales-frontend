import React, { use, useCallback, useEffect, useState } from "react";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface ChapterPosterUploaderProps {
  currentPoster: File | null;
  onPosterChange: (file: File | null) => void;
  error?: boolean;
}

const ChapterPosterUploader: React.FC<ChapterPosterUploaderProps> = ({
  currentPoster,
  onPosterChange,
  error = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPoster) {
      setPreviewUrl(null);
    }
  }, [currentPoster]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);

      setPreviewUrl(newPreviewUrl);

      onPosterChange(file);
    },
    [onPosterChange, previewUrl]
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

    // Reset preview and notify parent
    setPreviewUrl(null);
    onPosterChange(null);
  }, [previewUrl, onPosterChange]);

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
    if (currentPoster && !previewUrl) {
      const newPreviewUrl = URL.createObjectURL(currentPoster);
      setPreviewUrl(newPreviewUrl);
    }
  }, [currentPoster, previewUrl]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chapter Cover Image
        </label>
        {!previewUrl ? (
          <div
            {...getRootProps()}
            className={`
              relative 
              border-2 
              border-dashed 
              rounded-lg 
              p-6 
              transition-all 
              duration-200 
              cursor-pointer
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${error ? "border-red-500 bg-red-50" : ""}
              hover:border-blue-500 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500 
              focus:ring-offset-2
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-3">
              <IconUpload
                size={40}
                className={`${
                  isDragActive ? "text-blue-500" : "text-gray-400"
                }`}
              />

              <div className="text-center space-y-1">
                <p className="text-base font-medium text-gray-700">
                  Drag a cover image here or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPG, PNG, WEBP (max 2MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden group">
            <div className="aspect-w-16 aspect-h-9 relative h-[180px]">
              <Image
                src={previewUrl}
                alt="Chapter cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <button
              type="button"
              onClick={removePoster}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50"
              aria-label="Remove cover image"
            >
              <IconX size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">
          Please upload a cover image for this chapter
        </p>
      )}
    </div>
  );
};

export default ChapterPosterUploader;
