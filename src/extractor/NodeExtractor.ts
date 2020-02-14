import * as path from "path";
import { readJson } from "fs-extra";
import { IExtractor, Extractor } from "./Extractor";

export class NodeExtractor extends Extractor implements IExtractor {
  constructor() {
    super("node_modules");
  }

  async getDependencies(folder: string): Promise<string[]> {
    const fullPath = path.join(process.cwd(), folder, "package.json");
    const packageContents = await readJson(fullPath);
    const dependencies = Object.keys(packageContents.dependencies);
    return dependencies;
  }
}
