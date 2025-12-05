import Papa from "papaparse";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToCsvFile = (rows: any[], filename = "data.csv"): File => {
  if (!rows || rows.length === 0) {
    throw new Error("No data provided to convertToCsvFile");
  }

  // Dynamically detect arrays and stringify them
  const formatted = rows.map((row) => {
    const newRow: Record<string, unknown> = {};
    Object.entries(row).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        newRow[key] = value.join(","); 
      } else {
        newRow[key] = value ?? ""; 
      }
    });
    return newRow;
  });

  const csv = Papa.unparse(formatted, { header: true });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  return new File([blob], filename, { type: "text/csv" });
};
