import React, { useEffect } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "../editor/toolbar";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

type EditorHtmlProps = {
  id: string;
  value?: string;
  setValue: UseFormSetValue<any>;
  onChange: (value: string) => void;
  text: string;
  error?: FieldError;
};

const EditorText: React.FC<EditorHtmlProps> = ({
  id,
  value,
  onChange,
  text,
  error,
  setValue,
}) => {
  useEffect(() => {
    if (value) {
      setValue(id, value || "");
    }
  }, [value, setValue, id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "text-xl font-medium ",
          },
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-1",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-1",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "ml-2",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "rounded-b-md border border-zinc-200 p-4 focus:ring-2  focus:border-transparent focus:ring-green-700 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value); 
    }
  }, [editor, value]);

  return (
    <div className="w-full relative">
      <label htmlFor={id} className="text-green-800 text-base font-medium">
        {text}
      </label>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default EditorText;
