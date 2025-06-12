"use client";

import { useState, useEffect, ChangeEvent, DragEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@mantine/core";
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
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [narrators, setNarrators] = useState<Narrator[] | null>(null);
  const [errorFormOne, setErrorFormOne] = useState<string | null>(null);
  const [errorFormTwo, setErrorFormTwo] = useState<string | null>(null);

  // Step-based progress tracking states
  type StepStatus = "idle" | "pending" | "uploading" | "success" | "error";
  const [step1Status, setStep1Status] = useState<StepStatus>("idle");
  const [step2Status, setStep2Status] = useState<StepStatus>("idle");
  const [step1Message, setStep1Message] = useState<string>("");
  const [step2Message, setStep2Message] = useState<string>("");

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/library/stats/`
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

    // Reset statuses at the beginning
    setStep1Status("pending");
    setStep1Message("Preparing to upload metadata...");
    setStep2Status("idle");
    setStep2Message("");
    setErrorFormOne(null);
    setErrorFormTwo(null);

    try {
      // Metadata Upload Phase
      setStep1Status("uploading");
      setStep1Message("Uploading audiobook metadata...");

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-audiobook/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setStep1Status("success");
        setStep1Message("Audiobook metadata uploaded successfully.");
        notifications.show({
          message: "Audiobook metadata uploaded successfully!",
          color: "green",
        });

        const audiobookId = response.data.id;
        if (formDataTwo.chapters.length > 0) {
          setStep2Status("pending");
          setStep2Message("Preparing to upload chapters...");
          // Chapters Upload Phase
          setStep2Status("uploading");
          setStep2Message("Uploading audiobook chapters...");

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
              `${process.env.NEXT_PUBLIC_API_URL}/api/create-chapters/`,
              chaptersFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (chaptersResponse.status === 201) {
              setStep2Status("success");
              setStep2Message("Audiobook chapters uploaded successfully!");
              notifications.show({
                message: "Audiobook and chapters uploaded successfully!",
                color: "green",
              });

              close();
              router.refresh();
            }
          } catch (error: any) {
            setStep2Status("error");
            setStep2Message(
              `Error: ${
                error.response?.data?.detail ||
                error.message ||
                "Chapter upload failed."
              }`
            );
            console.error("Error uploading chapters:", error);
            notifications.show({
              message: "Error uploading chapters. Please try again.",
              color: "red",
            });
          }
        } else {
          setStep2Status("success"); // Mark step 2 as success as there's nothing to upload
          setStep2Message("No chapters to upload.");
          notifications.show({
            message: "Audiobook created without chapters.",
            color: "yellow",
          });
          close();
        }
      }
    } catch (error: any) {
      setStep1Status("error");
      setStep1Message(
        `Error: ${
          error.response?.data?.detail ||
          error.message ||
          "Metadata upload failed."
        }`
      );
      setStep2Status("idle"); // Or 'error' to indicate process stopped if preferred
      setStep2Message("");
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

  const isUploading =
    step1Status === "uploading" || step2Status === "uploading";

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
          isUploading={isUploading}
          step1Status={step1Status}
          step1Message={step1Message}
          step2Status={step2Status}
          step2Message={step2Message}
        />
      </form>
    </Modal>
  );
};

export default BookUploader;
