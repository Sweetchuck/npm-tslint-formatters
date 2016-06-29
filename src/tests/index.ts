/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/index.
 */

/// <reference path="../typings/tsd.d.ts" />

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';

export var index: NodeUnit.ITestGroup = {

  'include': function (test: NodeUnit.Test): void {
    test.expect(1);

    test.equal(
      JSON.stringify(require('../index'), null, 2),
      JSON.stringify(
        {
          checkstyle: {},
          checkstyleRelative: {},
          yaml: {},
        },
        null,
        2
      ),
      ''
    );

    test.done();
  },

};
