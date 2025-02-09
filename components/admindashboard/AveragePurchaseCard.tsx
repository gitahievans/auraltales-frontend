import React from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis } from "recharts";

const AveragePurchaseCard = ({
  formatCurrency,
  avgValue,
}: {
  formatCurrency: Function;
  avgValue: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Average Purchase Value</h3>
    <div className="text-center">
      <p className="text-3xl font-bold text-blue-600">
        {formatCurrency(avgValue)}
      </p>
      <p className="text-sm text-gray-600 mt-2">Per Transaction</p>
    </div>
  </div>
);

export default AveragePurchaseCard;
