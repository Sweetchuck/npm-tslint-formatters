/**
 * @file
 * Documentation missing.
 */

declare module 'tslint-formatters' {

  import * as Path from 'path';
  import * as XmlBuilder from 'xmlbuilder';
  import * as Lint from 'tslint/lib/lint';

  export interface IFormattersIndex {

    checkstyle: Lint.IFormatter;

    checkstyleRelative: Lint.IFormatter;

    yaml: Lint.IFormatter;

  }

  export interface ICheckstyleDependencies {

    path?: typeof Path;

    xmlBuilder?: typeof XmlBuilder;

  }

  export interface ICheckstyleEntry {

    severity: string;

    source: string;

    line: number;

    column: number;

    message: string;

  }

  export interface IFailurePosition {

    character: number;

    line: number;

    position: number;

  }

  export interface IReportEntry {

    endPosition: IFailurePosition;

    failure: string;

    name: string;

    ruleName: string;

    startPosition: IFailurePosition;

  }

  export interface IYamlReport {

    failures: IReportEntry[];

  }

}
