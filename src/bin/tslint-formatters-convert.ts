/**
 * @file
 * Documentation missing.
 */

import fs = require('fs');
import path = require('path');
import cli = require('cli');
import jsYaml = require('js-yaml');
import * as Convert from '../lib/cli/TslintFormattersConvert';

let handler: Convert.Handler = new Convert.Handler(fs, path, cli, jsYaml);

cli.parse(handler.optionDefinitions(), handler.commands);
cli.main(handler.main);
