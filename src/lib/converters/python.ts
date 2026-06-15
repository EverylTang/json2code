import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, isJsonObject, inferJsonType } from "./types";

export function convertToPython(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];
  const useNullable = options.useNullable || false;
  const useOptional = options.useOptional || false;

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") {
      if (useNullable) return "Optional[Any]";
      return "Any";
    }
    if (t === "string") return "str";
    if (t === "number") {
      if (Number.isInteger(value)) return "int";
      return "float";
    }
    if (t === "boolean") return "bool";

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "List[Any]";

      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return `List[${name}]`;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return `List[${name}]`;
      }
      return `List[${convertValue(inner, key)}]`;
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value, name);
      typeStack.pop();
      return name;
    }

    return "Any";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const fields = Object.entries(obj).map(([key, value]) => {
      const pyType = convertValue(value, key);
      const fieldName = toCamelCase(key);
      const isNullable = value === null || value === undefined;
      const optional = useOptional && isNullable;
      const fieldDef = optional ? `${fieldName}: ${pyType} = None` : `${fieldName}: ${pyType}`;
      return `  ${fieldDef}`;
    });

    const def = [`class ${name}:`, ...fields].join("\n");
    nestedTypes.push(def);
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  const needsOptional = useOptional && nestedTypes.some(t => t.includes("= None"));
  const needsList = nestedTypes.some(t => t.includes("List["));
  const needsAny = nestedTypes.some(t => t.includes("Any"));
  const needsOptionalType = needsOptional || (useNullable && nestedTypes.some(t => t.includes("Optional[")));

  const imports = ["from dataclasses import dataclass"];
  
  if (needsList || needsOptionalType || needsAny) {
    const typingImports: string[] = [];
    if (needsList) typingImports.push("List");
    if (needsOptionalType) typingImports.push("Optional");
    if (needsAny) typingImports.push("Any");
    imports.push(`from typing import ${typingImports.join(", ")}`);
  }

  return { code: imports.join("\n") + "\n\n" + nestedTypes.join("\n\n") };
}
