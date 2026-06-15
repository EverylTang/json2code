"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { convertToTypeScript } from "@/lib/converters/typescript";
import { convertToGo } from "@/lib/converters/golang";
import { convertToPython } from "@/lib/converters/python";
import { convertToJava } from "@/lib/converters/java";
import { convertToRust } from "@/lib/converters/rust";
import { convertToCSharp } from "@/lib/converters/csharp";
import { convertToSwift } from "@/lib/converters/swift";
import { convertToKotlin } from "@/lib/converters/kotlin";
import { ConvertOptions } from "@/lib/converters/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Language = "typescript" | "golang" | "python" | "java" | "rust" | "csharp" | "swift" | "kotlin";

const LANGUAGES: { key: Language; label: string; icon: string; color: string; monacoLang: string }[] = [
  { key: "typescript", label: "TypeScript", icon: "TS", color: "bg-blue-500 text-white", monacoLang: "typescript" },
  { key: "golang", label: "Go", icon: "GO", color: "bg-cyan-500 text-white", monacoLang: "go" },
  { key: "python", label: "Python", icon: "PY", color: "bg-yellow-500 text-black", monacoLang: "python" },
  { key: "java", label: "Java", icon: "JV", color: "bg-red-600 text-white", monacoLang: "java" },
  { key: "rust", label: "Rust", icon: "RS", color: "bg-orange-600 text-white", monacoLang: "rust" },
  { key: "csharp", label: "C#", icon: "C#", color: "bg-purple-600 text-white", monacoLang: "csharp" },
  { key: "swift", label: "Swift", icon: "SW", color: "bg-orange-500 text-white", monacoLang: "swift" },
  { key: "kotlin", label: "Kotlin", icon: "KT", color: "bg-violet-600 text-white", monacoLang: "kotlin" },
];

