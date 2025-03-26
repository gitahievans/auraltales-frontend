import { useState } from "react";

export const ExpandableText = ({ children }: { children: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className="text-gray-400">
        {expanded ? children : `${children.substring(0, 250)}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 hover:text-blue-700 focus:outline-none"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </div>
  );
};
