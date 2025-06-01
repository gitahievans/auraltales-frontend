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

interface Collection {
  id: number;
  name: string;
  audiobooks: Audiobook[];
}

const fetchCollections = async (): Promise<Collection[]> => {
  const response = await apiClient.get("/api/collections");
  return response.data.collections;
};

const updateCollection = async (id: number, data: { name: string }) => {
  try {
    await apiClient.put(`/api/collections/${id}/update/`, data);
    notifications.show({
      title: "Success",
      message: "Collection updated successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update collection",
      color: "red",
    });
    throw error;
  }
};

const CollectionsSection: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(
    null
  );
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load collections",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  const handleEditStart = (collection: Collection) => {
    setEditingCollectionId(collection.id);
    setEditName(collection.name);
  };

  const handleEditSave = async (collectionId: number) => {
    await updateCollection(collectionId, { name: editName });
    setCollections(
      collections.map((col) =>
        col.id === collectionId ? { ...col, name: editName } : col
      )
    );
    setEditingCollectionId(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditingCollectionId(null);
    setEditName("");
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Collections Management
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
        {collections.map((collection) => (
          <Accordion.Item key={collection.id} value={collection.id.toString()}>
            <Accordion.Control>
              <div className="flex items-center justify-between w-full">
                {editingCollectionId === collection.id ? (
                  <div className="flex items-center gap-2 flex-grow">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Collection name"
                    />
                    <Button
                      onClick={() => handleEditSave(collection.id)}
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
                      {collection.name}
                    </span>
                    <Button
                      onClick={() => handleEditStart(collection)}
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
              {collection.audiobooks.length === 0 ? (
                <Text className="text-gray-500 italic">
                  No audiobooks in this collection
                </Text>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.audiobooks.map((audiobook) => (
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
                          height={80}
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

export default CollectionsSection;
