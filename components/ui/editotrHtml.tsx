import React, { useEffect, useRef } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";

type EditorHtmlProps = {
  id: string;
  value?: string;
  setValue: UseFormSetValue<any>;
  onChange?: (value: string) => void;
  text: string;
  error?: FieldError;
};

const EditorHtml: React.FC<EditorHtmlProps> = ({
  id,
  value,
  onChange,
  text,
  error,
  setValue,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(id, value || "");
  }, [value, setValue, id]);
  const editor = useRef(null);

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 text-base font-medium">
        {text}
      </label>

      {/* Toolbar */}
      <div className="toolbar my-2 flex flex-row flex-wrap border border-zinc-200 px-4 py-1 justify-between gap-2 ">
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("bold")}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("italic")}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("underline")}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("strikeThrough")}
          title="Strike"
        >
          S
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("formatBlock", "h1")}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("formatBlock", "h2")}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("insertOrderedList")}
          title="Ordered List"
        >
          OL
        </button>
        <button
          type="button"
          className="font-medium text-sm"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Unordered List"
        >
          UL
        </button>
      </div>

      {/* Editable Content */}
      <div
        id={id}
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: value || "" }}
        onInput={() => {
          if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        className="w-full h-[360px] border border-gray-300 p-2 max-h-[360px] overflow-y-auto rounded bg-white"
      ></div>

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default EditorHtml;
