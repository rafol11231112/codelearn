"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/ThemeProvider";

interface CodeEditorProps {
  language: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ language, defaultValue, onChange }: CodeEditorProps) {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const mobileOptions = {
    minimap: { enabled: false },
    fontSize: 16,
    lineNumbers: "off",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    padding: { top: 12, bottom: 12, left: 8, right: 8 },
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
    },
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: "off",
    tabCompletion: "off",
    wordBasedSuggestions: "off",
    parameterHints: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
  };

  const desktopOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    padding: { top: 16, bottom: 16 },
    scrollbar: {
      verticalScrollbarSize: 14,
      horizontalScrollbarSize: 14,
    },
  };

  return (
    <div className="h-full rounded-xl overflow-hidden border-2 border-border">
      <Editor
        height="100%"
        language={language}
        value={defaultValue}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={isMobile ? mobileOptions : desktopOptions}
      />
    </div>
  );
}

