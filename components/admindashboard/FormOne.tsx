import { Divider, Textarea, TextInput } from "@mantine/core";
import { Calendar, DatePickerInput } from "@mantine/dates";
import React, { ChangeEvent } from "react";
import AudiobkPoster from "./AudiobkPoster";
import AudiobkCategAdd from "./AudiobkCategoryAdd";
import {
  Author,
  Category,
  Collection,
  FormDataOne,
  Narrator,
} from "@/types/types";
import AudiobkCollectionAdd from "./AudiobkCollectionAdd";
import AudiobkAuthorAdd from "./AudiobkAuthorAdd";
import AudiobkNarratorAdd from "./AudiobkNarratorAdd";
import { IconFileMusic } from "@tabler/icons-react";

interface FormOneProps {
  formDataOne: FormDataOne;
  errorFormOne: string | null;
  setFormDataOne: React.Dispatch<React.SetStateAction<FormDataOne>>;
  collections: Category[] | null;
  categories: Collection[] | null;
  authors: Author[] | null;
  narrators: Narrator[] | null;
}

const FormOne: React.FC<FormOneProps> = ({
  formDataOne,
  errorFormOne,
  setFormDataOne,
  collections,
  categories,
  authors,
  narrators,
}) => {
  const [audioFileName, setAudioFileName] = React.useState<string>("");
  const handleInputChange =
    (field: keyof FormDataOne) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormDataOne({ ...formDataOne, [field]: event.target.value });
    };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      setFormDataOne({ ...formDataOne, date_published: dateString });
    }
  };

  const handleAudioSampleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      setFormDataOne({ ...formDataOne, audio_sample: [file] });
    } else {
      setAudioFileName("");
      setFormDataOne({ ...formDataOne, audio_sample: [] });
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-6">
        <AudiobkPoster
          formDataOne={formDataOne}
          errorFormOne={errorFormOne}
          setFormDataOne={setFormDataOne}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Audio File
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioSampleChange}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Title"
            placeholder="Enter audiobook title"
            required
            value={formDataOne?.title}
            onChange={handleInputChange("title")}
            // error={errorFormOne.title}
            classNames={{
              label: "text-sm font-medium text-gray-700 mb-1",
              input:
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
            }}
          />

          <TextInput
            label="Price"
            placeholder="Enter price"
            required
            type="number"
            value={formDataOne.buying_price}
            onChange={handleInputChange("buying_price")}
            // error={errorFormOne.price}
            classNames={{
              label: "text-sm font-medium text-gray-700 mb-1",
              input:
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
            }}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Enter detailed description"
          required
          value={formDataOne.description}
          onChange={handleInputChange("description")}
          // error={errorFormOne.description}
          classNames={{
            label: "text-sm font-medium text-gray-700 mb-1",
            input:
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
          }}
        />

        <Textarea
          label="Summary"
          placeholder="Enter brief summary"
          required
          value={formDataOne.summary}
          onChange={handleInputChange("summary")}
          // error={errorFormOne.summary}
          classNames={{
            label: "text-sm font-medium text-gray-700 mb-1",
            input:
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
          }}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date Published
          </label>
          <DatePickerInput
            placeholder="Pick date"
            maxDate={new Date()}
            value={
              formDataOne.date_published
                ? new Date(formDataOne.date_published)
                : null
            }
            onChange={handleDateChange}
            className="border rounded-md p-4"
          />
        </div>

        <AudiobkCategAdd
          categories={categories}
          formDataOne={formDataOne}
          setFormDataOne={setFormDataOne}
        />
        <Divider size="sm" color="black" />
        <AudiobkCollectionAdd
          collections={collections}
          formDataOne={formDataOne}
          setFormDataOne={setFormDataOne}
        />
        <Divider size="sm" color="black" />
        <AudiobkAuthorAdd
          authors={authors}
          formDataOne={formDataOne}
          setFormDataOne={setFormDataOne}
        />
        <Divider size="sm" color="black" />
        <AudiobkNarratorAdd
          narrators={narrators}
          formDataOne={formDataOne}
          setFormDataOne={setFormDataOne}
        />
      </div>
    </div>
  );
};

export default FormOne;
