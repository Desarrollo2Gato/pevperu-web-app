type SelectComponentProps = {
  label: string;
  id: string;
  options: Array<{ value: string; label: string }>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue: string;
};
const SelectComponent: React.FC<SelectComponentProps> = ({
  label,
  id,
  options,
  onChange,
  defaultValue,
}) => {
  return (
    <div className="flex flex-col justify-between md:max-w-[300px] md:min-w-[200px] w-full">
      <label htmlFor={id} className="font-medium text-green-800 ">
        {label}
      </label>
      <select
        id={id}
        className="mt-1 border border-zinc-300 text-sm rounded-md px-4 py-1.5 text-zinc-600 focus:border-green-800 focus:ring-green-800 w-full"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
