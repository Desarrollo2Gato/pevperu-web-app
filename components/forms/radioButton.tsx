import { FieldError } from "react-hook-form";

type RadioBooleanProps = {
  id: string;
  name: string;
  error?: FieldError;
  register?: any;
  onChange?: (value: boolean) => void;
  isdisabled?: boolean;
  isrequired?: boolean;
};

export const RadioBooleanField: React.FC<RadioBooleanProps> = ({
  id,
  name,
  error,
  register,
  onChange,
  isdisabled = false,
  isrequired = false,
}) => {
  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 font-medium text-base">
        {name}
      </label>
      <div className="mt-2 space-x-4 flex justify-around">
        <div className="flex items-center">
          <label htmlFor={`${id}_true`} className="text-zinc-600 text-sm flex items-center">
            <input
              type="radio"
              id={`${id}_true`}
              name={id}
              value="true"
              className="mr-2"
              {...register}
              disabled={isdisabled}
              required={isrequired}
              onChange={(e) => onChange && onChange(true)}
            />
            Sí
          </label>
        </div>
        <div className="flex items-center">
          <label htmlFor={`${id}_false`} className="text-zinc-600 text-sm flex items-center">
            <input
              type="radio"
              id={`${id}_false`}
              name={id}
              value="false"
              className="mr-2"
              {...register}
              disabled={isdisabled}
              required={isrequired}
              onChange={(e) => onChange && onChange(false)}
            />
            No
          </label>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
