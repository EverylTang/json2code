import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, toSnakeCase, isJsonObject, inferJsonType, tagForStyle } from "./types";

export function convertToGo(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];
  const tagStyle = options.goTagStyle || "json";

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") return "interface{}";
    if (t === "string") return "string";
    if (t === "number") return "float64";
    if (t === "boolean") return "bool";

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "[]interface{}";

      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return "[]" + name;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return "[]" + name;
      }
      return "[]" + convertValue(inner, key);
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value, name);
      typeStack.pop();
      return name;
    }

    return "interface{}";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const fields = Object.entries(obj).map(([key, value]) => {
      const goType = convertValue(value, key);
      const fieldName = toPascalCase(key);
      const tagValue = tagForStyle(key, tagStyle);
      const tag = tagStyle === "none" ? "" : ` \`json:"${tagValue}"\``;
      return `  ${fieldName} ${goType}${tag}`;
    });

    const def = [`type ${name} struct {`, ...fields, `}`].join("\n");
    nestedTypes.push(def);
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  return { code: nestedTypes.join("\n\n") };
}
