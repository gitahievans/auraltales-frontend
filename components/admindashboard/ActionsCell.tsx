"use client";

import { Audiobook } from "@/types/types";
import { Info, Trash2 } from "lucide-react";
import { useState } from "react";
import { DetailsModal } from "./DetailsModal";

interface ActionsCellProps {
  audiobook: Audiobook;
  deleteAudiobook: (id: number) => Promise<void>;
  updateAudiobook: (id: number, data: Partial<Audiobook>) => Promise<void>;
}
export const ActionsCell: React.FC<ActionsCellProps> = ({
  audiobook,
  deleteAudiobook,
  updateAudiobook,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => deleteAudiobook(audiobook.id!)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Info size={20} />
      </button>
      {isModalOpen && (
        <DetailsModal
          audiobook={audiobook}
          onClose={() => setIsModalOpen(false)}
          updateAudiobook={updateAudiobook}
        />
      )}
    </div>
  );
};
