import { ConvertOptions, ConverterResult, toPascalCase, toCamelCase, toSnakeCase, isJsonObject, inferJsonType } from "./types";

export function convertToJava(
  json: Record<string, unknown>,
  options: ConvertOptions = {}
): ConverterResult {
  const nestedTypes: string[] = [];
  const typeStack: string[] = [];
  const useLombok = options.javaLombok || false;
  const serialAnnotation = options.serialAnnotation || false;

  function convertValue(value: unknown, key: string): string {
    const t = inferJsonType(value);

    if (t === "null") return "Object";
    if (t === "string") return "String";
    if (t === "boolean") return "boolean";

    if (t === "number") {
      if (typeof value === "number" && Number.isInteger(value)) return "int";
      return "double";
    }

    if (t === "array") {
      const arr = value as unknown[];
      if (arr.length === 0) return "List<Object>";

      const inner = arr[0];
      if (isJsonObject(inner)) {
        const name = toPascalCase(key) + "Item";
        if (typeStack.includes(name)) return `List<${name}>`;
        typeStack.push(name);
        convertObject(inner, name);
        typeStack.pop();
        return `List<${name}>`;
      }

      const elemType = convertValue(inner, key);
      const boxed = elemType === "int" ? "Integer" : elemType === "double" ? "Double" : elemType === "boolean" ? "Boolean" : elemType;
      return `List<${boxed}>`;
    }

    if (isJsonObject(value)) {
      const name = toPascalCase(key);
      if (typeStack.includes(name)) return name;
      typeStack.push(name);
      convertObject(value as Record<string, unknown>, name);
      typeStack.pop();
      return name;
    }

    return "Object";
  }

  function convertObject(obj: Record<string, unknown>, name: string): void {
    const indent = "    ";
    const lines: string[] = [];

    if (useLombok) {
      lines.push("@Data");
    }

    lines.push(`public class ${name} {`);

    const fields = Object.entries(obj).map(([key, value]) => {
      const javaType = convertValue(value, key);
      const fieldName = toCamelCase(key);
      return { type: javaType, name: fieldName, originalKey: key };
    });

    for (const f of fields) {
      if (serialAnnotation) {
        lines.push(`${indent}@JsonProperty("${f.originalKey}")`);
      }
      lines.push(`${indent}private ${f.type} ${f.name};`);
    }

    if (!useLombok) {
      lines.push("");
      lines.push(`${indent}public ${name}() {}`);

      for (const f of fields) {
        const getterName = (f.type === "boolean" ? "is" : "get") + f.name.charAt(0).toUpperCase() + f.name.slice(1);
        const setterName = "set" + f.name.charAt(0).toUpperCase() + f.name.slice(1);

        lines.push("");
        lines.push(`${indent}public ${f.type} ${getterName}() {`);
        lines.push(`${indent}    return ${f.name};`);
        lines.push(`${indent}}`);
        lines.push("");
        lines.push(`${indent}public void ${setterName}(${f.type} ${f.name}) {`);
        lines.push(`${indent}    this.${f.name} = ${f.name};`);
        lines.push(`${indent}}`);
      }
    }

    lines.push("}");
    nestedTypes.push(lines.join("\n"));
  }

  const rootName = options.rootName || "Root";
  convertObject(json, rootName);

  const needsList = nestedTypes.some((t) => t.includes("List<"));
  const imports = [];

  if (needsList) imports.push("import java.util.List;");
  if (serialAnnotation) imports.push("import com.fasterxml.jackson.annotation.JsonProperty;");
  if (useLombok) imports.push("import lombok.Data;");

  if (imports.length > 0) {
    return { code: imports.join("\n") + "\n\n" + nestedTypes.join("\n\n") };
  }

  return { code: nestedTypes.join("\n\n") };
}
