import * as path from "path";
import { readJson } from "fs-extra";
import { IExtractor, Extractor } from "./Extractor";

export class PHPExtractor extends Extractor implements IExtractor {
  constructor() {
    super("vendor");
  }

  async getDependencies(folder: string): Promise<string[]> {
    const fullPath = path.join(process.cwd(), folder, "composer.json");
    const composerContents = await readJson(fullPath);
    const dependencies = Object.keys(composerContents.require).filter(
      k => !k.includes("ext-") && k !== "php"
    );
    return dependencies;
  }
}
