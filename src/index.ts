import * as minimist from "minimist";
import * as showdown from "showdown";
import { NodeExtractor } from "./extractor/NodeExtractor";
import { PHPExtractor } from "./extractor/PHPExtractor";
import { writeFile } from "fs-extra";
import { Logger } from "./util/Logger";

const converter = new showdown.Converter({
  // So that big headers from the licenses are not that big
  headerLevelStart: 3,
  simpleLineBreaks: true
});

const execute = async () => {
  const args = minimist(process.argv.slice(2));

  let text = "";

  if (args.node) {
    Logger.info(`Extracting Node licenses from '${args.node}'`);

    const extractor = new NodeExtractor();
    text += await extractor.extractLicenses(args.node);
  }

  if (args.php) {
    Logger.info(`Extracting PHP licenses from '${args.php}'`);

    const extractor = new PHPExtractor();
    text += await extractor.extractLicenses(args.php);
  }

  const html = converter.makeHtml(text);

  if (args.out) {
    await writeFile(args.out, html);
    Logger.success(`Written converted html to '${args.out}'`);
  } else {
    console.log(html);
  }
};

// tslint:disable-next-line: no-floating-promises
execute();
