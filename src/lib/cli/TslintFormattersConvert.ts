/**
 * @file
 * Documentation missing.
 */

/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

import * as FS from 'fs';
import * as Path from 'path';
import * as mkDir from 'mkdirp';
import * as TslintFormatters from 'tslint-formatters';
import * as CheckstyleAbs from '../tslint/formatters/checkstyleFormatter';
import * as CheckstyleRel from '../tslint/formatters/checkstyleRelativeFormatter';

export class Option {

  public name: string = null;

  public nameShort: string = null;

  public description: string = null;

  public validator: string = 'string';

  public defaultValue: any = null;

  public value: any = null;

  protected properties: string[] = [
    'defaultValue',
    'description',
    'name',
    'nameShort',
    'validator',
  ];

  constructor(
    values?: {[name: string]: any}
  ) {
    if (typeof values !== 'undefined') {
      var i: number;
      var propertyName: string;
      for (i = 0; i < this.properties.length; i++) {
        propertyName = this.properties[i];
        /* istanbul ignore else */
        if (values.hasOwnProperty(propertyName)) {
          this[propertyName] = values[propertyName];
        }
      }
    }
  }

}

export class OptionString extends Option {

  public defaultValue: string;

  public value: string;

}

export class Handler {

  public options: {
    out: OptionString,
  } = {
    out: new OptionString({
      defaultValue: null,
      description: 'A filename to output the results to. By default, ' +
        'tslint-formatters-convert outputs to stdout, which is usually the ' +
        'console where you are running it from.',
      name: 'out',
      nameShort: 'o',
    }),
  };

  public commands: {
    [name: string]: string;
  } = {
    yaml2checkstyle: 'Convert YAML report to Checkstyle with absolute file paths.',
    yaml2checkstyleRelative: 'Convert YAML report to Checkstyle with relative file paths.',
    checkstyle2checkstyle: 'Fix the multi-document problem with string replace.',
  };

  protected fs: typeof FS;

  protected path: typeof Path;

  protected cli: ICli;

  protected jsYaml: typeof jsyaml;

  protected formatter: CheckstyleAbs.Formatter = null;

  protected cliArgs: string[] = [];

  constructor(
    fs: typeof FS,
    path: typeof Path,
    cli: ICli,
    jsYaml: typeof jsyaml
  ) {
    this.fs = fs;
    this.path = path;
    this.cli = cli;
    this.jsYaml = jsYaml;

    this.cli.enable('help', 'version');
  }

  /**
   * Convert the internal structure of CLI options to the one which is suitable
   * for CLI.
   */
  public optionDefinitions: {(): CLIOptionDefinitions} = (): CLIOptionDefinitions => {
    var options: CLIOptionDefinitions = {};
    var name: string;
    var option: Option;
    for (name in this.options) {
      /* istanbul ignore else */
      if (this.options.hasOwnProperty(name)) {
        option = this.options[name];
        options[option.name] = [
          option.nameShort,
          option.description,
          option.validator,
          option.defaultValue,
        ];
      }
    }

    return options;
  };

  public main: CLIMainCommandCallback = (
    args: string[],
    options: {[name: string]: string | number | boolean}
  ) => {
    this.cliArgs = args;

    var optionName: string;
    for (optionName in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(optionName)) {
        this.options[optionName].value = options[optionName];
      }
    }

    switch (this.cli.command) {
      case 'yaml2checkstyle':
        this.cmdYaml2Checkstyle();
        break;

      case 'yaml2checkstyleRelative':
        this.cmdYaml2CheckstyleRelative();
        break;

      case 'checkstyle2checkstyle':
        this.cmdCheckstyle2Checkstyle();
        break;

    }
  };

  public cmdYaml2Checkstyle: {(): void} = (): void => {
    this.formatter = new CheckstyleAbs.Formatter();
    this.convertYaml2Checkstyle();
  };

  public cmdYaml2CheckstyleRelative: {(): void} = (): void => {
    this.formatter = new CheckstyleRel.Formatter();
    this.convertYaml2Checkstyle();
  };

  public cmdCheckstyle2Checkstyle: {(): void} = (): void => {
    var delimiter: string = [
      '</checkstyle>',
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<checkstyle>',
      '',
    ].join('\n');

    this.release(
      this
        .readInput()
        .split(delimiter)
        .join('')
    );
  };

  /**
   * @access protected
   */
  public convertYaml2Checkstyle: {() : void} = () => {
    this.formatter.processStart();

    this.jsYaml.safeLoadAll(
      this.readInput(),
      this.addReportToCheckstyle
    );

    this.release(this.formatter.processEnd());
  };

  /**
   * @access protected
   */
  public addReportToCheckstyle: {
    (
      report: TslintFormatters.IYamlReport
    ) : void
  } = (
    report: TslintFormatters.IYamlReport
  ) : void => {
    var f: number;
    for (f = 0; f < report.failures.length; f++) {
      this.formatter.processAddFailure(
        report.failures[f].name,
        {
          line: report.failures[f].startPosition.line,
          column: report.failures[f].startPosition.character,
          severity: 'error',
          source: report.failures[f].ruleName,
          message: report.failures[f].failure,
        }
      );
    }
  };

  /**
   * @access protected
   */
  public readInput: {() : string} = () : string => {
    // @todo OS independent.
    return this
      .fs
      .readFileSync(
        (this.cliArgs.length ? this.cliArgs[0] : '/dev/stdin'),
        'utf8'
      )
      .toString();
  };

  /**
   * @access protected
   */
  public release: {
    (
      output: string
    ) : void
  } = (
    output: string
  ) : void => {
    if (this.options.out.value) {
      this.prepareDirectory(this.options.out.value);
      this.fs.writeFileSync(
        this.options.out.value,
        output
      );
    }
    else {
      this.cli.output(output);
    }
  };

  /**
   * @access protected
   */
  public prepareDirectory: {
    (
      fileName: string
    ) : void
  } = (
    fileName: string
  ) : void => {
    var dirName: string = this.path.dirname(fileName);

    if (!this.fs.existsSync(dirName)) {
      mkDir.sync(dirName);
    }
  };

}
