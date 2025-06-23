// types.ts

// components/AudiobookCategoryAdd/types.ts
export interface AudiobookCategoryAddProps {
  formDataOne: FormDataOne;
  categories: Category[] | null;
  setFormDataOne: React.Dispatch<React.SetStateAction<FormDataOne>>;
}

// components/AudiobookCategoryAdd/CategoryButton.tsx
interface CategoryButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
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
          ? "bg-cyan-600 text-white hover:bg-cyan-700"
          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
      }
      focus:outline-none 
      focus:ring-2 
      focus:ring-cyan-500 
      focus:ring-offset-2
    `}
  >
    {children}
  </button>
);

// components/AudiobookCategoryAdd/index.tsx
import { Category, FormDataOne } from "@/types/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import React, { useState, useCallback } from "react";
import { TextInput, Button } from "@mantine/core";

const AudiobookCategoryAdd: React.FC<AudiobookCategoryAddProps> = ({
  formDataOne,
  categories,
  setFormDataOne,
}) => {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleNewCategorySubmit = useCallback(() => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory) {
      // For a new category, don't include an ID
      const newCategoryObj: Category = {
        name: trimmedCategory,
      };

      setFormDataOne((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategoryObj],
      }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  }, [newCategory, setFormDataOne]);

  const handleCategoryChange = useCallback(
    (categoryToToggle: Category) => {
      setFormDataOne((prev) => {
        const isSelected = prev.categories.some(
          (cat) => cat.id === categoryToToggle.id
        );
        const updatedCategories = isSelected
          ? prev.categories.filter(
              (cat: Category) => cat.id !== categoryToToggle.id
            )
          : [...prev.categories, categoryToToggle];
        return { ...prev, categories: updatedCategories };
      });
    },
    [setFormDataOne]
  );

  const isCategorySelected = useCallback(
    (categoryId: number) => {
      return formDataOne.categories.some((cat) => cat.id === categoryId);
    },
    [formDataOne.categories]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          What Categories does this Audiobook belong to?
        </label>

        <div className="space-y-2">
          {categories && categories?.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>Choose from existing categories:</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {categories?.map((category: Category) => (
              <CategoryButton
                key={category.id}
                isSelected={isCategorySelected(category.id as number)}
                onClick={() => handleCategoryChange(category)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </div>
        </div>
      </div>
      <p className="ml-2 font-sans">OR</p>
      {showNewCategoryInput ? (
        <div className="flex gap-2">
          <TextInput
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new Category"
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
            onClick={handleNewCategorySubmit}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Add
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewCategoryInput(true)}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors duration-200 mt-4 border border-cyan-600 py-1 px-2 rounded-full"
        >
          <IconPlus size={16} strokeWidth={2} />
          <span className="text-sm font-medium">Add New Category</span>
        </button>
      )}

      {formDataOne.categories.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {formDataOne.categories.map((category: Category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className="text-cyan-600 hover:text-cyan-800 transition-colors"
                  aria-label={`Remove ${category.name} category`}
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

export default AudiobookCategoryAdd;
