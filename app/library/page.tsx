"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Tabs,
  TextInput,
  Select,
  Loader,
  Container,
  Text,
  Title,
  Grid,
  ActionIcon,
} from "@mantine/core";
import {
  IconSearch,
  IconBooks,
  IconHistory,
  IconBookmark,
  IconSortAscending,
  IconX,
} from "@tabler/icons-react";
import LibraryCard from "@/components/Cards/LibraryCard";
import apiClient from "@/lib/apiClient";

interface Author {
  name: string;
}

interface Category {
  name: string;
}

interface Chapter {
  title: string;
}

interface Collection {
  name: string;
}

interface Narrator {
  name: string;
}

interface Audiobook {
  id: number;
  title: string;
  authors: Author[];
  categories: Category[];
  chapters: Chapter[];
  collections: Collection[];
  narrators: Narrator[];
  audio_sample: string;
  buying_price: number;
  rental_price: number;
  date_published: string;
  description: string;
  length: string;
  poster: string;
  slug: string;
  summary: string;
}

interface LibraryBook {
  audiobook: Audiobook;
  amount: string;
  date_purchased: string;
}

const MyLibraryPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [sortBy, setSortBy] = useState<string | null>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  useEffect(() => {
    const fetchLibrary = async () => {
      if (session?.jwt) {
        try {
          const response = await apiClient.get("/purchases/my-library/", {
            headers: {
              Authorization: `Bearer ${session.jwt}`,
            },
          });
          setBooks(response.data.books);
        } catch (error) {
          console.error("Error fetching library:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLibrary();
  }, [session]);

  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.audiobook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.audiobook.authors.some((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Assuming progress is stored somewhere in the audiobook object
    // You might need to adjust this based on where progress is actually stored
    const progress = book.audiobook.progress || 0;

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in-progress")
      return matchesSearch && progress > 0 && progress < 100;
    if (activeTab === "completed") return matchesSearch && progress === 100;
    return matchesSearch;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.date_purchased).getTime() -
          new Date(a.date_purchased).getTime()
        );
      case "title":
        return a.audiobook.title.localeCompare(b.audiobook.title);
      case "progress":
        return (b.audiobook?.progress || 0) - (a.audiobook.progress || 0);
      default:
        return 0;
    }
  });

  return (
    <Container size="xl">
      {/* Header Section */}
      <div className="mb-8">
        <Title order={1} style={{ color: "#1CFAC4" }} className="mb-2">
          My Library
        </Title>
        <Text color="#A9A9AA">Your personal collection of audiobooks</Text>
      </div>

      {/* Filters and Search */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 9 }}>
          <TextInput
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            leftSection={<IconSearch size={20} />}
            rightSection={
              searchQuery && (
                <ActionIcon color="green" onClick={() => setSearchQuery("")}>
                  <IconX size={16} />
                </ActionIcon>
              )
            }
            styles={{
              input: {
                backgroundColor: "#041714",
                borderColor: "rgba(28, 250, 196, 0.2)",
                color: "white",
                "&:focus": {
                  borderColor: "#1CFAC4",
                },
              },
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: "recent", label: "Recently Purchased" },
              { value: "title", label: "Title" },
              { value: "progress", label: "Progress" },
            ]}
            leftSection={<IconSortAscending size={20} />}
            styles={{
              input: {
                backgroundColor: "#041714",
                borderColor: "rgba(28, 250, 196, 0.2)",
                color: "white",
                "&:focus": {
                  borderColor: "#1CFAC4",
                },
              },
              dropdown: {
                backgroundColor: "#041714",
                borderColor: "rgba(28, 250, 196, 0.2)",
                color: "white",
              },
              option: {
                "&[data-selected]": {
                  backgroundColor: "#1F8505",
                },
                "&[data-hovered]": {
                  backgroundColor: "#21440F",
                },
              },
            }}
          />
        </Grid.Col>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        mb="xl"
        styles={{
          list: {
            borderBottom: "1px solid rgba(28, 250, 196, 0.2)",
          },
          tab: {
            color: "#A9A9AA",
            "&:hover": {
              color: "#1CFAC4",
            },
            "&[data-active]": {
              color: "#1CFAC4",
              borderColor: "#1CFAC4",
            },
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconBooks size={20} />}>
            All Books
          </Tabs.Tab>
          <Tabs.Tab
            value="in-progress"
            leftSection={<IconBookmark size={20} />}
          >
            In Progress
          </Tabs.Tab>
          <Tabs.Tab value="completed" leftSection={<IconHistory size={20} />}>
            Completed
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {session?.user ? (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="#1CFAC4" />
            </div>
          ) : sortedBooks?.length > 0 ? (
            <Grid>
              {sortedBooks?.map((book) => (
                <Grid.Col
                  key={book.audiobook.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <LibraryCard
                    book={book.audiobook}
                    purchaseDate={book.date_purchased}
                  />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <div className="text-center py-12">
              <IconBooks
                size={48}
                className="mx-auto mb-4"
                style={{ color: "#A9A9AA" }}
              />
              <Title order={3} style={{ color: "#1CFAC4" }} className="mb-2">
                No books found
              </Title>
              <Text color="#A9A9AA">
                {searchQuery
                  ? "No books match your search criteria"
                  : "Your library is empty"}
              </Text>
            </div>
          )}{" "}
        </>
      ) : (
        <div className="text-center py-12">
          <IconBooks
            size={48}
            className="mx-auto mb-4"
            style={{ color: "#A9A9AA" }}
          />
          <Title order={3} style={{ color: "#1CFAC4" }} className="mb-2">
            Not Logged In
          </Title>
          <Text color="#A9A9AA">Please sign in to view your wishlist</Text>
        </div>
      )}
    </Container>
  );
};

export default MyLibraryPage;