const DEFAULT_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "tags": ["developer", "designer"],
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "zipCode": "94105"
  }
}`;

const HISTORY_KEY = "json2code_history";
const MAX_HISTORY = 10;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(history: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function encodeUrl(json: string, lang: Language, rootName: string): string {
  const params = new URLSearchParams();
  params.set("json", btoa(unescape(encodeURIComponent(json))));
  params.set("lang", lang);
  if (rootName && rootName !== "Root") params.set("name", rootName);
  return `${window.location.pathname}?${params.toString()}`;
}

function decodeUrl(): { json?: string; lang?: Language; rootName?: string } {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: { json?: string; lang?: Language; rootName?: string } = {};
  const jsonParam = params.get("json");
  if (jsonParam) {
    try { result.json = decodeURIComponent(escape(atob(jsonParam))); } catch {}
  }
  const langParam = params.get("lang") as Language | null;
  if (langParam && LANGUAGES.some(l => l.key === langParam)) result.lang = langParam;
  const nameParam = params.get("name");
  if (nameParam) result.rootName = nameParam;
  return result;
}

function parseJsonError(error: any, jsonStr: string): { message: string; line?: number; column?: number } {
  const errorMessage = error.message || "Invalid JSON";
  const positionMatch = errorMessage.match(/at position (\d+)/);
  const lineColumnMatch = errorMessage.match(/at line (\d+) column (\d+)/);
  
  if (lineColumnMatch) {
    return {
      message: errorMessage,
      line: parseInt(lineColumnMatch[1]),
      column: parseInt(lineColumnMatch[2])
    };
  }
  
  if (positionMatch) {
    const position = parseInt(positionMatch[1]);
    const lines = jsonStr.substring(0, position).split('\n');
    return {
      message: errorMessage,
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }
  
  return { message: errorMessage };
}

export default function JsonToCode() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [language, setLanguage] = useState<Language>("typescript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [rootName, setRootName] = useState("Root");
  const [showOptions, setShowOptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const [tsUseType, setTsUseType] = useState(false);
  const [javaLombok, setJavaLombok] = useState(false);
  const [goTagStyle, setGoTagStyle] = useState<"json" | "snake" | "camel" | "none">("json");
  const [serialAnnotation, setSerialAnnotation] = useState(false);
  const [useNullable, setUseNullable] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    const urlState = decodeUrl();
    if (urlState.json) setJsonInput(urlState.json);
    if (urlState.lang) setLanguage(urlState.lang);
    if (urlState.rootName) setRootName(urlState.rootName);
    setMounted(true);
  }, []);

  const buildOptions = useCallback((): ConvertOptions => ({
    rootName: rootName || "Root",
    tsUseType,
    javaLombok,
    goTagStyle,
    serialAnnotation,
    useNullable,
  }), [rootName, tsUseType, javaLombok, goTagStyle, serialAnnotation, useNullable]);

  const convert = useCallback(async (jsonStr: string, lang: Language) => {
    setIsProcessing(true);
    setError(null);
    try {
      const parsed = JSON.parse(jsonStr);
      const options = buildOptions();

      let result: { code: string };
      switch (lang) {
        case "typescript":
          result = convertToTypeScript(parsed, options); break;
        case "golang":
          result = await convertToGo(parsed, options); break;
        case "python":
          result = await convertToPython(parsed, options); break;
        case "java":
          result = convertToJava(parsed, options); break;
        case "rust":
          result = convertToRust(parsed, options); break;
        case "csharp":
          result = convertToCSharp(parsed, options); break;
        case "swift":
          result = convertToSwift(parsed, options); break;
        case "kotlin":
          result = convertToKotlin(parsed, options); break;
        default:
          result = { code: "" };
      }

      setOutput(result.code);
    } catch (e: any) {
      setError(parseJsonError(e, jsonStr));
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  }, [buildOptions]);

  useEffect(() => {
    if (jsonInput.trim()) {
      const timer = setTimeout(() => convert(jsonInput, language), 300);
      return () => clearTimeout(timer);
    }
  }, [jsonInput, language, convert]);

  useEffect(() => {
    if (jsonInput.trim()) convert(jsonInput, language);
  }, [rootName, tsUseType, javaLombok, goTagStyle]);

  useEffect(() => {
    if (mounted) {
      const url = encodeUrl(jsonInput, language, rootName);
      window.history.replaceState(null, "", url);
    }
  }, [jsonInput, language, rootName, mounted]);

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyShareLink = async () => {
    const url = encodeUrl(jsonInput, language, rootName);
    const fullUrl = `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const extensionMap: Record<Language, string> = {
      typescript: "ts",
      golang: "go",
      python: "py",
      java: "java",
      rust: "rs",
      csharp: "cs",
      swift: "swift",
      kotlin: "kt",
    };
    const ext = extensionMap[language];
    const filename = `${rootName.toLowerCase()}.${ext}`;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch { /* ignore */ }
  };

  const handleClear = () => {
    setJsonInput("");
    setOutput("");
    setError(null);
  };

  const handleImportFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          JSON.parse(content);
          setJsonInput(content);
          setError(null);
        } catch {
          setError({ message: "文件内容不是有效的 JSON", line: undefined, column: undefined });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleImportUrl = async () => {
    const url = prompt("请输入 JSON URL:");
    if (!url) return;
    try {
      const response = await fetch(url);
      const text = await response.text();
      JSON.parse(text);
      setJsonInput(text);
      setError(null);
    } catch (err: any) {
      setError({ message: `无法获取 URL 内容: ${err.message}`, line: undefined, column: undefined });
    }
  };

  const addToHistory = () => {
    if (!jsonInput.trim()) return;
    const newHistory = [jsonInput, ...history.filter(h => h !== jsonInput)].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const removeFromHistory = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const currentLang = LANGUAGES.find((l) => l.key === language);

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 flex-wrap">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setLanguage(lang.key)}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                language === lang.key
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold ${lang.color}`}>
                  {lang.icon}
                </span>
                <span className="hidden sm:inline">{lang.label}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showOptions
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            ⚙ {t.options}
          </button>
          <button
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) setHistory(loadHistory()); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showHistory
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            📋 {t.history}
          </button>
          <button
            onClick={handleFormat}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t.formatJson}
          </button>
          <button
            onClick={handleImportFile}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t.importFile}
          </button>
          <button
            onClick={handleImportUrl}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t.importUrl}
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            title={t.downloadCode}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.download}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t.clear}
          </button>
        </div>
      </div>

      {/* Options Panel */}
      {showOptions && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.rootName}:</label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {language === "typescript" && (
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tsUseType}
                  onChange={(e) => setTsUseType(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {t.useType}
              </label>
            )}

            {language === "java" && (
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={javaLombok}
                  onChange={(e) => setJavaLombok(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Lombok
              </label>
            )}

            {language === "golang" && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.tagStyle}:</label>
                <select
                  value={goTagStyle}
                  onChange={(e) => setGoTagStyle(e.target.value as any)}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="json">snake_case</option>
                  <option value="camel">camelCase</option>
                  <option value="none">{t.noTag}</option>
                </select>
              </div>
            )}

            {/* 序列化注解选项 - 支持的语言 */}
            {(language === "java" || language === "csharp" || language === "kotlin") && (
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serialAnnotation}
                  onChange={(e) => setSerialAnnotation(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {t.annotation}
              </label>
            )}

            {/* 可空类型选项 - 支持的语言 */}
            {(language === "typescript" || language === "csharp" || language === "kotlin") && (
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNullable}
                  onChange={(e) => setUseNullable(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {t.nullable}
              </label>
            )}
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.history}</span>
            <button
              onClick={addToHistory}
              className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              + {t.saveCurrent}
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">{t.noHistory}</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {history.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button
                    onClick={() => setJsonInput(item)}
                    className="flex-1 text-left text-xs text-gray-700 dark:text-gray-300 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.slice(0, 80).replace(/\n/g, " ")}...
                  </button>
                  <button
                    onClick={() => removeFromHistory(i)}
                    className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main editor area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* JSON Input */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700 min-h-[300px] md:min-h-0">
          <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.jsonInput}</span>
            <span className="text-xs text-gray-400">{jsonInput ? `${jsonInput.split("\n").length} ${t.lines}` : ""}</span>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <MonacoEditor
                height="100%"
                language="json"
                value={jsonInput}
                onChange={(val) => setJsonInput(val ?? "")}
                theme={monacoTheme}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 },
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Code Output */}
        <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0">
          <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {currentLang?.label} {t.output}
            </span>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <span className="text-xs text-gray-400 animate-pulse">{t.converting}</span>
              )}
              {output && (
                <>
                  <button
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    {shareCopied ? t.copied : t.share}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {t.copy}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {error ? (
              <div className="p-4 h-full flex items-start">
                <div className="flex items-start gap-2 text-red-500 dark:text-red-400">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{t.invalidJson}</p>
                    <p className="text-xs mt-0.5 text-red-400 dark:text-red-300">{error.message}</p>
                    {(error.line || error.column) && (
                      <p className="text-xs mt-1 text-red-400 dark:text-red-300 font-mono">
                        {t.atLocation} {error.line ? `${t.line} ${error.line}` : ""} {error.column ? `${t.column} ${error.column}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <MonacoEditor
                height="100%"
                language={currentLang?.monacoLang || "plaintext"}
                value={output}
                theme={monacoTheme}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  renderLineHighlight: "none",
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                  padding: { top: 12, bottom: 12 },
                  suggestOnTriggerCharacters: false,
                  quickSuggestions: false,
                  contextmenu: false,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
