'use client';

import { Audiobook } from "@/types/types";
import { Edit, Save, X } from "lucide-react";
import { useState } from "react";

interface EditableCellProps {
  value: string | number;
  rowId: number;
  field: keyof Audiobook;
  type?: "text" | "number";
  updateAudiobook: (id: number, data: Partial<Audiobook>) => Promise<void>;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  rowId,
  field,
  type = "text",
  updateAudiobook,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value.toString());

  const handleSave = async () => {
    const updatedValue = type === "number" ? parseFloat(cellValue) : cellValue;
    await updateAudiobook(rowId, { [field]: updatedValue });
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        className="border rounded px-2 py-1 w-full max-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSave}
        className="text-green-600 hover:text-green-800"
      >
        <Save size={20} />
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="text-red-600 hover:text-red-800"
      >
        <X size={20} />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span>{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Edit size={20} />
      </button>
    </div>
  );
};
