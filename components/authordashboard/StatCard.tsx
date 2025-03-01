import React from "react";

interface StatCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string;
  iconColor?: string;
  changeValue?: string;
  isIncrease?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  iconColor = "#1F8505", // Default to secondary color
  changeValue,
  isIncrease,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start">
        <div
          className="rounded-md p-2 mr-3"
          style={{ backgroundColor: `${iconColor}15` }} // Use color with low opacity
        >
          <Icon size={20} stroke={1.5} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <div className="flex items-end">
            <h4 className="text-xl md:text-2xl font-bold">{value}</h4>
            {changeValue && (
              <span
                className={`ml-2 text-xs ${
                  isIncrease ? "text-green-500" : "text-red-500"
                }`}
              >
                {isIncrease ? "+" : "-"}
                {changeValue}
              </span>
            )}
          </div>
        </div>
      </div>
      {changeValue && (
        <div className="mt-3 w-full h-1 bg-gray-100 rounded">
          <div
            className={`h-1 rounded ${
              isIncrease ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: `${Math.min(
                parseInt(changeValue.replace("%", "")) * 2,
                100
              )}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
