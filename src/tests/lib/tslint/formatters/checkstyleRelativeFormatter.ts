/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/checkstyleRelativeFormatter.
 */

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as FS from 'fs';
import * as TslintFormatters from 'tslint-formatters';
import * as CheckstyleFormatter from '../../../../lib/tslint/formatters/checkstyleRelativeFormatter';

export let formatter: NodeUnit.ITestGroup = {

  'resolveFileName': function (test: NodeUnit.Test): void {
    test.expect(1);

    let fileName: string;
    let checkstyleFormatter: CheckstyleFormatter.Formatter;

    checkstyleFormatter = new CheckstyleFormatter.Formatter();
    fileName = '.';
    test.equal(
      checkstyleFormatter.resolveFileName(fileName),
      fileName,
      'Resolved'
    );

    test.done();
  },

  'format': function (test: NodeUnit.Test): void {
    let checkstyleFormatter: CheckstyleFormatter.Formatter;

    checkstyleFormatter = new CheckstyleFormatter.Formatter();

    test.expect(1);

    test.equal(
      checkstyleFormatter.format([]),
      '<?xml version="1.0" encoding="UTF-8"?>\n<checkstyle/>\n',
      'Failure list is empty.'
    );

    test.done();
  },

  'process': function (test: NodeUnit.Test): void {
    let checkstyleFormatter: CheckstyleFormatter.Formatter;
    let c: number;
    let f: number;
    let fileName: string;
    let cases: {
      files: {
        [fileName: string]: TslintFormatters.ICheckstyleEntry[]
      },
      expected: string,
      message: string,
    }[] = [
      require('../../../../fixtures/checkstyle-definition'),
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
          .join(''),
        cases[c].message
      );
    }

    test.done();
  },

};
