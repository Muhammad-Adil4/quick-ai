interface PDFInfo {
  numpages: number;
  numrender: number;
  info: Record<string, unknown>;  // any → unknown
  metadata: unknown;              // any → unknown
  version: string;
  text: string;
}

function pdfParse(
  dataBuffer: Buffer,
  options?: Record<string, unknown>   // any → unknown
): Promise<PDFInfo>;
