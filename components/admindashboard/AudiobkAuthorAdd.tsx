import { Author, FormDataOne } from "@/types/types";
import { Button, Textarea, TextInput } from "@mantine/core";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";

export interface AudiobookAuthorAddProps {
  formDataOne: FormDataOne;
  authors: Author[] | null;
  setFormDataOne: React.Dispatch<React.SetStateAction<FormDataOne>>;
}

interface AuthorButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AuthorButton: React.FC<AuthorButtonProps> = ({
  isSelected,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
    px-4 py-2 
    rounded-full 
    text-sm 
    font-medium 
    transition-all 
    duration-200 
    mr-2 mb-2
    ${
      isSelected
        ? "bg-orange-600 text-white hover:bg-orange-700"
        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
    }
    focus:outline-none 
    focus:ring-2 
    focus:ring-orange-500 
    focus:ring-offset-2
  `}
  >
    {children}
  </button>
);

const AudiobkAuthorAdd: React.FC<AudiobookAuthorAddProps> = ({
  formDataOne,
  authors,
  setFormDataOne,
}) => {
  const [showNewAuthorForm, setShowNewAuthorForm] = useState<boolean>(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [newAuthor, setNewAuthor] = useState<Omit<Author, "id">>({
    name: "",
    email: "",
    phone_number: "",
    bio: "",
  });

  const handleNewAuthorSubmit = useCallback(() => {
    const trimmedAuthorName = newAuthor.name.trim();

    if (trimmedAuthorName) {
      if (editingAuthor) {
        // Update existing author
        setFormDataOne((prev) => ({
          ...prev,
          authors: prev.authors.map((auth) => {
            // If editingAuthor has an ID, match by ID.
            // Otherwise, match by object reference (for newly added authors without an ID).
            const match =
              editingAuthor.id !== undefined
                ? auth.id === editingAuthor.id
                : auth === editingAuthor;
            return match
              ? {
                  ...auth, // Preserve existing fields like ID (if it exists)
                  name: trimmedAuthorName,
                  email: newAuthor.email.trim(),
                  phone_number: newAuthor.phone_number.trim(),
                  bio: newAuthor.bio.trim(),
                }
              : auth;
          }),
        }));
      } else {
        // Add new author (ensure no ID is set here, or handle temporary ID if needed)
        const newAuthorObj: Author = {
          // id: Date.now(), // Example of a temporary ID, if needed for immediate re-edit
          name: trimmedAuthorName,
          email: newAuthor.email.trim(),
          phone_number: newAuthor.phone_number.trim(),
          bio: newAuthor.bio.trim(),
        };
        setFormDataOne((prev) => ({
          ...prev,
          authors: [...prev.authors, newAuthorObj],
        }));
      }

      setNewAuthor({
        name: "",
        email: "",
        phone_number: "",
        bio: "",
      });
      setShowNewAuthorForm(false);
      setEditingAuthor(null); // Reset editing author on submit
    }
  }, [newAuthor, setFormDataOne, formDataOne, editingAuthor]);

  const handleEditAuthor = useCallback(
    (authorToEdit: Author) => {
      setEditingAuthor(authorToEdit);
      setNewAuthor({
        name: authorToEdit.name,
        email: authorToEdit.email || "",
        phone_number: authorToEdit.phone_number || "",
        bio: authorToEdit.bio || "",
      });
      setShowNewAuthorForm(true);
    },
    [setNewAuthor, setShowNewAuthorForm, setEditingAuthor]
  );

  const handleAuthorChange = useCallback(
    (authorToToggle: Author) => {
      setFormDataOne((prev) => {
        const isSelected = prev.authors.some(
          (auth: Author) => auth.id === authorToToggle.id
        );

        const updatedAuthors = isSelected
          ? prev.authors.filter((auth: Author) => auth.id !== authorToToggle.id)
          : [...prev.authors, authorToToggle];

        return { ...prev, authors: updatedAuthors };
      });
    },
    [setFormDataOne]
  );

  const isAuthorSelected = useCallback(
    (authorId: number) => {
      return formDataOne.authors.some((auth) => auth.id === authorId);
    },
    [formDataOne.authors]
  );

  return (
    <div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Who are the Authors of this Audiobook?
        </label>

        <div className="space-y-2">
          {authors && authors?.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>Choose from existing authors here:</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {authors?.map((author: Author) => (
              <AuthorButton
                key={author.id}
                isSelected={isAuthorSelected(author?.id as number)}
                onClick={() => handleAuthorChange(author)}
              >
                {author.name}
              </AuthorButton>
            ))}
          </div>
        </div>
      </div>
      <p className="ml-2 font-sans">OR</p>
      {showNewAuthorForm ? (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Name"
              required
              value={newAuthor.name}
              onChange={(e) =>
                setNewAuthor((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter author name"
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
              value={newAuthor.email}
              onChange={(e) =>
                setNewAuthor((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter author email"
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
              value={newAuthor.phone_number}
              onChange={(e) =>
                setNewAuthor((prev) => ({
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
              value={newAuthor.bio}
              onChange={(e) =>
                setNewAuthor((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Enter short author bio"
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
                setShowNewAuthorForm(false);
                setNewAuthor({
                  name: "",
                  email: "",
                  phone_number: "",
                  bio: "",
                });
                setEditingAuthor(null); // Reset editing author on cancel
              }}
              variant="outline"
              color="gray"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewAuthorSubmit}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!newAuthor.name.trim()}
            >
              {editingAuthor ? "Update Author" : "Add Author"}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewAuthorForm(true)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors duration-200 mt-4 border border-orange-200 py-1 px-2 rounded-full"
        >
          <IconPlus size={16} strokeWidth={2} />
          <span className="text-sm font-medium">Add New Author</span>
        </button>
      )}
      {formDataOne.authors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected authors:</p>
          <div className="flex flex-wrap gap-2">
            {formDataOne.authors.map((author: Author) => (
              <span
                key={author.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                {author.name}
                <button
                  type="button"
                  onClick={() => handleEditAuthor(author)}
                  className="text-blue-600 hover:text-blue-800 transition-colors ml-2"
                  aria-label={`Edit ${author.name} author`}
                >
                  <IconEdit size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthorChange(author)}
                  className="text-orange-600 hover:text-orange-800 transition-colors ml-1"
                  aria-label={`Remove ${author.name} author`}
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

export default AudiobkAuthorAdd;
