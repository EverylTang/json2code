import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, isJsonObject, inferJsonType } from "./types";

export function convertToTypeScript(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];
  const useType = options.tsUseType || false;
  const useNullable = options.useNullable || false;
  const useOptional = options.useOptional || false;

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") {
      if (useNullable) return "null";
      return "any";
    }
    if (t === "string") return "string";
    if (t === "number") return "number";
    if (t === "boolean") return "boolean";

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "any[]";

      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return name + "[]";
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return name + "[]";
      }
      return convertValue(inner, key) + "[]";
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value, name);
      typeStack.pop();
      return name;
    }

    return "any";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const fields = Object.entries(obj).map(([key, value]) => {
      const tsType = convertValue(value, key);
      const isNullable = value === null || value === undefined;
      const optional = useOptional && isNullable;
      const nullable = useNullable && isNullable;
      const finalType = nullable && tsType !== "null" ? `${tsType} | null` : tsType;
      return `  ${toCamelCase(key)}${optional ? "?" : ""}: ${finalType};`;
    });

    const keyword = useType ? "type" : "interface";
    const def = useType
      ? [`${keyword} ${name} = {`, ...fields, `};`].join("\n")
      : [`${keyword} ${name} {`, ...fields, `}`].join("\n");
    nestedTypes.push(def);
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  return { code: nestedTypes.join("\n\n") };
}
