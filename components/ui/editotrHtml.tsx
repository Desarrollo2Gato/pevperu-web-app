import React, { useEffect, useRef, useState } from "react";
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
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());

  useEffect(() => {
    setValue(id, value || "");
  }, [value, setValue, id]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const updateActiveButtons = () => {
    if (editorRef.current) {
      const selection = document.getSelection();
      const parentElement = selection?.anchorNode?.parentElement;
      const newActiveButtons = new Set<string>();

      if (parentElement) {
        // Check if bold is active
        if (parentElement.tagName === "B" || parentElement.style.fontWeight === "bold") {
          newActiveButtons.add("bold");
        }
        // Check if italic is active
        if (parentElement.tagName === "I" || parentElement.style.fontStyle === "italic") {
          newActiveButtons.add("italic");
        }
        // Check if underline is active
        if (parentElement.tagName === "U") {
          newActiveButtons.add("underline");
        }
        // Check if strikethrough is active
        if (parentElement.tagName === "S") {
          newActiveButtons.add("strikeThrough");
        }
        // Check if H1 or H2 is active
        if (parentElement.tagName === "H1") {
          newActiveButtons.add("h1");
        }
        if (parentElement.tagName === "H2") {
          newActiveButtons.add("h2");
        }
      }

      setActiveButtons(newActiveButtons);
    }
  };

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    updateActiveButtons(); // Update the active buttons after executing command

    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      if (onChange) {
        onChange(newValue);
      }
      setValue(id, newValue);
    }
  };

  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 text-base font-medium">
        {text}
      </label>

      {/* Toolbar */}
      <div className="toolbar my-2 flex flex-row flex-wrap border border-zinc-200 px-4 py-1 justify-between gap-2">
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("bold") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("bold")}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("italic") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("italic")}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("underline") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("underline")}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("strikeThrough") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("strikeThrough")}
          title="Strike"
        >
          S
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("h1") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("formatBlock",'h1')}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("h2") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("formatBlock", "h2")}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("insertOrderedList") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
          onClick={() => executeCommand("insertOrderedList")}
          title="Ordered List"
        >
          OL
        </button>
        <button
          type="button"
          className={`font-medium text-sm px-2 py-1 transition-all duration-500 ${activeButtons.has("insertUnorderedList") ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
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
        className="w-full h-[360px] border border-gray-200 p-2 max-h-[360px] overflow-y-auto rounded bg-white focus:outline-none focus:border-green-800 min-h-[100px] text-sm"
        onInput={() => {
          if (editorRef.current) {
            const newValue = editorRef.current.innerHTML;
            if (onChange) {
              onChange(newValue);
            }
            setValue(id, newValue);
            updateActiveButtons(); 
          }
        }}
      ></div>

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default EditorHtml;
