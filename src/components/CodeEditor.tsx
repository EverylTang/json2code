"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 w-full h-full bg-gray-50 dark:bg-gray-900 animate-pulse" />
    );
  }

  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={value}
      onChange={(val) => onChange?.(val ?? "")}
      theme={theme === "dark" ? "vs-dark" : "light"}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: readOnly ? "none" : "line",
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        suggestOnTriggerCharacters: !readOnly,
        quickSuggestions: !readOnly,
        contextmenu: !readOnly,
      }}
    />
  );
}
