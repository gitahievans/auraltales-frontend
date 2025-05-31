"use client";

import { Audiobook } from "@/types/types";
import { useState } from "react";
import {
  Edit,
  BookOpen,
  FileText,
  Users,
  SquareLibrary,
  TableOfContents,
} from "lucide-react";
import { Button, Modal, Textarea } from "@mantine/core";
interface DetailsModalProps {
  audiobook: Audiobook;
  onClose: () => void;
  updateAudiobook: (id: number, data: Partial<Audiobook>) => Promise<void>;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  audiobook,
  onClose,
  updateAudiobook,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [description, setDescription] = useState(audiobook.description);
  const [summary, setSummary] = useState(audiobook.summary);

  const handleSave = async () => {
    await updateAudiobook(audiobook.id!, { description, summary });
    setIsEditingDescription(false);
    setIsEditingSummary(false);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <BookOpen size={24} />
          {audiobook.title}
        </div>
      }
      size="lg"
      classNames={{
        content: "bg-white rounded-lg shadow-xl",
        header: "border-b border-gray-200 pb-4",
        body: "p-6",
      }}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={20} />
              Description
            </h3>
            <button
              onClick={() => setIsEditingDescription(!isEditingDescription)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingDescription ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={4}
              className="w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          ) : (
            <p className="text-gray-600">
              {description || "No description available"}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={20} />
              Summary
            </h3>
            <button
              onClick={() => setIsEditingSummary(!isEditingSummary)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingSummary ? (
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              minRows={4}
              className="w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter summary"
            />
          ) : (
            <p className="text-gray-600">{summary || "No summary available"}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Users size={20} />
            Narrators
          </h3>
          <p className="text-gray-600">
            {audiobook.narrators.map((n) => n.name).join(", ") ||
              "No narrators listed"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <SquareLibrary size={20} />
            Collections
          </h3>
          <p className="text-gray-600">
            {audiobook.collections.map((c) => c.name).join(", ") ||
              "No collections listed"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <TableOfContents size={20} />
            Chapters
          </h3>
          <ul className="list-disc pl-5 text-gray-600">
            {audiobook.chapters.length > 0 ? (
              audiobook.chapters.map((chapter) => (
                <li key={chapter.id}>
                  {chapter.title} (Order: {chapter.order}, Duration:{" "}
                  {chapter.duration || "N/A"})
                </li>
              ))
            ) : (
              <li>No chapters available</li>
            )}
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            classNames={{
              root: "border-gray-300 text-gray-700 hover:bg-gray-100",
            }}
          >
            Cancel
          </Button>
          {(isEditingDescription || isEditingSummary) && (
            <Button
              onClick={handleSave}
              classNames={{ root: "bg-blue-600 hover:bg-blue-700 text-white" }}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
