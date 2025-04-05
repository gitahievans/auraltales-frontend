"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  IconHeart,
  IconSortAscending,
  IconBooks,
  IconX,
  IconCalendar,
} from "@tabler/icons-react";
import { fetchFavorites } from "@/lib/store";
import { Audiobook } from "@/types/types";
import FavoriteCard from "@/components/Cards/FavoritesCard";
import { useValidSession } from "@/hooks/useValidSession";

export type FavoriteItem = {
  id: number;
  audiobook: Audiobook;
  added_at: string;
};

const MyFavoritesPage = () => {
  const { isAuthenticated, session, status } = useValidSession();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [activeTab, setActiveTab] = useState<string | null>("all");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const items = await fetchFavorites(session?.jwt);
        setFavoriteItems(items);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.jwt) {
      loadFavorites();
    }
  }, [session?.jwt]);

  const filteredItems = useMemo(() => {
    if (!favoriteItems) return null;

    // First apply search filter
    const searchFiltered = favoriteItems.filter(
      (item) =>
        item.audiobook.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.audiobook.authors.some((author) =>
          author.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Then apply sorting
    return [...searchFiltered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );
        case "title_asc":
          return a.audiobook.title.localeCompare(b.audiobook.title);
        case "title_desc":
          return b.audiobook.title.localeCompare(a.audiobook.title);
        case "date_published_new":
          return (
            new Date(b.audiobook.date_published).getTime() -
            new Date(a.audiobook.date_published).getTime()
          );
        case "date_published_old":
          return (
            new Date(a.audiobook.date_published).getTime() -
            new Date(b.audiobook.date_published).getTime()
          );
        default:
          return 0;
      }
    });
  }, [favoriteItems, searchQuery, sortBy]);

  return (
    <Container size="xl">
      {/* Header Section */}
      <div className="mb-8">
        <Title order={1} style={{ color: "white" }} className="mb-2">
          My Favorites
        </Title>
        <Text color="#A9A9AA">Your collection of favorite audiobooks</Text>
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
                  borderColor: "white",
                },
              },
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value || "latest")}
            data={[
              { value: "latest", label: "Latest Added" },
              { value: "oldest", label: "Oldest Added" },
              { value: "title_asc", label: "Title (A-Z)" },
              { value: "title_desc", label: "Title (Z-A)" },
              { value: "date_published_new", label: "Newest Release" },
              { value: "date_published_old", label: "Oldest Release" },
            ]}
            leftSection={<IconSortAscending size={20} />}
            styles={{
              input: {
                backgroundColor: "#041714",
                borderColor: "rgba(28, 250, 196, 0.2)",
                color: "white",
                "&:focus": {
                  borderColor: "white",
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
              color: "white",
            },
            "&[data-active]": {
              color: "white",
              borderColor: "white",
            },
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconBooks size={20} />}>
            All Books
          </Tabs.Tab>
          <Tabs.Tab value="recent" leftSection={<IconCalendar size={20} />}>
            Recently Added
          </Tabs.Tab>
          <Tabs.Tab value="favorites" leftSection={<IconHeart size={20} />}>
            Continue
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Content */}
      {session?.user ? (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="white" />
            </div>
          ) : filteredItems?.length ? (
            <Grid>
              {filteredItems.map((item) => (
                <Grid.Col
                  key={item.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <FavoriteCard
                    audiobook={item}
                    setFavoriteItems={setFavoriteItems}
                  />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <div className="text-center py-12">
              <IconHeart
                size={48}
                className="mx-auto mb-4"
                style={{ color: "#A9A9AA" }}
              />
              <Title order={3} style={{ color: "white" }} className="mb-2">
                No favorites found
              </Title>
              <Text color="#A9A9AA">
                {searchQuery
                  ? "No favorites match your search criteria"
                  : "Add books to your favorites to start your collection"}
              </Text>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <IconHeart
            size={48}
            className="mx-auto mb-4"
            style={{ color: "#A9A9AA" }}
          />
          <Title order={3} style={{ color: "white" }} className="mb-2">
            Not Logged In
          </Title>
          <Text color="#A9A9AA">Please sign in to view your favorites</Text>
        </div>
      )}
    </Container>
  );
};

export default MyFavoritesPage;
