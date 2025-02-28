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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", formDataOne.title);
      formData.append("description", formDataOne.description);
      formData.append("summary", formDataOne.summary);
      formData.append("length", formDataOne.length);
      formData.append("buying_price", formDataOne.buying_price);
      formData.append("date_published", formDataOne.date_published);

      // Add files
      if (formDataOne.poster.length > 0) {
        formData.append("poster", formDataOne.poster[0]);
      }

      if (formDataOne.audio_sample.length > 0) {
        formData.append("audio_sample", formDataOne.audio_sample[0]);
      }

      // Add JSON arrays for related entities
      formData.append("categories", JSON.stringify(formDataOne.categories));
      formData.append("collections", JSON.stringify(formDataOne.collections));
      formData.append("authors", JSON.stringify(formDataOne.authors));
      formData.append("narrators", JSON.stringify(formDataOne.narrators));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-audiobook/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notifications.show({
        message: "Audiobook metadata uploaded successfully!",
        color: "green",
      });

      if (response.status === 201) {
        const audiobookId = response.data.id;
        if (formDataTwo.chapters.length > 0) {
          const chaptersFormData = new FormData();
          chaptersFormData.append("audiobook_id", audiobookId.toString());

          formDataTwo.chapters.forEach((chapter, index) => {
            chaptersFormData.append("title", chapter.title);
            chaptersFormData.append("order", (index + 1).toString());

            if (chapter.audio_file instanceof File) {
              chaptersFormData.append("audio_file", chapter.audio_file);
            } else {
              console.log("Chapter audio file is not a file");
            }
          });

          try {
            const chaptersResponse = await axios.post(
              "http://127.0.0.1:8000/api/create-chapters/",
              chaptersFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (chaptersResponse.status === 201) {
              notifications.show({
                message: "Audiobook and chapters uploaded successfully!",
                color: "green",
              });

              close();
              // router.push(`/audiobooks/${audiobookId}`);
            }
          } catch (error: any) {
            console.error("Error uploading chapters:", error);
            notifications.show({
              message: "Error uploading chapters. Please try again.",
              color: "red",
            });
          }
        } else {
          notifications.show({
            message: "Audiobook created without chapters.",
            color: "yellow",
          });
          close();
        }
      }
    } catch (error: any) {
      console.error("Error uploading audiobook:", error);
      notifications.show({
        message:
          "Error uploading audiobook. Please check your data and try again.",
        color: "red",
      });

      // Set appropriate error message
      if (error.response && error.response.data) {
        setErrorFormOne(JSON.stringify(error.response.data));
      } else {
        setErrorFormOne("An unknown error occurred.");
      }
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
