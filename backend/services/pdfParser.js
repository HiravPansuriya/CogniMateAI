import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

// Polyfill for PDF.js in Node.js
if (typeof global.DOMMatrix === "undefined") {
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}

if (typeof global.ImageData === "undefined") {
  global.ImageData = class ImageData {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  };
}

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF");
  }
};
