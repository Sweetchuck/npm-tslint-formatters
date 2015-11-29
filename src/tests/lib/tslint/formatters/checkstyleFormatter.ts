/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/checkstyleFormatter.
 */

/// <reference path="../../../../typings/tsd.d.ts" />

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as FS from 'fs';
import * as Path from 'path';
import * as xmlBuilder from 'xmlbuilder';
import * as TslintFormatters from 'tslint-formatters';
import * as CheckstyleFormatter from '../../../../lib/tslint/formatters/checkstyleFormatter';

export var formatter: NodeUnit.ITestGroup = {

  'resolveFileName': function (test: NodeUnit.Test) : void {
    test.expect(1);

    var fileName: string;
    var checkstyleFormatter: CheckstyleFormatter.Formatter;

    checkstyleFormatter = new CheckstyleFormatter.Formatter();
    fileName = '.';
    test.equal(
      checkstyleFormatter.resolveFileName(fileName),
      Path.resolve(fileName),
      'Resolved'
    );

    test.done();
  },

  'format': function (test: NodeUnit.Test) : void {
    var checkstyleFormatter: CheckstyleFormatter.Formatter;

    checkstyleFormatter = new CheckstyleFormatter.Formatter({
      path: Path,
      xmlBuilder: xmlBuilder,
    });

    test.expect(1);

    test.equal(
      checkstyleFormatter.format([]),
      '<?xml version="1.0" encoding="UTF-8"?>\n<checkstyle/>\n',
      'Failure list is empty.'
    );

    test.done();
  },

  'process': function (test: NodeUnit.Test) : void {
    var pathPrefix: string = Path.resolve('.');
    var checkstyleFormatter: CheckstyleFormatter.Formatter;
    var c: number;
    var f: number;
    var fileName: string;
    var cases: {
      files: {
        [fileName: string]: TslintFormatters.ICheckstyleEntry[]
      },
      expected: string,
      message: string,
    }[] = [
      require('../../../../fixtures/checkstyle-definition')
    ];

    test.expect(cases.length);

    checkstyleFormatter = new CheckstyleFormatter.Formatter();
    for (c = 0; c < cases.length; c++) {
      checkstyleFormatter.processStart();
      for (fileName in cases[c].files) {
        if (cases[c].files.hasOwnProperty(fileName)) {
          for (f = 0; f < cases[c].files[fileName].length; f++) {
            checkstyleFormatter.processAddFailure(
              fileName,
              cases[c].files[fileName][f]
            );
          }
        }
      }

      test.equal(
        checkstyleFormatter.processEnd(),
        FS
          .readFileSync(cases[c].expected, {encoding: 'utf8'})
          .split('%path%')
          .join(pathPrefix + '/'),
        cases[c].message
      );
    }

    test.done();
  },

};
