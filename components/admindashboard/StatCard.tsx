import React from "react";

const StatCard = ({ icon: Icon, title, value, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  );
};

export default StatCard;
