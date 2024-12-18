type SelectRowsProps = {
  pageSize: string;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectRows: React.FC<SelectRowsProps> = ({
  pageSize,
  handlePageSizeChange,
}) => {
  return (
    <div className="w-full sm:w-auto justify-between sm:justify-normal  flex flex-row gap-2 items-center">
      <label htmlFor="itemsPerPage" className="text-sm text-zinc-600">
        Mostrar
      </label>
      <select
        className="bg-transparent rounded-md border-[0.5px] border-zinc-300 text-zinc-600 text-sm px-4 py-1 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 focus:ring-opacity-50 teansition-all duration-500 transform "
        defaultValue={pageSize.toString()}
        onChange={handlePageSizeChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  );
};

export default SelectRows;
