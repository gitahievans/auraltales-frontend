"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
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
  IconSortAscending,
  IconX,
} from "@tabler/icons-react";
import LibraryCard from "@/components/Cards/LibraryCard";
import apiClient from "@/lib/apiClient";
import { AudiobookDetail } from "@/types/types";

interface Author {
  id: number;
  name: string;
}

interface Audiobook {
  id: number;
  title: string;
  authors: Author[];
  audio_sample: string;
  buying_price: number;
  date_published: string;
  poster: string;
  slug: string;
}

interface LibraryBook {
  audiobook: Audiobook;
  date_purchased: string;
}

const MyLibraryPage = () => {
  const { data: session } = useSession();
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

  const filteredBooks = books?.filter(
    (book) =>
      book.audiobook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.audiobook.authors.some((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.date_purchased).getTime() -
          new Date(a.date_purchased).getTime()
        );
      case "title":
        return a.audiobook.title.localeCompare(b.audiobook.title);
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
            }}
          />
        </Grid.Col>
      </Grid>

      {/* Library Display */}
      {session?.user ? (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="#1CFAC4" />
            </div>
          ) : sortedBooks.length > 0 ? (
            <Grid>
              {sortedBooks.map((book) => (
                <Grid.Col
                  key={book.audiobook.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <LibraryCard
                    book={book.audiobook as AudiobookDetail}
                    // purchaseDate={book.date_purchased}
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
          )}
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
          <Text color="#A9A9AA">Please sign in to view your library</Text>
        </div>
      )}
    </Container>
  );
};

export default MyLibraryPage;
