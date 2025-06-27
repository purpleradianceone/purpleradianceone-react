import { DynamicFieldOption } from "../DynamicFieldsContext";

export type PlaceholderItem = {
  isactive: boolean;
  name: string;
  id: number;
  email_type_id: number;
};
export function convertPlaceholdersToFields(
  data: PlaceholderItem[]
): DynamicFieldOption[] {
  return data.map((item) => ({
    label: item.name.replace(/{{|}}/g, ""), // Remove {{}} only for display
    value: item.name, // Keep original {{}} for value
  }));
}
export function convertPlaceholdersToObject(data: PlaceholderItem[]): Record<string, string> {
  const result: Record<string, string> = {};

  data.forEach((item) => {
    result[item.name] = item.name;
  });
  return result;
}
