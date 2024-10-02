import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

type SearchInputProps = {
  placeholder?: string;
  onClick?: (query: string) => void;
};
const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "buscar...",
  onClick,
}) => {
  const [query, setQuery] = useState<string>("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearchClick = () => {
    if (onClick) {
      onClick(query);
    }
  };
  return (
    <div className="w-full sm:max-w-[300px] flex flex-row self-end">
      <input
        value={query}
        placeholder={placeholder}
        onChange={handleInputChange}
        className="w-full px-4 py-1 text-sm border border-gray-200 rounded-l-md outline-none focus:border-green-900 focus:ring-1 focus:ring-green-800 focus:ring-opacity-50 transition-all duration-500"
      />
      <button
        className="bg-gray-200 rounded-r-md px-2 py-1 border border-gray-200 hover:bg-gray-300 transition-all duration-500"
        onClick={handleSearchClick}
      >
        <IoMdSearch className="text-sm" />
      </button>
    </div>
  );
};

export default SearchInput;
