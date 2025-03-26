"use client";

import React, { useState } from "react";
import axios from "axios";

const AudiobookForm = () => {
  const [formData, setFormData] = useState({
    poster: null,
    audio_sample: null,
    audio_file: null,
  });
  const [chapterFiles, setChapterFiles] = useState({});

  const handleChapterFileChange = (e, chapterOrder) => {
    const { files } = e.target;

    setChapterFiles((prev) => ({
      ...prev,
      [chapterOrder]: files[0],
    }));
  };

  const payload = {
    title: "My New Audiobook 3",
    description: "A great audiobook 3",
    summary: "This is a summary 3",
    length: "10 hours",
    buying_price: 1000,
    date_published: "2025-01-01",
    categories: [{ name: "Fiction" }],
    authors: [
      {
        name: "John Doe 3",
        email: "john3@example.com",
        phone_number: "+254765433000",
        bio: "An author",
      },
    ],
    narrators: [
      {
        name: "Jane Doe 3",
        email: "jane3@example.com",
        phone_number: "+254765433000",
        bio: "A narrator",
      },
    ],
    collections: [{ name: "New Releases" }],
    chapters: [
      { title: "Chapter 3", order: 3, audio_file: null }, // Added audio_file field
      { title: "Chapter 4", order: 4, audio_file: null }, // Added audio_file field
    ],
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingAudioFiles = payload.chapters.some(
      (chapter) => !chapterFiles[chapter.order]
    );

    if (missingAudioFiles) {
      alert("Please select audio files for all chapters");
      return;
    }

    const data = new FormData();

    // Handle basic fields
    const simpleFields = [
      "title",
      "description",
      "summary",
      "length",
      "date_published",
      "buying_price",
    ];

    simpleFields.forEach((field) => {
      if (field in payload) {
        data.append(field, payload[field]);
      }
    });

    // Update chapters with audio file information before serializing
    const chaptersWithAudioFiles = payload.chapters.map((chapter) => ({
      ...chapter,
      audio_file: `chapter_audio_file_${chapter.order}`, // Reference to the file field name
    }));

    // Handle JSON fields
    const jsonFields = ["authors", "categories", "narrators", "collections"];
    jsonFields.forEach((field) => {
      if (field in payload) {
        data.append(field, JSON.stringify(payload[field]));
      }
    });

    // Add chapters separately with the audio file references
    data.append("chapters", JSON.stringify(chaptersWithAudioFiles));

    // Handle file uploads
    if (formData.poster) data.append("poster", formData.poster);
    if (formData.audio_sample)
      data.append("audio_sample", formData.audio_sample);

    // Handle chapter audio files
    payload.chapters.forEach((chapter) => {
      const chapterAudioFile = chapterFiles[chapter.order];
      if (chapterAudioFile) {
        data.append(`chapter_audio_file_${chapter.order}`, chapterAudioFile);
      }
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-audiobook/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      alert("Audiobook created successfully!");
    } catch (error) {
      console.error("Error response:", error.response?.data);
      alert(
        `Error: ${JSON.stringify(
          error.response?.data || "Unknown error occurred"
        )}`
      );
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gray-400 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Audiobook</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Poster</label>
            <input
              type="file"
              name="poster"
              className="w-full"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Audio Sample</label>
            <input
              type="file"
              name="audio_sample"
              accept="audio/*"
              className="w-full"
              onChange={handleFileChange}
            />
          </div>

          {payload.chapters.map((chapter) => (
            <div key={chapter.order}>
              <label className="block text-sm font-semibold text-gray-700">
                Chapter {chapter.order} Audio File
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleChapterFileChange(e, chapter.order)}
                  className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          ))}

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AudiobookForm;
