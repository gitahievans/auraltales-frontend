"use client";

import { useState, useEffect, ChangeEvent, DragEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconUpload, IconPlus, IconX, IconBook } from "@tabler/icons-react";
import { Alert, Modal } from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";

interface Category {
  id: number;
  category_name: string;
  description?: string;
}

interface FormDataType {
  book_title: string;
  author: string;
  description: string;
  price: string;
  duration: string;
  language: string;
  categories: string[];
  is_published: boolean;
  cover_image: File | null;
  audio_file: File | null;
  sample_audio?: File | null;
}

interface Language {
  value: string;
  label: string;
}

const LANGUAGES: Language[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  // Add more languages as needed
];

const BookUploader = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    book_title: "",
    author: "",
    description: "",
    price: "",
    duration: "",
    language: "",
    categories: [],
    is_published: true,
    cover_image: null,
    audio_file: null,
    sample_audio: null,
  });

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/book-categories/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    fileType: "cover_image" | "audio_file" | "sample_audio"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (fileType === "cover_image" && !file.type.startsWith("image/")) {
      setError("Cover image must be an image file");
      return;
    }

    if (
      (fileType === "audio_file" || fileType === "sample_audio") &&
      !file.type.startsWith("audio/")
    ) {
      setError("Audio files must be in a valid audio format");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fileType]: file,
    }));
    setError(null);
  };

  const handleCategoryChange = (categoryName: string) => {
    setFormData((prev) => {
      const updatedCategories = prev.categories.includes(categoryName)
        ? prev.categories.filter((cat) => cat !== categoryName)
        : [...prev.categories, categoryName];
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.cover_image || !formData.audio_file) {
      setError("Please provide both cover image and audio file.");
      return;
    }
    setUploading(true);
    setError(null);

    try {
      const formPayload = new FormData();

      // Add book information
      formPayload.append("book_title", formData.book_title);
      formPayload.append("author", formData.author);
      formPayload.append("description", formData.description);
      formPayload.append("price", formData.price);
      formPayload.append("duration", formData.duration);
      formPayload.append("language", formData.language);
      formPayload.append("is_published", String(formData.is_published));

      // Add files
      formPayload.append("cover_image", formData.cover_image);
      formPayload.append("audio_file", formData.audio_file);
      if (formData.sample_audio) {
        formPayload.append("sample_audio", formData.sample_audio);
      }

      // Handle categories
      if (formData.categories.length > 0) {
        formPayload.append("categories", JSON.stringify(formData.categories));
      }

      const response = await fetch(`http://127.0.0.1:8000/api/books/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload book");
      }

      close();
      router.push("/dashboard");
      notifications.show({
        title: "Success",
        message: "Book uploaded successfully",
        color: "green",
        autoClose: 5000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error uploading book:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Add New Audiobook
        </h1>
        <h4 className="text-gray-600">
          Upload a new audiobook to your collection
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              name="book_title"
              value={formData.book_title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-transparent border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                Publish Immediately
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Cover Image
            </label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "cover_image")}
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            {formData.cover_image && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(formData.cover_image)}
                  alt="Cover preview"
                  width={100}
                  height={150}
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Audio File
            </label>
            <div className="mt-2">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "audio_file")}
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Sample Audio (Optional)
            </label>
            <div className="mt-2">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "sample_audio")}
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.category_name)}
                  className={`px-3 py-1 rounded-full text-sm 
                  ${
                    formData.categories.includes(category.category_name)
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700"
                  }
                  hover:bg-blue-400 hover:text-white transition-colors`}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>

          {showNewCategoryInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="flex-1 p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleNewCategorySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <IconPlus size={16} />
              <span>Add New Category</span>
            </button>
          )}

          {formData.categories.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <IconX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full flex items-center justify-center space-x-2 p-2 rounded-md text-white
            ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
            transition-colors`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <IconUpload size={20} />
                <span>Upload Book</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookUploader;
