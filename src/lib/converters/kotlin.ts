import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, isJsonObject, inferJsonType } from "./types";

export function convertToKotlin(
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
      if (useNullable) return "Any?";
      return "Any";
    }
    if (t === "string") return useNullable ? "String?" : "String";
    if (t === "number") {
      const isInt = Number.isInteger(value);
      if (isInt) return useNullable ? "Int?" : "Int";
      return useNullable ? "Double?" : "Double";
    }
    if (t === "boolean") return useNullable ? "Boolean?" : "Boolean";

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "List<Any>";

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

    return "Any";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const lines: string[] = [];
    lines.push(`data class ${name}(`);

    const fields = Object.entries(obj).map(([key, value]) => {
      const ktType = convertValue(value, key);
      const fieldName = toCamelCase(key);
      const isNullable = value === null || value === undefined;
      const optional = useOptional && isNullable;
      const defaultValue = optional ? " = null" : "";
      
      const annotations: string[] = [];
      if (serialAnnotation) {
        annotations.push(`    @SerialName("${key}")`);
      }
      
      const annotationStr = annotations.length > 0 ? annotations.join("\n") + "\n" : "";
      return `${annotationStr}    val ${fieldName}: ${ktType}${defaultValue}`;
    });

    lines.push(fields.join(",\n"));
    lines.push(")");
    nestedTypes.push(lines.join("\n"));
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  const imports = [];
  
  if (nestedTypes.some(t => t.includes("List<"))) {
    imports.push("import kotlinx.serialization.Serializable");
    imports.push("import kotlinx.serialization.SerialName");
  }
  
  if (imports.length > 0) {
    return { code: imports.join("\n") + "\n\n" + nestedTypes.join("\n\n") };
  }

  return { code: nestedTypes.join("\n\n") };
}
