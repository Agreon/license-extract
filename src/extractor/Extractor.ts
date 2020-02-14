import * as path from "path";
import { readFile } from "fs-extra";
import { Logger } from "../util/Logger";

const LICENSE_NAMES = [
  "LICENSE.txt",
  "LICENSE.md",
  "LICENSE",
  "license.txt",
  "license.md",
  "license",
  "LICENSE-2.0.txt"
];

export interface IExtractor {
  dependenciesPath: string;
  getDependencies(folder: string): Promise<string[]>;
}

export class Extractor implements IExtractor {
  constructor(public dependenciesPath: string) {}

  public extractLicenses = async (folder: string) => {
    const dependencies = await this.getDependencies(folder);

    let text = "";
    for (const dependencyKey of dependencies) {
      text += await this.getTextForDependency(folder, dependencyKey);
    }

    Logger.success("Extraction Successful");

    return text;
  };

  getDependencies(folder: string): Promise<string[]> {
    throw new Error("Not implemented");
  }

  private async getLicenseForDependency(
    folder: string,
    dependencyKey: string
  ): Promise<string> {
    const dependencyPath = path.join(
      process.cwd(),
      folder,
      this.dependenciesPath,
      dependencyKey
    );
    for (const file of LICENSE_NAMES) {
      try {
        const content = await readFile(
          path.join(dependencyPath, file),
          "UTF-8"
        );
        return content;
        // tslint:disable-next-line: no-empty
      } catch (e) {}
    }
    Logger.warn(
      `No License-Text for dependency '${dependencyKey}' in '${dependencyPath}' found`
    );

    return "";
  }

  private getTextForDependency = async (
    folder: string,
    dependencyKey: string
  ) => {
    let text = "";
    text += `<h3>${dependencyKey}</h3>\n`;
    text += `<div data-markdown="1" class="license-wrapper">\n`;
    text += `${await this.getLicenseForDependency(folder, dependencyKey)}\n`;
    text += `</div>\n`;
    return text;
  };
}
