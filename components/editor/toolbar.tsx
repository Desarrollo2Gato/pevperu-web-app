"use client";

import { type Editor } from "@tiptap/react";
import {
  LuBold,
  LuStrikethrough,
  LuItalic,
  LuList,
  LuListOrdered,
  LuHeading2,
} from "react-icons/lu";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="border border-zinc-200 rounded-t-md flex flex-row flex-wrap gap-4 p-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        <LuBold size={20} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <LuItalic size={20} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}>
        <LuStrikethrough size={20} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <LuList size={20} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <LuListOrdered size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <LuHeading2 size={20} />
      </button>
    </div>
  );
}
