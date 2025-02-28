"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  ActionIcon,
  Container,
  Grid,
  Loader,
  Select,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconSearch,
  IconBooks,
  IconSortAscending,
  IconHeart,
  IconCalendar,
  IconX,
  IconLayoutGridAdd,
  IconShoppingBagHeart,
} from "@tabler/icons-react";
import { Audiobook } from "@/types/types";
import WishlistCard from "@/components/Cards/WishListCard";
import { fetchWishlist } from "@/lib/store";

export type WishlistItem = {
  id: number;
  audiobook: Audiobook;
  added_at: string;
};

const WishListPage = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [sortBy, setSortBy] = useState<string | null>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(
    null
  );

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const items = await fetchWishlist();
        setWishlistItems(items);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.jwt) {
      loadWishlist();
    }
  }, [session?.jwt]);

  const filteredItems = useMemo(() => {
    if (!wishlistItems) return [];

    return wishlistItems.filter(
      (item) =>
        item.audiobook.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.audiobook.authors.some((author) =>
          author.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [wishlistItems, searchQuery]);

  const sortedItems = useMemo(() => {
    if (!filteredItems) return [];

    const items = [...filteredItems];

    switch (sortBy) {
      case "latest":
        return items.sort(
          (a, b) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        );
      case "oldest":
        return items.sort(
          (a, b) =>
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
        );
      case "title_asc":
        return items.sort((a, b) =>
          a.audiobook.title.localeCompare(b.audiobook.title)
        );
      case "title_desc":
        return items.sort((a, b) =>
          b.audiobook.title.localeCompare(a.audiobook.title)
        );
      case "date_published_new":
        return items.sort(
          (a, b) =>
            new Date(b.audiobook.date_published).getTime() -
            new Date(a.audiobook.date_published).getTime()
        );
      case "date_published_old":
        return items.sort(
          (a, b) =>
            new Date(a.audiobook.date_published).getTime() -
            new Date(b.audiobook.date_published).getTime()
        );
      default:
        return items;
    }
  }, [filteredItems, sortBy]);

  return (
    <Container size="xl">
      {/* Header Section */}
      <div className="mb-8">
        <Title order={1} style={{ color: "#1CFAC4" }} className="mb-2">
          My Wishlist
        </Title>
        <Text color="#A9A9AA">Books you want to read in the future</Text>
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
          <Tabs.Tab value="recent" leftSection={<IconCalendar size={20} />}>
            Recently Added
          </Tabs.Tab>
          <Tabs.Tab value="favorites" leftSection={<IconHeart size={20} />}>
            Favorites
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Books Grid */}
      {session?.user ? (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="#1CFAC4" />
            </div>
          ) : sortedItems?.length > 0 ? (
            <Grid>
              {sortedItems?.map((item) => (
                <Grid.Col
                  key={item.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <WishlistCard
                    audiobook={item}
                    setWishlistItems={setWishlistItems}
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
                  : "Your wishlist is empty"}
              </Text>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <IconShoppingBagHeart
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

export default WishListPage;
