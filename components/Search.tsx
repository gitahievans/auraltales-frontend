import { useAudiobooks } from "@/hooks/useAudiobooks";
import { IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Search = ({ toggle }: { toggle?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { audiobooks, loading } = useAudiobooks();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const lowerTerm = term.toLowerCase();

    const filtered = audiobooks.filter((book) => {
      const titleMatch = book?.title.toLowerCase().includes(lowerTerm);
      const authorMatch = book?.authors.some((bk) =>
        bk.name.toLowerCase().includes(lowerTerm)
      );

      return titleMatch || authorMatch;
    });

    setSearchResults(filtered);
    setShowDropdown(true);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-1 max-w-xl mx-12">
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Audiobooks"
          className="placeholder:text-gray-100 text-white placeholder:text-xs pl-10 py-1.5 md:py-2 bg-transparent rounded-lg w-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {searchTerm && (
          <IconX
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 cursor-pointer"
          />
        )}{" "}
      </div>

      {showDropdown && searchTerm && searchResults.length > 0 && (
        <div className="absolute top-12 z-10 w-full mt-1 bg-gray-50 rounded-md shadow-lg border border-gray-200">
          <ul className="flex flex-col py-1 overflow-auto">
            {searchResults.map((audiobook) => (
              <li
                key={audiobook?.id}
                className="border-b border-b-gray-200 m-1 hover:bg-green-200 rounded-md"
              >
                <Link
                  href={`/audiobooks/${audiobook?.slug}`}
                  className="flex gap-2 p-4 transition-colors duration-300"
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchTerm("");
                    toggle && toggle();
                  }}
                >
                  <Image
                    src={audiobook?.poster}
                    alt={audiobook?.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <div className="space-y-1">
                    <h2 className="text-gray-900">{audiobook?.title}</h2>
                    <h3 className="text-sm text-gray-600">
                      By{" "}
                      {audiobook?.authors && audiobook?.authors?.length > 0
                        ? audiobook?.authors
                            .map((author: any) => author.name)
                            .join(", ")
                        : "Unknown Author"}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDropdown && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 mt-1 top-12 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-500">
            No Audiobooks found
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
