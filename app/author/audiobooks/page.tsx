"use client";

import apiClient from "@/lib/apiClient";
import { Howl } from "howler";
import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  DollarSign,
  BookText,
  Search,
  SortAsc,
  ArrowUpDown,
  ShoppingCart,
  Headphones,
  BarChart3,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Audiobook } from "@/types/types";
import { listenSample2 } from "@/lib/audiobookActions.ts";

interface AudioBook extends Audiobook {
  id: number;
  slug: string;
  title: string;
  poster: string;
  description: string;
  buying_price: number;
  date_published: string;
  total_sales: number;
  total_revenue: number;
}

const AudiobooksPage = () => {
  const [authorAudiobooks, setAuthorAudiobooks] = React.useState<AudioBook[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [playingAudiobook, setPlayingAudiobook] = useState<number | null>(null);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);

  // Use a Map to store Howl instances for each audiobook
  const [audiobookSounds] = useState<Map<number, Howl>>(new Map());

  const getAuthorAudiobooks = async () => {
    try {
      const response = await apiClient.get("/api/author-audiobooks/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch author audiobooks");
      }

      setAuthorAudiobooks(response.data);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getAuthorAudiobooks();

    // Cleanup function to stop any playing audio when component unmounts
    return () => {
      audiobookSounds.forEach((sound) => {
        if (sound.playing()) {
          sound.stop();
        }
      });
    };
  }, []);

  const getTotalRevenue = () => {
    if (!authorAudiobooks.length) return 0;
    return authorAudiobooks.reduce((acc, book) => acc + book.total_revenue, 0);
  };

  const getTotalSales = () => {
    if (!authorAudiobooks.length) return 0;
    return authorAudiobooks.reduce((acc, book) => acc + book.total_sales, 0);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const filteredBooks = React.useMemo(() => {
    if (!authorAudiobooks.length) return [];

    let filtered = [...authorAudiobooks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy as keyof AudioBook];
        const bValue = b[sortBy as keyof AudioBook];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortAsc
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortAsc ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }, [authorAudiobooks, searchTerm, sortBy, sortAsc]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handlePlayAudioSample = (audiobook: AudioBook) => {
    listenSample2(
      audiobook,
      audiobookSounds,
      playingAudiobook,
      setPlayingAudiobook,
      setAudioSampleLoading
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Audiobooks...
        </p>
      </div>
    );
  }

  if (!authorAudiobooks.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6">
        <BookOpen size={64} className="text-secondary mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">
          No Audiobooks Found
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          You do not have any audiobooks published yet. Contact your
          administrator to upload your audiobooks.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Your Audiobooks
          </h1>
          <p className="text-gray-600">
            Manage and track your published audiobooks
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          <div className="bg-white h-full shadow-md rounded-lg p-4 gap-2 flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <BookText size={20} className="text-secondary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="font-bold text-primary">
                {authorAudiobooks.length}
              </p>
            </div>
          </div>

          <div className="bg-white h-full shadow-md rounded-lg p-4 gap-2 flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <ShoppingCart size={20} className="text-secondary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="font-bold text-primary">{getTotalSales()}</p>
            </div>
          </div>

          <div className="bg-white h-full shadow-md rounded-lg p-4 gap-2 flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <DollarSign size={20} className="text-secondary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="font-bold text-primary">
                {formatCurrency(getTotalRevenue())}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary mb-4 md:mb-0">
            Audiobook Library
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search audiobooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy || ""}
                onChange={(e) => handleSort(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="">Sort by</option>
                <option value="title">Title</option>
                <option value="date_published">Date</option>
                <option value="total_sales">Sales</option>
                <option value="total_revenue">Revenue</option>
              </select>
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => sortBy && setSortAsc(!sortAsc)}
              >
                {sortBy ? (
                  <ArrowUpDown size={18} className="text-gray-400" />
                ) : (
                  <SortAsc size={18} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-200">
                {book.poster ? (
                  <Image
                    src={book.poster}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <BookOpen size={48} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">
                  {book.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {book.description}
                </p>

                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-secondary mr-2" />
                    <span>{formatDate(book.date_published)}</span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign size={16} className="text-secondary mr-2" />
                    <span>{formatCurrency(book.buying_price)}</span>
                  </div>

                  <div className="flex items-center">
                    <ShoppingCart size={16} className="text-secondary mr-2" />
                    <span>{book.total_sales} sales</span>
                  </div>

                  <div className="flex items-center">
                    <BarChart3 size={16} className="text-secondary mr-2" />
                    <span>{formatCurrency(book.total_revenue)}</span>
                  </div>
                </div>
              </div>

              <div className="flex border-t border-gray-200">
                <button
                  onClick={() => handlePlayAudioSample(book)}
                  className="flex-1 flex items-center justify-center py-3 text-secondary font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  {playingAudiobook === book.id ? (
                    <>
                      <X size={18} className="mr-2" />
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <Headphones size={18} className="mr-2" />
                      Play Audio Sample
                    </>
                  )}
                </button>
                <Link
                  href={`/author/audiobooks/${book?.slug}`}
                  className="flex-1 flex items-center justify-center py-3 text-secondary font-medium hover:bg-gray-100 border-l border-gray-200 transition-colors duration-200"
                >
                  <BarChart3 size={18} className="mr-2" />
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudiobooksPage;
