import { useEffect } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type EditorHtmlProps = {
  id: string;
  value?: string;
  setValue: UseFormSetValue<any>;
  onChange?: (value: string) => void;
  text: string;
  error?: FieldError;
  // register?: any;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false]}],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

const EditorHtml: React.FC<EditorHtmlProps> = ({
  id,
  value,
  onChange,
  text,
  error,
  setValue,
  // register,
}) => {
  useEffect(() => {
    if (value) {
      setValue(id, value); 
    }
  }, [value, setValue, id]);
  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800  text-base font-medium ">
        {text}
      </label>
      <div className="w-full h-[360px] relative flex justify-center items-center">
        <ReactQuill
          theme="snow"
          value={value}
          defaultValue={value}
          onChange={(content) => {
            setValue(id, content); 
            if (onChange) onChange(content);
          }}
          // {...register}
          placeholder="Escribe aquí..."
          id={id}
          modules={modules}
          className="w-full relative  bg-transparent rounded-lg  text-zinc-600  placeholder-zinc-300 "
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default EditorHtml;
