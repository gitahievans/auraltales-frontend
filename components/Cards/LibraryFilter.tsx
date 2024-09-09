import React from "react";
import { IconChevronDown } from "@tabler/icons-react";
import Select from "react-select";
import { customStyles } from "@/styles/FilterStyles";

const FilterSection = () => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const tabsOptions = ["All", "Finished", "Unfinished"];
  return (
    <div className="flex items-center justify-between space-x-4 bg-[#0d1f22] p-4">
      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 focus:outline-none">
          All
        </button>
        <button className="px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 focus:outline-none">
          Finished
        </button>
        <button className="px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 focus:outline-none">
          Unfinished
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center">
        <Select options={options} styles={customStyles} className="w-56" />{" "}
      </div>
    </div>
  );
};

export default FilterSection;
