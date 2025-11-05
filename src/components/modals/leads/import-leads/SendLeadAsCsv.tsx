// utils/convertPayloadToCsv.ts
import Papa from "papaparse";

interface Lead {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mappedData: Record<string, any>;
}

interface Payload {
  leadsToImport: Lead[];
}

/**
 * Converts payload.leadsToImport into a CSV File
 * @param payload - JSON payload containing leadsToImport
 * @returns CSV File object (can be sent to backend or downloaded)
 */
export function convertPayloadToCsv(payload: Payload): File {
  if (!payload || !payload.leadsToImport?.length) {
    throw new Error("Payload is empty or invalid");
  }

  // ✅ Step 1: Flatten mappedData
  const flattenedLeads = payload.leadsToImport.map((lead) => lead.mappedData);

  // ✅ Step 2: Convert to CSV using Papa Parse
  const csvString = Papa.unparse(flattenedLeads);

  // ✅ Step 3: Create a File object (CSV)
  const csvFile = new File([csvString], "leads.csv", {
    type: "text/csv;charset=utf-8;",
  });

  return csvFile;
}
