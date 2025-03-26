"use client";

import React, { useState, useEffect, useRef } from "react";
import apiClient from "@/lib/apiClient";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Mic,
  Tag,
  BookText,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
  Play,
  List,
  X,
} from "lucide-react";
import { listenSample } from "@/lib/audiobookActions.ts";
import { Howl } from "howler";
import { AudiobookDetail } from "@/types/types";

export const runtime = "edge";

// Types from API response
interface Author {
  id: number;
  name: string;
}

interface Narrator {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  title: string;
  duration: string;
  order: number;
}

const AudiobookDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [audiobook, setAudiobook] = useState<AudiobookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "chapters">("summary");
  const soundRef = useRef<Howl | null>(null);

  // Slug should be from router parameters
  const slug = params?.slug as string;

  useEffect(() => {
    const getAudiobookDetails = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/audiobooks/${slug}/`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch audiobook details");
        }

        setAudiobook(response.data.audiobook);
      } catch (error) {
        console.error("Error fetching audiobook details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getAudiobookDetails();
  }, [slug]);

  // Handle audio playback
  const handlePlayAudioSample = () => {
    listenSample(
      audiobook,
      soundRef,
      isPlaying,
      setIsPlaying,
      setAudioSampleLoading
    );
  };

  const handleGoBack = () => {
    router.push("/author/audiobooks");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading audiobook details...
        </p>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6">
        <BookOpen size={64} className="text-secondary mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">
          Audiobook Not Found
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          The audiobook you are looking for could not be found. It may have been
          removed or the URL might be incorrect.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="flex items-center text-secondary mb-6 hover:text-secondary/80 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Audiobooks
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-1/3 lg:w-1/4 p-6 flex justify-center">
            <div className="relative w-full max-w-xs shadow-lg">
              {audiobook.poster ? (
                <Image
                  src={audiobook.poster}
                  alt={audiobook.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                  <BookOpen size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 lg:w-3/4 p-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {audiobook.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {audiobook.authors.map((author) => (
                <span
                  key={author.id}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <Users size={14} className="mr-1" />
                  {author.name}
                </span>
              ))}

              {audiobook.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  <Tag size={14} className="mr-1" />
                  {category.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center border py-2 px-6 rounded-lg bg-gray-50">
                <Clock size={18} className="text-secondary mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Length</p>
                  <p className="font-medium">{audiobook.length}</p>
                </div>
              </div>

              <div className="flex items-center border py-2 px-6 rounded-lg bg-gray-50">
                <Calendar size={18} className="text-secondary mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-medium">
                    {formatDate(audiobook.date_published)}
                  </p>
                </div>
              </div>

              <div className="flex items-center border py-2 px-6 rounded-lg bg-gray-50">
                <Mic size={18} className="text-secondary mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Narrators</p>
                  <p className="font-medium">
                    {audiobook.narrators.map((n) => n.name).join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center border py-2 px-6 rounded-lg bg-gray-50">
                <DollarSign size={18} className="text-secondary mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {formatCurrency(audiobook.buying_price)}
                  </p>
                </div>
              </div>

              {audiobook.total_sales !== undefined && (
                <div className="flex items-center">
                  <ShoppingCart size={18} className="text-secondary mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="font-medium">{audiobook.total_sales}</p>
                  </div>
                </div>
              )}

              {audiobook.total_revenue !== undefined && (
                <div className="flex items-center">
                  <BarChart3 size={18} className="text-secondary mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="font-medium">
                      {formatCurrency(audiobook.total_revenue)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Collections */}
            {audiobook.collections.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Collections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {audiobook.collections.map((collection) => (
                    <span
                      key={collection.id}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      <BookText size={14} className="mr-1" />
                      {collection.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Sample */}
            {audiobook.audio_sample && (
              <div>
                <button
                  onClick={handlePlayAudioSample}
                  className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <X size={18} className="mr-2" />
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <Play size={18} className="mr-2" />
                      Play Audio Sample
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 py-4 font-medium border-b-2 ${
                activeTab === "summary"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              } transition-colors`}
              onClick={() => setActiveTab("summary")}
            >
              Summary & Description
            </button>
            <button
              className={`flex-1 py-4 font-medium border-b-2 ${
                activeTab === "chapters"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              } transition-colors`}
              onClick={() => setActiveTab("chapters")}
            >
              Chapters
            </button>
          </div>

          <div className="p-6">
            {activeTab === "summary" ? (
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">Summary</h2>
                <p className="mb-6 text-gray-700 whitespace-pre-line">
                  {audiobook.summary}
                </p>

                <h2 className="text-xl font-bold text-primary mb-4">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {audiobook.description}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">
                  Chapters
                </h2>
                {audiobook.chapters && audiobook.chapters.length > 0 ? (
                  <div className="space-y-4">
                    {audiobook.chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 flex items-center justify-center bg-secondary text-white rounded-full mr-3">
                              {chapter.order}
                            </span>
                            <span className="font-medium">{chapter.title}</span>
                          </div>
                          {/* <span className="text-gray-500">
                            {chapter.duration}
                          </span> */}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No chapters information available for this audiobook.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiobookDetails;
