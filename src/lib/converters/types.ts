/** Shared type definitions for JSON to code converters */

export interface ConvertOptions {
  /** Name of the root type */
  rootName?: string;
  /** Whether to use optional fields for nullable values */
  useOptional?: boolean;
  /** TypeScript: use 'type' alias instead of 'interface' */
  tsUseType?: boolean;
  /** Java: generate Lombok annotations instead of getters/setters */
  javaLombok?: boolean;
  /** Go: struct tag format - "json", "snake", "camel", "none" */
  goTagStyle?: "json" | "snake" | "camel" | "none";
  /** C#: generate properties with { get; set; } or fields */
  csharpProperties?: boolean;
  /** Enable serialization annotations (e.g., @JsonProperty, @SerializedName) */
  serialAnnotation?: boolean;
  /** Use nullable types instead of any/null */
  useNullable?: boolean;
}

export interface ConverterResult {
  code: string;
  error?: string;
}

/** Infer JSON value type name */
export function inferJsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Get a safe identifier from a key name */
export function toPascalCase(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .split(/[_-\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}

export function toCamelCase(key: string): string {
  const pascal = toPascalCase(key);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .replace(/[-\s]+/g, "_")
    .toLowerCase()
    .replace(/^[-_]/, "");
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .replace(/[_\s]+/g, "-")
    .toLowerCase()
    .replace(/^[-_]/, "");
}

/** Check if a value looks like a JSON object (plain object, not array/null) */
export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Generate a tag value from a key based on style */
export function tagForStyle(key: string, style: string): string {
  switch (style) {
    case "snake":
      return toSnakeCase(key);
    case "camel":
      return toCamelCase(key);
    case "json":
    default:
      return toSnakeCase(key); // json default is snake_case
  }
}
