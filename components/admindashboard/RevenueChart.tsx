import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data }) => {
  // Transform "year_month" into a more readable format
  const formattedData = data.map((item) => {
    const [year, month] = item.year_month.split("-");
    return {
      ...item,
      formattedMonth: `${year}-${month.padStart(2, "0")}`, // Ensure month is always two digits
      displayMonth: `${
        [
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
        ][month - 1]
      } ${year}`,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow h-96">
      <h3 className="text-lg font-semibold mb-4">Monthly Purchases</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedMonth"
            tickFormatter={(value) => {
              const [year, month] = value.split("-");
              return `${
                [
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
                ][month - 1]
              } ${year}`;
            }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} purchases`]}
            labelFormatter={(label) => {
              const [year, month] = label.split("-");
              return `${
                [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ][month - 1]
              } ${year}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
