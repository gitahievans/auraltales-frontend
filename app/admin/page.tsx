"use client";

import AveragePurchaseCard from "@/components/admindashboard/AveragePurchaseCard";
import BookUploader from "@/components/admindashboard/BookUploadForm";
import CategoryDistribution from "@/components/admindashboard/CategoryDistribution";
import CollectionOverview from "@/components/admindashboard/CollectionOverview";
import NarratorStats from "@/components/admindashboard/NarratorStats";
import RecentBooks from "@/components/admindashboard/RecentBooks";
import RevenueChart from "@/components/admindashboard/RevenueChart";
import StatCard from "@/components/admindashboard/StatCard";
import WeeklyProgress from "@/components/admindashboard/WeeklyProgress";
import { Button, Loader } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBook,
  IconCategory2,
  IconCreditCard,
  IconLibrary,
  IconPlus,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

// Types that match the exact backend response structure
interface LibraryStats {
  total_audiobooks: number;
  total_categories: number;
  total_collections: number;
  total_authors: number;
  total_narrators: number;
  recently_added_audiobooks: Array<{
    title: string;
    date_published: string;
  }>;
  categories: Array<{
    name: string;
    count: number;
  }>;
  collections: Array<{
    name: string;
    count: number;
  }>;
  authors: Array<{
    name: string;
    count: number;
  }>;
  narrators: Array<{
    name: string;
    count: number;
  }>;
}

interface PurchaseStats {
  total_purchases: number;
  total_revenue: string;
  avg_purchase_value: string;
  recent_week_purchases: number;
  monthly_purchases: Array<{
    year_month: string;
    count: number;
  }>;
}

interface IconProps {
  className?: string;
}

export default function Dashboard() {
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null);
  const [purchaseStats, setPurchaseStats] = useState<PurchaseStats | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [libraryRes, purchasesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/library/stats/"),
          fetch("http://127.0.0.1:8000/purchases/purchases-stats/"),
        ]);

        if (!libraryRes.ok || !purchasesRes.ok) {
          throw new Error("Failed to fetch stats");
        }

        const libraryData = await libraryRes.json();
        const purchasesData = await purchasesRes.json();

        setLibraryStats(libraryData);
        setPurchaseStats(purchasesData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
  
    fetchStats();
  }, []);

  console.log("libraryStats", libraryStats);
  console.log("purchaseStats", purchaseStats);

  // Helper function to format currency
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const categoryData =
    libraryStats?.categories?.map((cat) => ({
      name: cat.name,
      value: 1, // might want to get actual count from backend
    })) || [];

  if (!libraryStats || !purchaseStats) {
    return (
      <div className="h-[80dvh] flex items-center justify-center gap-3">
        <Loader type="dots" color="#3b82f6" height={40} width={40} />
        <p className="text-center text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-2 md:px-0 md:py-0 md:p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
        {!isMobile ? (
          <Button variant="outline" onClick={open}>
            <IconPlus className="w-4 h-4 mr-2" />
            Upload a Book
          </Button>
        ) : (
          <Button variant="outline" onClick={open}>
            <IconPlus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IconCreditCard}
          title="Total Revenue"
          value={formatCurrency(purchaseStats.total_revenue)}
        />
        <StatCard
          icon={IconShoppingCart}
          title="Total Purchases"
          value={purchaseStats.total_purchases}
        />
        <StatCard
          icon={IconBook}
          title="Total Audiobooks"
          value={libraryStats.total_audiobooks}
        />
        <StatCard
          icon={IconUsers}
          title="Total Authors"
          value={libraryStats.total_authors}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={purchaseStats?.monthly_purchases} />
        </div>
        <div className="space-y-4">
          <WeeklyProgress
            total={purchaseStats.total_purchases}
            weekly={purchaseStats.recent_week_purchases}
          />
          <AveragePurchaseCard
            formatCurrency={formatCurrency}
            avgValue={purchaseStats?.avg_purchase_value}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CategoryDistribution categories={categoryData} />
        <div className="lg:col-span-2">
          <NarratorStats narrators={libraryStats?.narrators} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentBooks books={libraryStats.recently_added_audiobooks} />
        <div className="space-y-4">
          <CollectionOverview collections={libraryStats?.collections} />
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Additional Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={IconCategory2}
                title="Categories"
                value={libraryStats.total_categories}
              />
              <StatCard
                icon={IconLibrary}
                title="Collections"
                value={libraryStats.total_collections}
              />
            </div>
          </div>
        </div>
      </div>
      <BookUploader opened={opened} close={close} />
    </div>
  );
}
