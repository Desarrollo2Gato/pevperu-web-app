import { IoMdSearch } from "react-icons/io";

type SearchInputProps = {
  placeholder?: string;
  onClick?: (query: string) => void;
};
const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "buscar...",
  onClick,
}) => {
  return (
    <div className="flex flex-row self-end">
      <input
        placeholder={placeholder}
        className="max-w-[300px] px-3 py-1 text-sm border border-gray-200 rounded-l-md outline-none focus:border-green-900 focus:ring-1 focus:ring-green-800 focus:ring-opacity-50 transition-all duration-500"
      />
      <button
        className="bg-gray-200 rounded-r-md px-2 py-1 border border-gray-200 hover:bg-gray-300 transition-all duration-500"
        onClick={() => onClick}
      >
        <IoMdSearch className="text-sm" />
      </button>
    </div>
  );
};

export default SearchInput;