"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
} from "@mantine/core";
import { Edit, Save, X } from "lucide-react";
import { notifications } from "@mantine/notifications";
import apiClient from "@/lib/apiClient";

interface Audiobook {
  id: number;
  title: string;
  description: string;
  poster: string;
  buying_price: number;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  audiobooks: Audiobook[];
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories");
  return response.data.categories;
};

const updateCategory = async (id: number, data: { name: string }) => {
  try {
    await apiClient.put(`/api/categories/${id}/update/`, data);
    notifications.show({
      title: "Success",
      message: "Category updated successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update category",
      color: "red",
    });
    throw error;
  }
};

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load categories",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleEditStart = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
  };

  const handleEditSave = async (categoryId: number) => {
    await updateCategory(categoryId, { name: editName });
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name: editName } : cat
      )
    );
    setEditingCategoryId(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditingCategoryId(null);
    setEditName("");
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Categories Management
      </h1>
      <Accordion
        variant="contained"
        classNames={{
          root: "bg-white shadow-lg rounded-lg",
          item: "border-b border-gray-200",
          control: "hover:bg-gray-50",
          content: "bg-gray-50",
        }}
      >
        {categories.map((category) => (
          <Accordion.Item key={category.id} value={category.id.toString()}>
            <Accordion.Control>
              <div className="flex items-center justify-between w-full">
                {editingCategoryId === category.id ? (
                  <div className="flex items-center gap-2 flex-grow">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Category name"
                    />
                    <Button
                      onClick={() => handleEditSave(category.id)}
                      size="xs"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} />
                    </Button>
                    <Button
                      onClick={handleEditCancel}
                      size="xs"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold text-gray-700">
                      {category.name}
                    </span>
                    <Button
                      onClick={() => handleEditStart(category)}
                      size="xs"
                      variant="subtle"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              {category.audiobooks.length === 0 ? (
                <Text className="text-gray-500 italic">
                  No audiobooks in this category
                </Text>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.audiobooks.map((audiobook) => (
                    <Card
                      key={audiobook.id}
                      shadow="sm"
                      padding="sm"
                      radius="md"
                      withBorder
                      className="w-full max-w-[250px]"
                    >
                      <Card.Section>
                        <Image
                          src={audiobook.poster}
                          alt={audiobook.title}
                          className="object-cover w-full rounded-t-md"
                          fallbackSrc="https://via.placeholder.com/80x80?text=Poster"
                        />
                      </Card.Section>
                      <Group className="mt-1">
                        <Text
                          fw={500}
                          size="xs"
                          className="line-clamp-1"
                          title={audiobook.title}
                        >
                          {audiobook.title}
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        c="dimmed"
                        className="line-clamp-2"
                        title={audiobook.description}
                      >
                        {audiobook.description}
                      </Text>
                      <Badge
                        color="blue"
                        variant="light"
                        size="sm"
                        className="mt-1"
                      >
                        ${audiobook.buying_price.toFixed(2)}
                      </Badge>
                    </Card>
                  ))}
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default CategoriesSection;
