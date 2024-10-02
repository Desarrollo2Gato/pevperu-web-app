"use client";
import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FieldError, UseFormSetValue } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { watch } from "fs";

type InputProps = {
  name: string;
  id: string;
  type: string;
  value: string;
  placeholder: string;
  isPassword?: boolean;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<InputProps> = ({
  name,
  type = "text",
  value,
  onChange,
  id,
  placeholder,
  maxLength = 50,
  isPassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 font-medium text-base ">
        {name}
      </label>
      <input
        type={isPassword && showPassword ? "text" : type}
        id={id}
        className=" w-full mt-1 bg-transparent rounded-lg border-[0.5px] border-zinc-300 text-zinc-600 px-4 py-3 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 focus:ring-opacity-50"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute bottom-4 right-2 text-zinc-300 text-xl"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
    </div>
  );
};

type InputZodProps = {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  isPassword?: boolean;
  error?: FieldError;
  register: any;
  rows?: number;
  isrequired?: boolean;
};

export const InputZodField: React.FC<InputZodProps> = ({
  name,
  type = "text",
  id,
  placeholder,
  register,
  error,
  isPassword = false,
  isrequired = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="text-green-800  text-base font-medium ">
        {name}
      </label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          id={id}
          className={`mt-1 w-full bg-transparent rounded-lg border-[0.5px]  text-zinc-600 px-3 py-2 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-opacity-50 text-sm transition-all duration-500 transform  ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-300 focus:ring-green-800"
          }`}
          placeholder={placeholder}
          {...(isrequired && { required: true })}
          {...register}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute bottom-2 right-2 text-zinc-300 text-xl"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export const TextAreaZodField: React.FC<InputZodProps> = ({
  name,
  id,
  placeholder,
  register,
  error,
  rows = 4,
}) => {
  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 font-medium text-base ">
        {name}
      </label>
      <textarea
        id={id}
        className={`w-full resize-none bg-transparent rounded-lg border-[0.5px]  text-zinc-600 text-sm px-4 py-3 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-opacity-50  ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-zinc-300 focus:ring-green-800"
        }`}
        placeholder={placeholder}
        required
        rows={rows}
        {...register}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

type InputFileProps = {
  id: string;
  name: string;
  placeholder?: string;
  error?: FieldError;
  register?: any;
  setValue?: UseFormSetValue<any>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputFileZod: React.FC<InputFileProps> = ({
  id,
  name,
  placeholder,
  register,
  error,
  setValue,
  onChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log(id);
    // setValue("files.0.file_url", selectedFile, { shouldValidate: true });
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // setValue(id, e.target.files, { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
    // setValue(id, null, { shouldValidate: true });
  };

  return (
    <div className="w-full relative">
      <label className="text-green-800 text-base font-medium">{name}</label>
      <label
        htmlFor={id}
        className="w-full px-3 py-1 border rounded-md border-zinc-300 block mt-1"
      >
        <span className="text-zinc-600 text-xs">Seleccione un archivo</span>
        <input
          type="file"
          id={id}
          className={`hidden`}
          placeholder={placeholder}
          ref={fileInputRef}
          {...register}
          onChange={() => {
            onChange;
            handleFileChange;
          }}
          accept=".pdf"
        />
      </label>

      {selectedFile && (
        <div className="mt-2 flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg p-2">
          <span className="text-sm text-zinc-600">{selectedFile.name}</span>
          {/* <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 text-lg"
          >
            <FaTrash />
          </button> */}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export const InputColorZodField: React.FC<InputZodProps> = ({
  name,
  id,
  register,
  error,
}) => {
  return (
    <div
      className={`mt-1 w-full bg-transparent rounded-lg border-[0.5px]  text-zinc-600 px-3 py-2 placeholder-zinc-300 outline-none focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-opacity-50 text-sm transition-all duration-500 transform flex justify-between items-center  ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-zinc-300 focus:ring-green-800"
      }`}
    >
      <label htmlFor={id} className="text-green-800  text-sm font-medium  ">
        {name}
      </label>
      <input
        type="color"
        id={id}
        className={`rounded-md h-8 w-16  outline-none`}
        required
        {...register}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
