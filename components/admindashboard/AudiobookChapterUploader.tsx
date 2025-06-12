import React, { useState, useCallback, ChangeEvent, useEffect } from "react";
import {
  Button,
  TextInput,
  Paper,
  Text,
  Group,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { IconPlus, IconTrash, IconFileMusic, IconAlertCircle } from "@tabler/icons-react";
import { Chapter, FormDataTwo } from "@/types/types";
import ChapterPosterUploader from "./ChapterPosterUploader";
import Image from "next/image";

// Define props interface
interface AudiobookChapterUploaderProps {
  formDataTwo: FormDataTwo;
  setFormDataTwo: React.Dispatch<React.SetStateAction<FormDataTwo>>;
  onDirtyStateChange?: (isDirty: boolean) => void; // New prop to track dirty state
}

// Enhanced Chapter type with poster and proper audio_file as File
interface EnhancedChapter extends Omit<Chapter, "id"> {
  id?: number; // Optional ID, assigned by backend after save
  audio_file: File | null; // Changed from string to File | null
  poster_file: File | null;
  poster_preview?: string;
}

const AudiobookChapterUploader: React.FC<AudiobookChapterUploaderProps> = ({
  formDataTwo,
  setFormDataTwo,
  onDirtyStateChange,
}) => {
  const [currentChapter, setCurrentChapter] = useState<
    Omit<EnhancedChapter, "id" | "order">
  >({
    title: "",
    audio_file: null, // Initialize as null
    poster_file: null,
  });
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [posterError, setPosterError] = useState<boolean>(false);

  // Check if the current chapter form has any data (is "dirty")
  const isFormDirty = useCallback(() => {
    return (
      currentChapter.title.trim() !== "" ||
      currentChapter.audio_file !== null ||
      currentChapter.poster_file !== null
    );
  }, [currentChapter]);

  // Notify parent component whenever dirty state changes
  useEffect(() => {
    if (onDirtyStateChange) {
      onDirtyStateChange(isFormDirty());
    }
  }, [isFormDirty, onDirtyStateChange]);

  const clearForm = useCallback(() => {
    setCurrentChapter({
      title: "",
      audio_file: null,
      poster_file: null,
    });
    setAudioFileName("");
    setPosterError(false);
  }, []);

  const handleAddChapter = useCallback(() => {
    if (
      currentChapter.title.trim() &&
      currentChapter.audio_file instanceof File &&
      currentChapter.poster_file instanceof File
    ) {
      const newChapter: EnhancedChapter = {
        title: currentChapter.title.trim(),
        audio_file: currentChapter.audio_file,
        poster_file: currentChapter.poster_file,
        order: formDataTwo.chapters.length + 1,
      };

      setFormDataTwo((prev) => ({
        ...prev,
        chapters: [...prev.chapters, newChapter],
      }));

      // Clear the form
      clearForm();
    } else {
      if (!currentChapter.poster_file) setPosterError(true);
      if (!currentChapter.audio_file) console.warn("Audio file is required");
    }
  }, [currentChapter, formDataTwo.chapters, setFormDataTwo, clearForm]);

  const handleRemoveChapter = useCallback(
    (index: number) => {
      setFormDataTwo((prev) => {
        // Filter out the chapter by index (since id might not exist yet)
        const filteredChapters = prev.chapters.filter((_, i) => i !== index);

        // Re-order the remaining chapters
        const reorderedChapters = filteredChapters.map((ch, i) => ({
          ...ch,
          order: i + 1,
        }));

        return {
          ...prev,
          chapters: reorderedChapters,
        };
      });
    },
    [setFormDataTwo]
  );

  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentChapter((prev) => ({
        ...prev,
        audio_file: file, // Store the File object
      }));
      setAudioFileName(file.name);
    } else {
      setCurrentChapter((prev) => ({
        ...prev,
        audio_file: null,
      }));
      setAudioFileName("");
    }
  };

  const handlePosterChange = (file: File | null) => {
    setCurrentChapter((prev) => ({
      ...prev,
      poster_file: file,
    }));
    if (file) setPosterError(false);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentChapter((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const isAddButtonDisabled = 
    !currentChapter.title.trim() ||
    !currentChapter.audio_file ||
    !currentChapter.poster_file;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Audiobook Chapters
        </h2>
        <Text color="gray" size="sm" className="mb-4">
          Add chapters one by one. The order will be automatically assigned
          based on the sequence of addition.
        </Text>
      </div>

      {/* Warning when form is dirty */}
      {isFormDirty() && (
        <Alert
          color="orange"
          icon={<IconAlertCircle size={16} />}
          title="Unsaved Chapter Data"
          className="mb-4"
        >
          You have unsaved chapter data. Please click &quot;Add Chapter&quot; to save it, or clear the form before submitting the book.
          <div className="mt-2">
            <Button
              size="xs"
              variant="outline"
              color="orange"
              onClick={clearForm}
            >
              Clear Form
            </Button>
          </div>
        </Alert>
      )}

      {/* New Chapter Form */}
      <Paper shadow="xs" p="md" withBorder className="mb-6">
        <div className="space-y-4">
          <TextInput
            label="Chapter Title"
            placeholder="Enter chapter title"
            value={currentChapter.title}
            onChange={handleTitleChange}
            required
          />

          <ChapterPosterUploader
            currentPoster={currentChapter.poster_file}
            onPosterChange={handlePosterChange}
            error={posterError}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Audio File
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                className="hidden"
                id="chapter-audio-input"
              />
              <label
                htmlFor="chapter-audio-input"
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <IconFileMusic size={16} className="text-gray-500" />
                <span>Select audio file</span>
              </label>
              {audioFileName && (
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {audioFileName}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isAddButtonDisabled}
            onClick={handleAddChapter}
            className={`mx-auto border px-4 py-2 border-green-600 rounded-md flex items-center gap-2 hover:bg-green-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-200 disabled:text-green-600`}
          >
            <IconPlus size={16} strokeWidth={2} />
            <span className="text-sm font-medium">
              Add Chapter {formDataTwo.chapters.length + 1}
            </span>
          </button>
        </div>
      </Paper>

      {/* Chapter List */}
      {formDataTwo.chapters.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-700">Added Chapters</h3>
          {formDataTwo.chapters.map((chapter, index) => (
            <Paper
              key={index} // Use index as key since id might not exist yet
              shadow="xs"
              p="md"
              withBorder
              className="flex items-center justify-between"
            >
              <Group>
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full mr-2">
                  {chapter.order}
                </div>
                {chapter.poster_file && (
                  <div className="relative w-12 h-12 mr-2 rounded-md overflow-hidden">
                    <Image
                      src={URL.createObjectURL(chapter.poster_file)}
                      alt={`Cover for ${chapter.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Text fw={500}>{chapter.title}</Text>
                  <Text
                    size="xs"
                    color="dimmed"
                    className="flex items-center gap-1 mt-1"
                  >
                    <IconFileMusic size={14} />
                    {chapter.audio_file?.name || "No audio file"}
                  </Text>
                </div>
              </Group>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => handleRemoveChapter(index)}
                title="Remove chapter"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudiobookChapterUploader;