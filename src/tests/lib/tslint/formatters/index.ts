/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/index.
 */

/// <reference path="../../../../typings/tsd.d.ts" />

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as FS from 'fs';
import * as TSLintFormatter from 'tslint-formatters';

export var index: NodeUnit.ITestGroup = {

  'include': function (test: NodeUnit.Test): void {
    test.expect(3);

    var propertyName: string;
    var idx: TSLintFormatter.IFormattersIndex = require('../../../../lib/tslint/formatters/index');

    var files: string[] = FS.readdirSync('lib/tslint/formatters');
    var f: number;

    for (f = 0; f < files.length; f++) {
      if (files[f] === 'index.js') {
        continue;
      }

      propertyName = files[f].replace(/Formatter\.js$/, '');
      test.equal(
        idx.hasOwnProperty(propertyName),
        true,
        'Formatter "' + propertyName + '" exposed.'
      );
    }

    test.done();
  },

};
