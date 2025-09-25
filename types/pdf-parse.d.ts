declare module "pdf-parse/lib/pdf-parse.js" {
  import { Buffer } from "buffer";

  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: any;
    version: string;
    text: string;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: Record<string, any>
  ): Promise<PDFInfo>;

  export = pdfParse;
}
