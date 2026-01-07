import { SelectOption } from "../components/ui/CustomSelect";

export const toSelectOptions = <T>(
  data: T[],
  valueKey: keyof T,
  labelKey: keyof T
): SelectOption[] =>
  data
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => item[valueKey] != null && item[labelKey] != null
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
