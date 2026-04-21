export const formatRupee = (
  value: number | string | null | undefined,
): string => {
  if (value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return "";

  return num.toLocaleString("en-IN", {
    // minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatQuantity = (
  value: number | string | null | undefined,
): string => {
  if (value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return "";

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
