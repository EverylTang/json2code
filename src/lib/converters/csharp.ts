import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, isJsonObject, inferJsonType } from "./types";

export function convertToCSharp(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];
  const useNullable = options.useNullable || false;
  const useOptional = options.useOptional || false;
  const serialAnnotation = options.serialAnnotation || false;

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") {
      if (useNullable) return "object?";
      return "object";
    }
    if (t === "string") return useNullable ? "string?" : "string";
    if (t === "number") {
      const isInt = Number.isInteger(value);
      if (isInt) return useNullable ? "int?" : "int";
      return useNullable ? "double?" : "double";
    }
    if (t === "boolean") return useNullable ? "bool?" : "bool";

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "List<object>";

      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return `List<${name}>`;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return `List<${name}>`;
      }
      return `List<${convertValue(inner, key)}>`;
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value as Record<string, unknown>, name);
      typeStack.pop();
      return name;
    }

    return "object";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const lines: string[] = [];
    lines.push(`public class ${name}`);
    lines.push("{");

    Object.entries(obj).forEach(([key, value]) => {
      const csType = convertValue(value, key);
      const propName = toPascalCase(key);
      
      if (serialAnnotation) {
        lines.push(`    [JsonPropertyName("${key}")]`);
      }
      
      lines.push(`    public ${csType} ${propName} { get; set; }`);
    });

    lines.push("}");
    nestedTypes.push(lines.join("\n"));
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  const needsList = nestedTypes.some(t => t.includes("List<"));
  const imports = [];
  
  if (needsList) imports.push("using System.Collections.Generic;");
  if (serialAnnotation) imports.push("using System.Text.Json.Serialization;");
  
  if (imports.length > 0) {
    return { code: imports.join("\n") + "\n\n" + nestedTypes.join("\n\n") };
  }

  return { code: nestedTypes.join("\n\n") };
}
