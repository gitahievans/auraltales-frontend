import { Collection, FormDataOne } from "@/types/types";
import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";

export interface AudiobookCollectionAddProps {
  formDataOne: FormDataOne;
  collections: Collection[] | null;
  setFormDataOne: (data: FormDataOne) => void;
}

interface CollectionButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CollectionButton: React.FC<CollectionButtonProps> = ({
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
        ? "bg-green-600 text-white hover:bg-green-700"
        : "bg-green-100 text-green-700 hover:bg-green-200"
    }
    focus:outline-none 
    focus:ring-2 
    focus:ring-green-500 
    focus:ring-offset-2
  `}
  >
    {children}
  </button>
);

const AudiobkCollectionAdd: React.FC<AudiobookCollectionAddProps> = ({
  formDataOne,
  collections,
  setFormDataOne,
}) => {
  const [showNewCollectionInput, setShowNewCollectionInput] =
    useState<boolean>(false);
  const [newCollection, setNewCollection] = useState("");

  const handleNewCollectionSubmit = useCallback(() => {
    const trimmedCollection = newCollection.trim();

    if (trimmedCollection) {
      const newCollectionObj: Collection = {
        name: trimmedCollection,
      };

      setFormDataOne((prev) => ({
        ...prev,
        collections: [...prev.collections, newCollectionObj],
      }));

      setNewCollection("");
      setShowNewCollectionInput(false);
    }
  }, [newCollection, setFormDataOne]);

  const handleCollectionChange = useCallback(
    (collectionToToggle: Collection) => {
      setFormDataOne((prev) => {
        const isSelected = prev.collections.some(
          (col: Collection) => col.id === collectionToToggle.id
        );

        const updatedCollections = isSelected
          ? prev.collections.filter(
              (col: Collection) => col.id !== collectionToToggle.id
            )
          : [...prev.collections, collectionToToggle];

        return { ...prev, collections: updatedCollections };
      });
    },
    [setFormDataOne]
  );

  const isCollectionSelected = useCallback(
    (collectionId: number) => {
      return formDataOne.collections.some((col) => col.id === collectionId);
    },
    [formDataOne.collections]
  );

  return (
    <div>
      {" "}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          What Collections does this Audiobook belong to?
        </label>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Choose from existing collections:
          </p>
          <div className="flex flex-wrap gap-2">
            {collections?.map((collection: Collection) => (
              <CollectionButton
                key={collection.id}
                isSelected={isCollectionSelected(collection?.id)}
                onClick={() => handleCollectionChange(collection)}
              >
                {collection.name}
              </CollectionButton>
            ))}
          </div>
        </div>
      </div>
      {showNewCollectionInput ? (
        <div className="flex gap-2">
          <TextInput
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
            placeholder="Enter new Collection"
            className="flex-1"
            styles={{
              input: {
                "&:focus": {
                  borderColor: "#22C55E",
                },
              },
            }}
          />
          <Button
            onClick={handleNewCollectionSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Add
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewCollectionInput(true)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          <IconPlus size={16} strokeWidth={2} />
          <span className="text-sm font-medium">Add New Collection</span>
        </button>
      )}
      {formDataOne.collections.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected collections:</p>
          <div className="flex flex-wrap gap-2">
            {formDataOne.collections.map((collection: Collection) => (
              <span
                key={collection.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {collection.name}
                <button
                  type="button"
                  onClick={() => handleCollectionChange(collection)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label={`Remove ${collection.name} collection`}
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

export default AudiobkCollectionAdd;
