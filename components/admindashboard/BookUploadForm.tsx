"use client";

import { useState, useEffect, ChangeEvent, DragEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconUpload, IconPlus, IconX, IconBook } from "@tabler/icons-react";
import { Modal, Stepper, TextInput } from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import StepperForm from "./StepperForm";
import {
  Author,
  Category,
  Chapter,
  Collection,
  FormDataOne,
  FormDataTwo,
  Narrator,
} from "@/types/types";

const BookUploader = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [narrators, setNarrators] = useState<Narrator[] | null>(null);
  const [errorFormOne, setErrorFormOne] = useState<string | null>(null);
  const [errorFormTwo, setErrorFormTwo] = useState<string | null>(null);
  const [formDataOne, setFormDataOne] = useState<FormDataOne>({
    poster: [],
    audio_sample: [],
    title: "",
    description: "",
    summary: "",
    length: "",
    buying_price: "",
    date_published: "",
    categories: [],
    authors: [],
    collections: [],
    narrators: [],
  });
  const [formDataTwo, setFormDataTwo] = useState<FormDataTwo>({
    chapters: [],
  });

  const fetchLibStats = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/library/stats/"
      );

      if (response.status !== 200) {
        throw new Error("Lib stats not found");
      }

      // console.log(response.data);
      const data = response.data;

      setCategories(data.categories);
      setCollections(data.collections);
      setAuthors(data.authors);
      setNarrators(data.narrators);
    } catch (error) {
      console.error("Error fetching lib stats", error);
    }
  };

  useEffect(() => {
    fetchLibStats();
  }, []);

  console.log("formDataOne", formDataOne, "formDataTwo", formDataTwo);

  // post the audiobook to the endpoint - http://127.0.0.1:8000/api/create-audiobook/

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Combine form data
    const combinedData = { ...formDataOne, ...formDataTwo };

    console.log("combinedData", combinedData);

    // 2. Create FormData instance
    const formData = new FormData();

    // --- FILE FIELDS (SINGLE FILE) ---
    // Poster (ensure you have only one file in formDataOne.poster)
    if (formDataOne.poster && formDataOne.poster.length > 0) {
      formData.append("poster", formDataOne.poster[0]);
    }

    // Audio Sample (ensure you have only one file in formDataOne.audio_sample)
    if (formDataOne.audio_sample && formDataOne.audio_sample.length > 0) {
      formData.append("audio_sample", formDataOne.audio_sample[0]);
    }

    // --- SIMPLE TEXT FIELDS ---
    formData.append("title", formDataOne.title);
    formData.append("description", formDataOne.description);
    formData.append("summary", formDataOne.summary);
    formData.append("length", formDataOne.length);
    formData.append("buying_price", formDataOne.buying_price);
    formData.append("date_published", formDataOne.date_published);

    // --- ARRAY FIELDS THAT THE SERIALIZER EXPECTS AS JSON ---
    formData.append("authors", JSON.stringify(formDataOne.authors));
    formData.append("categories", JSON.stringify(formDataOne.categories));
    formData.append("narrators", JSON.stringify(formDataOne.narrators));
    formData.append("collections", JSON.stringify(formDataOne.collections));

    // --- CHAPTERS ---
    // If each chapter might have its own audio file, we do:
    // 1) Append the file to formData with a unique key.
    // 2) In the chapter object, set `audio_file` to that unique key.
    const updatedChapters = formDataTwo.chapters.map((chapter, index) => {
      // If you store the chapter file in `chapter.file`, for example:
      if (chapter.audio_file) {
        // Append the file to FormData
        formData.append(`chapter_${index}_audio_file`, chapter.audio_file);
        // Return the chapter object, but replace the audio_file with the key
        return { ...chapter, audio_file: `chapter_${index}_audio_file` };
      }
      return chapter;
    });

    // Now append the updated chapters array as JSON
    formData.append("chapters", JSON.stringify(updatedChapters));

    // Debugging: Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-audiobook/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success (e.g., notify the user, clear form, etc.)
      console.log("Upload successful", response.data);
      notifications.show({ message: "Audiobook uploaded successfully!" });
    } catch (error: any) {
      console.error("Error uploading audiobook", error);
      notifications.show({
        message: "Error uploading audiobook.",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="xl"
      padding="lg"
      closeOnClickOutside={false}
      title="Add New"
      styles={{
        content: {
          borderRadius: "16px",
          backgroundColor: "#fff",
        },
        header: {
          backgroundColor: "#fff",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            Add New Audiobook
          </h1>
          <h4 className="text-gray-600">
            Upload a new audiobook to your collection
          </h4>
        </div>

        <StepperForm
          handleSubmit={handleSubmit}
          formDataOne={formDataOne}
          formDataTwo={formDataTwo}
          errorFormOne={errorFormOne}
          errorFormTwo={errorFormTwo}
          setFormDataOne={setFormDataOne}
          setFormDataTwo={setFormDataTwo}
          categories={categories}
          collections={collections}
          authors={authors}
          narrators={narrators}
        />
      </form>
    </Modal>
  );
};

export default BookUploader;
