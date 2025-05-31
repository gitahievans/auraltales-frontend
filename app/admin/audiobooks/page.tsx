"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { Audiobook } from "@/types/types";
import apiClient from "@/lib/apiClient";
import { EditableCell } from "@/components/admindashboard/EditableCell";
import { ActionsCell } from "@/components/admindashboard/ActionsCell";

const fetchAudiobooks = async (): Promise<Audiobook[]> => {
  const response = await apiClient.get("/api/audiobooks");
  return response.data.audiobooks;
};

const updateAudiobook = async (id: number, data: Partial<Audiobook>) => {
  try {
    await apiClient.put(`/api/audiobooks/${id}`, data);
    notifications.show({
      title: "Success",
      message: "Audiobook updated successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update audiobook",
      color: "red",
    });
    throw error;
  }
};

const deleteAudiobook = async (id: number) => {
  try {
    await apiClient.delete(`/api/audiobooks/${id}/delete/`);
    notifications.show({
      title: "Success",
      message: "Audiobook deleted successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to delete audiobook",
      color: "red",
    });
    throw error;
  }
};

const columnHelper = createColumnHelper<Audiobook>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id!}
        field="title"
        updateAudiobook={updateAudiobook}
      />
    ),
  }),
  columnHelper.accessor("authors", {
    header: "Authors",
    cell: ({ getValue }) =>
      getValue()
        .map((author) => author.name)
        .join(", "),
  }),
  columnHelper.accessor("categories", {
    header: "Categories",
    cell: ({ getValue }) =>
      getValue()
        .map((category) => category.name)
        .join(", "),
  }),
  columnHelper.accessor("buying_price", {
    header: () => (
      <div className="flex items-center gap-1">
        Price ($)
        <button
          onClick={() => {}}
          className="text-gray-500 hover:text-gray-700"
        >
          ⇅
        </button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id!}
        field="buying_price"
        type="number"
        updateAudiobook={updateAudiobook}
      />
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("date_published", {
    header: () => (
      <div className="flex items-center gap-1">
        Published
        <button
          onClick={() => {}}
          className="text-gray-500 hover:text-gray-700"
        >
          ⇅
        </button>
      </div>
    ),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  columnHelper.accessor("length", {
    header: () => (
      <div className="flex items-center gap-1">
        Duration
        <button
          onClick={() => {}}
          className="text-gray-500 hover:text-gray-700"
        >
          ⇅
        </button>
      </div>
    ),
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const timeA = rowA.getValue(columnId) as string;
      const timeB = rowB.getValue(columnId) as string;
      const [hA, mA, sA] = timeA.split(":").map(Number);
      const [hB, mB, sB] = timeB.split(":").map(Number);
      const totalSecondsA = hA * 3600 + mA * 60 + sA;
      const totalSecondsB = hB * 3600 + mB * 60 + sB;
      return totalSecondsA - totalSecondsB;
    },
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell
        audiobook={row.original}
        deleteAudiobook={deleteAudiobook}
        updateAudiobook={updateAudiobook}
      />
    ),
  }),
];

const AudiobooksTable: React.FC = () => {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadAudiobooks = async () => {
      try {
        const data = await fetchAudiobooks();
        setAudiobooks(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load audiobooks",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadAudiobooks();
  }, []);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return audiobooks.slice(start, start + pageSize);
  }, [audiobooks, currentPage, pageSize]);

  const totalPages = Math.ceil(audiobooks.length / pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 font-secondary">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Audiobook Management
      </h1>
      <div className="flex justify-end mb-4">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border p-3 text-left cursor-pointer font-semibold text-gray-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && " 🔼"}
                    {header.column.getIsSorted() === "desc" && " 🔽"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, audiobooks.length)} of{" "}
          {audiobooks.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            classNames={{ root: "bg-blue-600 hover:bg-blue-700 text-white" }}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            classNames={{ root: "bg-blue-600 hover:bg-blue-700 text-white" }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudiobooksTable;
