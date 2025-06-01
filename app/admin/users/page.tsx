"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Edit } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { Button, TextInput } from "@mantine/core";
import apiClient from "@/lib/apiClient";

interface Profile {
  phone_number: string | null;
  avatar: string | null;
  bio: string | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: Profile | null;
  is_staff: boolean;
  is_active: boolean;
  is_author: boolean;
  date_joined: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("/accounts/users");
  return response.data;
};

const updateUser = async (id: number, data: Partial<User>) => {
  try {
    await apiClient.put(`/accounts/users/${id}/update/`, data);
    notifications.show({
      title: "Success",
      message: "User updated successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update user",
      color: "red",
    });
    throw error;
  }
};

const deleteUser = async (id: number) => {
  try {
    await apiClient.delete(`/accounts/users/${id}/delete/`);
    notifications.show({
      title: "Success",
      message: "User deleted successfully",
      color: "green",
    });
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to delete user",
      color: "red",
    });
    throw error;
  }
};

const EditableCell: React.FC<{
  value: string;
  rowId: number;
  field: keyof User | "phone_number";
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
}> = ({ value, rowId, field, updateUser }) => {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const data =
      field === "phone_number"
        ? { profile: { phone_number: editValue, avatar: null, bio: null } }
        : { [field]: editValue };
    await updateUser(rowId, data);
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center gap-2">
      <TextInput
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        size="xs"
        className="w-32"
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <Button
        size="xs"
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700"
      >
        Save
      </Button>
      <Button
        size="xs"
        onClick={() => setIsEditing(false)}
        className="bg-red-600 hover:bg-red-700"
      >
        Cancel
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span>{value || "-"}</span>
      <Button
        size="xs"
        variant="subtle"
        onClick={() => setIsEditing(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Edit size={16} />
      </Button>
    </div>
  );
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("first_name", {
    header: "First Name",
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id}
        field="first_name"
        updateUser={updateUser}
      />
    ),
  }),
  columnHelper.accessor("last_name", {
    header: "Last Name",
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id}
        field="last_name"
        updateUser={updateUser}
      />
    ),
  }),
  columnHelper.accessor((row) => row.profile?.phone_number || "", {
    id: "phone_number",
    header: "Phone Number",
    cell: ({ row, getValue }) => (
      <EditableCell
        value={getValue()}
        rowId={row.original.id}
        field="phone_number"
        updateUser={updateUser}
      />
    ),
  }),
  columnHelper.accessor("is_staff", {
    header: "Staff",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("is_active", {
    header: "Active",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("is_author", {
    header: "Author",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("date_joined", {
    header: "Date Joined",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => deleteUser(row.original.id)}
          size="xs"
          variant="subtle"
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </Button>
      </div>
    ),
  }),
];

const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load users",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  const totalPages = Math.ceil(users.length / pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Users Management
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
                    className="border p-3 text-left font-semibold text-gray-700"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
          {Math.min(currentPage * pageSize, users.length)} of {users.length}{" "}
          entries
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

export default UsersSection;
