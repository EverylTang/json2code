import {
  ConvertOptions,
  ConverterResult,
  toPascalCase,
  toCamelCase,
  isJsonObject,
  inferJsonType,
} from "./types";

export function convertToSwift(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") return "Any";
    if (t === "string") return "String";
    if (t === "boolean") return "Bool";
    if (t === "number") {
      if (typeof value === "number" && Number.isInteger(value)) return "Int";
      return "Double";
    }

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "[Any]";
      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return `[${name}]`;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return `[${name}]`;
      }
      return `[${convertValue(inner, key)}]`;
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
    lines.push(`struct ${name}: Codable {`);

    const needsAnyCodingKey = Object.entries(obj).some(([key]) => {
      const fieldName = toCamelCase(key);
      return fieldName !== key;
    });

    if (needsAnyCodingKey) {
      Object.entries(obj).forEach(([key, value]) => {
        const swiftType = convertValue(value, key);
        const fieldName = toCamelCase(key);
        lines.push(`  let ${fieldName}: ${swiftType}`);
      });
      
      lines.push("");
      lines.push(`  enum CodingKeys: String, CodingKey {`);
      Object.entries(obj).forEach(([key, value]) => {
        const fieldName = toCamelCase(key);
        if (fieldName !== key) {
          lines.push(`    case ${fieldName} = "${key}"`);
        }
      });
      lines.push(`  }`);
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const swiftType = convertValue(value, key);
        const fieldName = toCamelCase(key);
        lines.push(`  let ${fieldName}: ${swiftType}`);
      });
    }

    lines.push(`}`);
    nestedTypes.push(lines.join("\n"));
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  return { code: nestedTypes.join("\n\n") };
}
