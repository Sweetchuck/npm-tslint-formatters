/**
 * @file
 * Documentation missing.
 */

/// <reference path="../../../typings/tsd.d.ts" />

import * as Tslint from 'tslint/lib/lint';
import * as Path from 'path';
import * as XmlBuilder from 'xmlbuilder';
import * as TslintFormatters from 'tslint-formatters';

export class Formatter extends Tslint.Formatters.AbstractFormatter {

  protected absoluteFileName: boolean;

  protected path: typeof Path;

  protected xmlBuilder: typeof XmlBuilder;

  protected xmlHeaderAttributes: XmlBuilder.IHeaderAttributes;

  protected xmlCreateOptions: XmlBuilder.ICreateOptions;

  protected xmlCreateSettings: XmlBuilder.ICreateSettings;

  protected xmlEndOptions: XmlBuilder.IEndOptions;

  protected xml: XmlBuilder.IElement = null;

  protected files: {[fileName: string] : XmlBuilder.IElement};

  constructor(
    dependencies?: TslintFormatters.ICheckstyleDependencies
  ) {
    super();

    this.initDependencies(dependencies);
    this.initProperties();
  }

  public resolveFileName: {
    (
      fileName: string
    ) : string
  } = (
    fileName: string
  ) : string => {
    return this.absoluteFileName ? this.path.resolve(fileName) : fileName;
  };

  public processStart: {() : void} = () => {
    this.xml = this.xmlBuilder.create(
      'checkstyle',
      this.xmlHeaderAttributes,
      this.xmlCreateOptions,
      this.xmlCreateSettings
    );
  };

  public processAddFailure: {
    (
      fileName: string,
      entry: TslintFormatters.ICheckstyleEntry
    ) : void,
  } = (
    fileName: string,
    entry: TslintFormatters.ICheckstyleEntry
  ) => {
    fileName = this.resolveFileName(fileName);

    if (!this.files.hasOwnProperty(fileName)) {
      this.files[fileName] = this.xml.ele('file', {name: fileName});
    }

    this.files[fileName].ele('error', {
      line: entry.line,
      column: entry.column,
      severity: entry.severity,
      source: entry.source,
      message: entry.message,
    });
  };

  public processEnd: {() : string} = () => {
    return this.xml.end(this.xmlEndOptions) + '\n';
  };

  public format(failures: Tslint.RuleFailure[]) : string {
    var i: number;

    this.processStart();

    for (i = 0; i < failures.length; i++) {
      this.processAddFailure(
        failures[i].getFileName(),
        {
          line: failures[i].getStartPosition().getLineAndCharacter().line,
          column: failures[i].getStartPosition().getLineAndCharacter().character,
          severity: 'error',
          source: failures[i].getRuleName(),
          message: failures[i].getFailure(),
        }
      );
    }

    return this.processEnd();
  }

  protected initDependencies(
    d?: TslintFormatters.ICheckstyleDependencies
  ) : void {
    if (typeof d === 'undefined') {
      d = {};
    }

    this.path = (d.hasOwnProperty('path') && d.path) ? d.path : require('path');
    this.xmlBuilder = (d.hasOwnProperty('xmlBuilder') && d.xmlBuilder) ? d.xmlBuilder : require('xmlbuilder');
  };

  protected initProperties() : void {
    this.absoluteFileName = true;

    this.xmlHeaderAttributes = {
      version: '1.0',
      encoding: 'UTF-8',
    };

    this.xmlCreateOptions = {};

    this.xmlCreateSettings = {};

    this.xmlEndOptions = {
      pretty: true,
      indent: '  ',
      newline: '\n',
    };

    this.xml = null;

    this.files = {};
  }

}
