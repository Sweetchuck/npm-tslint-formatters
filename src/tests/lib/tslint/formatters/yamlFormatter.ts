/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/yamlFormatter.
 */

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as Lint from 'tslint/lib/lint';
import * as YamlFormatter from '../../../../lib/tslint/formatters/yamlFormatter';

export let index: NodeUnit.ITestGroup = {

  'failure2Json': function (test: NodeUnit.Test): void {
    test.expect(1);

    let yamlFormatter: YamlFormatter.Formatter;
    let failure: Lint.RuleFailure | any;
    let expected: string = 'foo';

    yamlFormatter = new YamlFormatter.Formatter();

    failure = {
      toJson: function (): string {
        return expected;
      },
    };

    test.equal(
      expected,
      yamlFormatter.failure2Json(failure),
      ''
    );

    test.done();
  },

  'format': function (test: NodeUnit.Test): void {
    test.expect(1);

    let yamlFormatter: YamlFormatter.Formatter;

    yamlFormatter = new YamlFormatter.Formatter();
    test.equal(
      yamlFormatter.format([]),
      '---\nfailures: []\n',
      'Failure list is empty.'
    );

    test.done();
  },

};
