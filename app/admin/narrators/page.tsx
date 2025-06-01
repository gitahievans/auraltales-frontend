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
import {
  Edit,
  Save,
  X,
  Trash2,
  Info,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import { Modal, Button, Textarea } from "@mantine/core";
import { Narrator } from "@/types/types";
import apiClient from "@/lib/apiClient";

interface ApiResponse {
  authors: any[];
  narrators: Narrator[];
}

const fetchNarrators = async (): Promise<Narrator[]> => {
  const response = await apiClient.get<ApiResponse>(
    "/api/authors-and-narrators/"
  );
  return response.data.narrators;
};

const updateNarrator = async (id: number, data: Partial<Narrator>) => {
  try {
    await apiClient.put(`/api/narrators/${id}/update/`, data);
    notifications.show({
      title: "Success",
      message: "Narrator updated successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update narrator",
      color: "red",
    });
    throw error;
  }
};

const deleteNarrator = async (id: number) => {
  try {
    await apiClient.delete(`/api/narrators/${id}/delete/`);
    notifications.show({
      title: "Success",
      message: "Narrator deleted successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to delete narrator",
      color: "red",
    });
    throw error;
  }
};

interface EditableCellProps {
  value: string;
  rowId: number;
  field: keyof Narrator;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, rowId, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  const handleSave = async () => {
    await updateNarrator(rowId, { [field]: cellValue });
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        className="border rounded px-2 py-1 w-full max-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSave}
        className="text-green-600 hover:text-green-800"
      >
        <Save size={20} />
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="text-red-600 hover:text-red-800"
      >
        <X size={20} />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span className="truncate max-w-[200px]">{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Edit size={20} />
      </button>
    </div>
  );
};

interface DetailsModalProps {
  narrator: Narrator;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ narrator, onClose }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [name, setName] = useState(narrator.name);
  const [email, setEmail] = useState(narrator.email);
  const [phone_number, setPhoneNumber] = useState(narrator.phone_number);
  const [bio, setBio] = useState(narrator.bio);

  const handleSave = async () => {
    await updateNarrator(narrator.id!, { name, email, phone_number, bio });
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingBio(false);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <User size={24} />
          Narrator Details
        </div>
      }
      size="lg"
      classNames={{
        content: "bg-white rounded-lg shadow-xl",
        header: "border-b border-gray-200 pb-4",
        body: "p-6",
      }}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <User size={20} />
              Name
            </h3>
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-600">{name || "No name provided"}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Mail size={20} />
              Email
            </h3>
            <button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-600">{email || "No email provided"}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Phone size={20} />
              Phone Number
            </h3>
            <button
              onClick={() => setIsEditingPhone(!isEditingPhone)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingPhone ? (
            <input
              type="tel"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-600">
              {phone_number || "No phone number provided"}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={20} />
              Bio
            </h3>
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} />
            </button>
          </div>
          {isEditingBio ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              minRows={4}
              className="w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bio"
            />
          ) : (
            <p className="text-gray-600">{bio || "No bio provided"}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            classNames={{
              root: "border-gray-300 text-gray-700 hover:bg-gray-100",
            }}
          >
            Cancel
          </Button>
          {(isEditingName ||
            isEditingEmail ||
            isEditingPhone ||
            isEditingBio) && (
            <Button
              onClick={handleSave}
              classNames={{ root: "bg-blue-600 hover:bg-blue-700 text-white" }}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

interface ActionsCellProps {
  narrator: Narrator;
  deleteNarrator: (id: number) => Promise<void>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  narrator,
  deleteNarrator,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => deleteNarrator(narrator.id!)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Info size={20} />
      </button>
      {isModalOpen && (
        <DetailsModal
          narrator={narrator}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<Narrator>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => (
      <div className="flex items-center gap-1">
        Name
        <button className="text-gray-500 hover:text-gray-700">⇅</button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <EditableCell value={getValue()} rowId={row.original.id!} field="name" />
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("email", {
    header: () => (
      <div className="flex items-center gap-1">
        Email
        <button className="text-gray-500 hover:text-gray-700">⇅</button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <EditableCell value={getValue()} rowId={row.original.id!} field="email" />
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("phone_number", {
    header: "Phone Number",
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id!}
        field="phone_number"
      />
    ),
  }),
  columnHelper.accessor("bio", {
    header: "Bio",
    cell: ({ row, getValue }) => (
      <EditableCell value={getValue()} rowId={row.original.id!} field="bio" />
    ),
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell narrator={row.original} deleteNarrator={deleteNarrator} />
    ),
  }),
];

const NarratorsTable: React.FC = () => {
  const [narrators, setNarrators] = useState<Narrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadNarrators = async () => {
      try {
        const data = await fetchNarrators();
        setNarrators(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load narrators",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadNarrators();
  }, []);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return narrators.slice(start, start + pageSize);
  }, [narrators, currentPage, pageSize]);

  const totalPages = Math.ceil(narrators.length / pageSize);

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
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Narrator Management
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
          {Math.min(currentPage * pageSize, narrators.length)} of{" "}
          {narrators.length} entries
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

export default NarratorsTable;
