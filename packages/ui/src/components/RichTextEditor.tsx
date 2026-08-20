// components/RichTextEditor.tsx
"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useRef } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange }: Props) {
  const editor = useCreateBlockNote();
  const lastSyncedContent = useRef<string | null>(null);

  useEffect(() => {
    if (!editor) return;
    // ── Skip if this content is already what's loaded (avoids overwriting user's edits) ──
    if (content === lastSyncedContent.current) return;

    (async () => {
      const blocks = content ? await editor.tryParseHTMLToBlocks(content) : [];
      editor.replaceBlocks(editor.document, blocks);
      lastSyncedContent.current = content;
    })();
  }, [editor, content]);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-[3px] focus-within:border-[rgb(33,76,123)] focus-within:ring-[rgb(33,76,123)]/25">
      <BlockNoteView
        editor={editor}
        theme="light"
        className="min-h-[100px] p-4 bg-white [&_.bn-editor]:bg-white [&_.bn-editor]:min-h-[100px]"
        onChange={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          lastSyncedContent.current = html;
          onChange(html);
        }}
      />
    </div>
  );
}
