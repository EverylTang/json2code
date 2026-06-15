import {
  ConvertOptions,
  ConverterResult,
  toPascalCase,
  toSnakeCase,
  isJsonObject,
  inferJsonType,
} from "./types";

export function convertToRust(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") return "serde_json::Value";
    if (t === "string") return "String";
    if (t === "boolean") return "bool";
    if (t === "number") {
      if (typeof value === "number" && Number.isInteger(value)) return "i64";
      return "f64";
    }

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "Vec<serde_json::Value>";
      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return `Vec<${name}>`;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return `Vec<${name}>`;
      }
      return `Vec<${convertValue(inner, key)}>`;
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value as Record<string, unknown>, name);
      typeStack.pop();
      return name;
    }

    return "serde_json::Value";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const lines: string[] = [];
    lines.push("#[derive(Debug, Clone, Serialize, Deserialize)]");
    lines.push(`pub struct ${name} {`);

    const fields = Object.entries(obj).map(([key, value]) => {
      const rustType = convertValue(value, key);
      const fieldName = toSnakeCase(key);
      const needsRename = fieldName !== key;
      if (needsRename) {
        return `  #[serde(rename = "${key}")]\n  pub ${fieldName}: ${rustType},`;
      }
      return `  pub ${fieldName}: ${rustType},`;
    });

    lines.push(...fields);
    lines.push("}");
    nestedTypes.push(lines.join("\n"));
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  return { code: nestedTypes.join("\n\n") };
}
