"use client";

import React, { useEffect } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBook,
  IconCreditCard,
  IconShoppingCart,
  IconTrendingUp,
  IconCalendar,
  IconChartBar,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/admindashboard/StatCard";
import apiClient from "@/lib/apiClient";
import Image from "next/image";

interface AudioBook {
  id: number;
  title: string;
  poster: string;
  description: string;
  buying_price: number;
  date_published: string;
  total_sales: number;
  total_revenue: number;
}

interface AuthorLibraryStats {
  audiobooks: AudioBook[];
}

interface AuthorSalesStats {
  total_sales: number;
  total_revenue: number;
  avg_purchase_value: number;
  recent_week_purchases: number;
  monthly_purchases: Array<{
    year_month: string;
    count: number;
  }>;
}

const AuthorDashboard = () => {
  const [authorAudiobooks, setAuthorAudiobooks] =
    React.useState<AuthorLibraryStats | null>(null);
  const [authorSalesStats, setAuthorSalesStats] =
    React.useState<AuthorSalesStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure();

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

  const getAuthorSalesStats = async () => {
    try {
      const response = await apiClient.get("/api/author-sales-stats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch stats");
      }

      setAuthorSalesStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    getAuthorAudiobooks();
    getAuthorSalesStats();
  }, []);

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatMonthNames = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[parseInt(month) - 1];
  };

  const formattedMonthlyPurchases =
    authorSalesStats?.monthly_purchases?.map((item) => ({
      name: formatMonthNames(item.year_month),
      sales: item.count,
    })) || [];

  // Calculate total book count from audiobooks
  const totalBooks = authorAudiobooks?.audiobooks?.length || 0;

  // Colors for charts
  const COLORS = ["#041714", "#1F8505", "#21440F", "white"];

  // Prepare data for pie chart
  const prepareBookSalesData = () => {
    if (
      !authorAudiobooks?.audiobooks ||
      authorAudiobooks.audiobooks?.length === 0
    )
      return [];

    return authorAudiobooks.audiobooks.map((book) => ({
      name:
        book.title.length > 15
          ? book.title.substring(0, 15) + "..."
          : book.title,
      value: book.total_sales,
    }));
  };

  const bookSalesData = prepareBookSalesData();

  // Show loading state
  if (isLoading || !authorSalesStats) {
    return (
      <div className="py-6 px-2 md:px-6 h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-secondary rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-2 md:px-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold text-primary">
          Author Dashboard
        </h2>
        <div className="text-sm text-gray-500 hidden md:block">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IconCreditCard}
          title="Total Revenue"
          value={
            authorSalesStats?.total_revenue
              ? formatCurrency(authorSalesStats?.total_revenue)
              : "0"
          }
          iconColor="#1F8505"
        />
        <StatCard
          icon={IconShoppingCart}
          title="Total Sales"
          value={
            authorSalesStats?.total_sales
              ? authorSalesStats?.total_sales?.toString()
              : "0"
          }
          iconColor="white"
        />
        <StatCard
          icon={IconBook}
          title="Total Audiobooks"
          value={totalBooks.toString()}
          iconColor="#041714"
        />
        <StatCard
          icon={IconTrendingUp}
          title="Avg. Purchase Value"
          value={
            authorSalesStats?.avg_purchase_value
              ? formatCurrency(authorSalesStats?.avg_purchase_value)
              : "0"
          }
          iconColor="#21440F"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-4 flex items-center">
            <IconChartBar className="mr-2 text-secondary" size={20} />
            <h3 className="font-bold text-gray-800">Monthly Sales Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedMonthlyPurchases}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                  }}
                  formatter={(value) => [`${value} sales`, "Sales"]}
                />
                <Bar
                  dataKey="sales"
                  fill="#1F8505"
                  barSize={isMobile ? 20 : 40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Book Sales Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-4 flex items-center">
            <IconBook className="mr-2 text-tertiary" size={20} />
            <h3 className="font-bold text-gray-800">Book Sales Distribution</h3>
          </div>
          <div className="h-64 flex justify-center">
            {bookSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookSalesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 50 : 70}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {bookSalesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sales`, "Sales"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No book sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Week Performance */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4 flex items-center">
          <IconCalendar className="mr-2 text-secondary" size={20} />
          <h3 className="font-bold text-gray-800">Recent Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Recent Week Purchases</p>
            <div className="flex items-end space-x-2 mt-2">
              <span className="text-2xl font-bold">
                {authorSalesStats?.recent_week_purchases
                  ? authorSalesStats?.recent_week_purchases
                  : 0}
              </span>
              <span className="text-sm text-green-500">Sales</span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-secondary rounded"
                style={{
                  width: `${Math.min(
                    (authorSalesStats?.recent_week_purchases /
                      (authorSalesStats?.total_sales / 52)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compared to weekly average
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Weekly Revenue</p>
            <div className="flex items-end space-x-2 mt-2">
              <span className="text-2xl font-bold">
                {authorSalesStats?.recent_week_purchases &&
                authorSalesStats?.avg_purchase_value
                  ? formatCurrency(
                      authorSalesStats?.recent_week_purchases *
                        authorSalesStats?.avg_purchase_value
                    )
                  : "0"}
              </span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-color rounded"
                style={{
                  width: `${Math.min(
                    ((authorSalesStats?.recent_week_purchases *
                      authorSalesStats?.avg_purchase_value) /
                      (authorSalesStats?.total_revenue / 52)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compared to weekly average
            </p>
          </div>
        </div>
      </div>

      {/* Audiobooks Table */}
      {authorAudiobooks && authorAudiobooks.audiobooks?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-4">Your Audiobooks</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sales
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authorAudiobooks.audiobooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-md object-cover"
                            src={book.poster}
                            alt={book.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {book.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(book.buying_price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(book.date_published).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {book.total_sales}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(book.total_revenue)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
