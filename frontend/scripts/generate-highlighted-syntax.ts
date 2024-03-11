import { codeToHtml } from "shiki";
import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const codeFilePath = resolve(__dirname, "./code.py");

codeToHtml(readFileSync(codeFilePath, "utf-8"), {
  lang: "python",
  theme: "one-dark-pro",
}).then((html) => {
  // Store the html in json
  writeFileSync(resolve(__dirname, "../src/generated/code.html"), html);
});
