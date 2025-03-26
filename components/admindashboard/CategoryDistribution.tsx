import { Category } from "@/types/types";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CategoryDistribution = ({ categories }: { categories: Category[] }) => (
  <div className="bg-white p-4 rounded-lg shadow h-96">
    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={categories}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {categories.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryDistribution;
