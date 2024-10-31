import { FieldError } from "react-hook-form";

type SelectZodProps = {
  id: string;
  name: string;
  options: any[];
  error?: FieldError;
  register?: any;
  getOptionValue?: (option: any) => string | number;
  getOptionLabel?: (option: any) => string;
  placeholder: string;
  onChange?: (option: any) => void;
  isdisabled?: boolean;
  isrequired?: boolean;
};

export const SelectZodField: React.FC<SelectZodProps> = ({
  id,
  name,
  options,
  error,
  register,
  placeholder,
  getOptionValue = (option: any) => option.value,
  getOptionLabel = (option: any) => option.label,
  onChange,
  isdisabled = false,
  isrequired = false,
}) => {
  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 font-medium text-base ">
        {name}
      </label>
      <select
        id={id}
        className={`mt-1 w-full bg-transparent rounded-lg border-[0.5px] border-zinc-300 text-zinc-600 text-sm px-4 py-2 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 focus:ring-opacity-50 teansition-all duration-500 transform ${
          error && "border-red-500 focus:ring-red-500"
        }`}
        disabled={isdisabled}
        required={isrequired}
        {...register}
        {...(onChange && { onChange })}

      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option: any, index: number) => (
          <option key={index} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
