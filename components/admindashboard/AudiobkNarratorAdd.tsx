import { Narrator, FormDataOne } from "@/types/types";
import { Button, Textarea, TextInput } from "@mantine/core";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";

export interface AudiobookNarratorAddProps {
  formDataOne: FormDataOne;
  narrators: Narrator[] | null;
  setFormDataOne: React.Dispatch<React.SetStateAction<FormDataOne>>;
}

interface NarratorButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NarratorButton: React.FC<NarratorButtonProps> = ({
  isSelected,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 
    rounded-full 
    text-sm 
    font-medium 
    transition-all 
    duration-200 
    mr-2 mb-2
    ${
      isSelected
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
    }
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:ring-offset-2`}
  >
    {children}
  </button>
);

const AudiobkNarratorAdd: React.FC<AudiobookNarratorAddProps> = ({
  formDataOne,
  narrators,
  setFormDataOne,
}) => {
  const [showNewNarratorForm, setShowNewNarratorForm] =
    useState<boolean>(false);
  const [editingNarrator, setEditingNarrator] = useState<Narrator | null>(null);
  const [newNarrator, setNewNarrator] = useState<Omit<Narrator, "id">>({
    name: "",
    email: "",
    phone_number: "",
    bio: "",
  });

  const handleNewNarratorSubmit = useCallback(() => {
    const trimmedNarratorName = newNarrator.name.trim();

    if (trimmedNarratorName) {
      if (editingNarrator) {
        // Update existing narrator
        setFormDataOne((prev) => ({
          ...prev,
          narrators: prev.narrators.map((narr) => {
            const match =
              editingNarrator.id !== undefined
                ? narr.id === editingNarrator.id
                : narr === editingNarrator;
            return match
              ? {
                  ...narr, // Preserve existing fields like ID
                  name: trimmedNarratorName,
                  email: newNarrator.email.trim(),
                  phone_number: newNarrator.phone_number.trim(),
                  bio: newNarrator.bio.trim(),
                }
              : narr;
          }),
        }));
      } else {
        const newNarratorObj: Narrator = {
          name: trimmedNarratorName,
          email: newNarrator.email.trim(),
          phone_number: newNarrator.phone_number.trim(),
          bio: newNarrator.bio.trim(),
        };
        setFormDataOne((prev) => ({
          ...prev,
          narrators: [...prev.narrators, newNarratorObj],
        }));
      }

      setNewNarrator({
        name: "",
        email: "",
        phone_number: "",
        bio: "",
      });
      setShowNewNarratorForm(false);
      setEditingNarrator(null); // Reset editing narrator on submit
    }
  }, [newNarrator, setFormDataOne, editingNarrator]);

  const handleEditNarrator = useCallback(
    (narratorToEdit: Narrator) => {
      setEditingNarrator(narratorToEdit);
      setNewNarrator({
        name: narratorToEdit.name,
        email: narratorToEdit.email || "",
        phone_number: narratorToEdit.phone_number || "",
        bio: narratorToEdit.bio || "",
      });
      setShowNewNarratorForm(true);
    },
    [setNewNarrator, setShowNewNarratorForm, setEditingNarrator]
  );

  const handleNarratorChange = useCallback(
    (narratorToToggle: Narrator) => {
      setFormDataOne((prev) => {
        const isSelected = prev.narrators.some(
          (narr: Narrator) => narr.id === narratorToToggle.id
        );

        const updatedNarrators = isSelected
          ? prev.narrators.filter(
              (narr: Narrator) => narr.id !== narratorToToggle.id
            )
          : [...prev.narrators, narratorToToggle];

        return { ...prev, narrators: updatedNarrators };
      });
    },
    [setFormDataOne]
  );

  const isNarratorSelected = useCallback(
    (narratorId: number) => {
      return formDataOne.narrators.some((narr) => narr.id === narratorId);
    },
    [formDataOne.narrators]
  );

  return (
    <div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Who are the Narrators of this Audiobook?
        </label>

        <div className="space-y-2">
          {narrators && narrators?.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>Choose from existing narrators here:</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {narrators?.map((narrator: Narrator) => (
              <NarratorButton
                key={narrator.id}
                isSelected={isNarratorSelected(narrator?.id as number)}
                onClick={() => handleNarratorChange(narrator)}
              >
                {narrator.name}
              </NarratorButton>
            ))}
          </div>
        </div>
      </div>
      <p className="ml-2 font-sans">OR</p>

      {showNewNarratorForm ? (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Name"
              required
              value={newNarrator.name}
              onChange={(e) =>
                setNewNarrator((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter narrator name"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "#2563EB",
                  },
                },
              }}
            />
            <TextInput
              label="Email"
              type="email"
              value={newNarrator.email}
              onChange={(e) =>
                setNewNarrator((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter narrator email"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "#2563EB",
                  },
                },
              }}
            />
            <TextInput
              label="Phone Number"
              value={newNarrator.phone_number}
              onChange={(e) =>
                setNewNarrator((prev) => ({
                  ...prev,
                  phone_number: e.target.value,
                }))
              }
              placeholder="Enter phone number"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "#2563EB",
                  },
                },
              }}
            />
            <Textarea
              label="Bio"
              value={newNarrator.bio}
              onChange={(e) =>
                setNewNarrator((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Enter short narrator bio"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "#2563EB",
                  },
                },
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setShowNewNarratorForm(false);
                setNewNarrator({
                  name: "",
                  email: "",
                  phone_number: "",
                  bio: "",
                });
                setEditingNarrator(null); // Reset editing narrator on cancel
              }}
              variant="outline"
              color="gray"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewNarratorSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newNarrator.name.trim()}
            >
              {editingNarrator ? "Update Narrator" : "Add Narrator"}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewNarratorForm(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 mt-4 border border-blue-600 py-1 px-2 rounded-full"
        >
          <IconPlus size={16} strokeWidth={2} />
          <span className="text-sm font-medium">Add New Narrator</span>
        </button>
      )}
      {formDataOne.narrators.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected narrators:</p>
          <div className="flex flex-wrap gap-2">
            {formDataOne.narrators.map((narrator: Narrator) => (
              <span
                key={narrator.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {narrator.name}
                <button
                  type="button"
                  onClick={() => handleEditNarrator(narrator)}
                  className="text-orange-600 hover:text-orange-800 transition-colors ml-2"
                  aria-label={`Edit ${narrator.name} narrator`}
                >
                  <IconEdit size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleNarratorChange(narrator)}
                  className="text-blue-600 hover:text-blue-800 transition-colors ml-1"
                  aria-label={`Remove ${narrator.name} narrator`}
                >
                  <IconX size={14} strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudiobkNarratorAdd;
