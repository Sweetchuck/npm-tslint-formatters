/**
 * @file
 * NodeUnit tests for lib/cli/TslintFormattersConvert.
 */

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as TslintFormatterConvert from '../../lib/cli/TslintFormattersConvert';
import * as FS from 'fs';
import * as Path from 'path';
import * as mkDir from 'mkdirp';
import * as JsYaml from 'js-yaml';

var context: {
  fixturesDir: string,
  mockCliOutput: (output: string) => void,
  mockCliOutputResult: string,
};

context = {
  fixturesDir: Path.join('tmp', 'fixtures', 'TslintFormattersConvert'),
  mockCliOutputResult: '',
  mockCliOutput: function (
    message?: any,
    ...optionalParams: any[]
  ): void {
    context.mockCliOutputResult += message;
  },
};

export var option: NodeUnit.ITestGroup = {

  'constructor': function (test: NodeUnit.Test): void {
    test.expect(7);

    var myOption: TslintFormatterConvert.Option;

    myOption = new TslintFormatterConvert.Option();
    test.equal(myOption.name, null, 'After create the default values are empty.');

    myOption = new TslintFormatterConvert.Option({
      name: 'format',
      nameShort: 'f',
      description: 'My description',
      validator: 'string',
      defaultValue: 'json',
      unknownProperty: 'foo',
    });
    test.equal(myOption.name, 'format', 'Value of "name" is correct');
    test.equal(myOption.nameShort, 'f', 'Value of "nameShort" is correct');
    test.equal(myOption.description, 'My description', 'Value of "description" is correct');
    test.equal(myOption.validator, 'string', 'Value of "validator" is correct');
    test.equal(myOption.defaultValue, 'json', 'Value of "defaultValue" is correct');
    test.equal(myOption.hasOwnProperty('unknownProperty'), false, 'Unknown property ignored.');

    test.done();
  },

};

export var optionString: NodeUnit.ITestGroup = {

  'constructor': function (test: NodeUnit.Test): void {
    test.expect(7);

    var myOption: TslintFormatterConvert.OptionString;

    myOption = new TslintFormatterConvert.OptionString();
    test.equal(myOption.name, null, 'After create the default values are empty.');

    myOption = new TslintFormatterConvert.OptionString({
      name: 'format',
      nameShort: 'f',
      description: 'My description',
      validator: 'string',
      defaultValue: 'json',
    });
    test.equal(myOption.name, 'format', 'Value of "name" is correct');
    test.equal(myOption.nameShort, 'f', 'Value of "nameShort" is correct');
    test.equal(myOption.description, 'My description', 'Value of "description" is correct');
    test.equal(myOption.validator, 'string', 'Value of "validator" is correct');
    test.equal(myOption.defaultValue, 'json', 'Value of "defaultValue" is correct');
    test.equal(myOption.hasOwnProperty('unknownProperty'), false, 'Unknown property ignored.');

    test.done();
  },

};

export var handler: NodeUnit.ITestGroup = {

  setUp: (callback: NodeUnit.ICallbackFunction): void => {
    var paths: string[][] = [
      ['report', 'checkstyle.xml'],
      ['release', '1', 'checkstyle.xml'],
    ];

    var p: number;
    var fileName: string;
    for (p = 0; p < paths.length; p++) {
      while (paths[p].length) {
        fileName = Path.join(context.fixturesDir, ...paths[p]);
        if (FS.existsSync(fileName)) {
          if (FS.statSync(fileName).isDirectory()) {
            FS.rmdirSync(fileName);
          }
          else {
            if (FS.statSync(fileName).isFile()) {
              FS.unlinkSync(fileName);
            }
          }
        }

        paths[p].pop();
      }
    }

    if (!FS.existsSync(context.fixturesDir)) {
      mkDir.sync(context.fixturesDir);
    }

    callback();
  },

  'optionDefinitions': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
    test.deepEqual(
      converter.optionDefinitions(),
      {
        out: [
          converter.options.out.nameShort,
          converter.options.out.description,
          converter.options.out.validator,
          converter.options.out.defaultValue,
        ],
      },
      'Return value is correct'
    );

    test.done();
  },

  'prepareDirectory': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;
    var directoryName: string;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);

    directoryName = Path.join(context.fixturesDir, 'report');
    converter.prepareDirectory(Path.join(directoryName, 'checkstyle.xml'));

    test.equal(
      FS.existsSync(directoryName),
      true,
      'Directory "' + directoryName + '" exists.'
    );

    converter.prepareDirectory(Path.join(directoryName, 'checkstyle.xml'));

    test.done();
  },

  'release': {
    'file': function (test: NodeUnit.Test): void {
      test.expect(1);

      var cli: ICli = require('cli');
      var fs: typeof FS = require('fs');
      var path: typeof Path = require('path');
      var jsYaml: typeof JsYaml = require('js-yaml');
      var converter: TslintFormatterConvert.Handler;
      var outFileName: string;
      var output: string;

      output = 'dummy';
      outFileName = path.join(context.fixturesDir, 'release', '1', 'checkstyle.xml');
      converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
      converter.options.out.value = outFileName;

      converter.release(output);

      test.equal(
        FS.readFileSync(outFileName),
        output,
        'The output is well written into a file.'
      );

      test.done();
    },

    'stdOut': function (test: NodeUnit.Test): void {
      test.expect(1);

      var cli: ICli = require('cli');
      var fs: typeof FS = require('fs');
      var path: typeof Path = require('path');
      var jsYaml: typeof JsYaml = require('js-yaml');
      var converter: TslintFormatterConvert.Handler;
      var outputExpected: string;
      var outputActual: string;
      var outputMock: {
        (
          message?: any,
          ...optionalParams: any[]
        ) : void
      };

      outputExpected = 'dummy';
      outputMock = function (
        message?: any,
        ...optionalParams: any[]
      ): void {
        outputActual = message;
      };

      cli.output = outputMock;
      converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);

      converter.release(outputExpected);

      test.equal(
        outputActual,
        outputExpected,
        'The output is well written to the standard output.'
      );

      test.done();
    },
  },

  'readInput': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;
    var inputFileName: string;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
    converter.main = function (
      args: string[],
      options: {[name: string]: string | number | boolean}
    ): void {
      this.cliArgs = args;
    };

    inputFileName = Path.join('fixtures', 'checkstyle-definition.yml');
    converter.main([inputFileName], {});

    test.equal(
      FS.readFileSync(inputFileName),
      converter.readInput(),
      ''
    );

    test.done();
  },

  'cmdCheckstyle2Checkstyle': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;
    var outputExpected: string;

    cli.output = context.mockCliOutput;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
    converter.readInput = function (): string {
      return FS.readFileSync(
        Path.join('fixtures', 'checkstyle-original.xml'),
        'utf8'
      );
    };

    context.mockCliOutputResult = '';
    converter.cmdCheckstyle2Checkstyle();

    outputExpected = FS
      .readFileSync(Path.join('fixtures', 'checkstyle-expected-1.xml'), 'utf8')
      .split('%path%')
      .join('');

    test.equal(
      context.mockCliOutputResult,
      outputExpected,
      'The output is well written to the standard output.'
    );

    test.done();
  },

  'cmdYaml2Checkstyle': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;
    var outputExpected: string;

    cli.output = context.mockCliOutput;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
    converter.readInput = function (): string {
      return FS.readFileSync(
        Path.join('fixtures', 'checkstyle-definition.yml'),
        'utf8'
      );
    };

    context.mockCliOutputResult = '';
    converter.cmdYaml2Checkstyle();

    outputExpected = FS
      .readFileSync(Path.join('fixtures', 'checkstyle-expected-2.xml'), 'utf8')
      .split('%path%')
      .join(Path.resolve('.') + Path.sep);

    test.equal(
      context.mockCliOutputResult,
      outputExpected,
      'The output is well written to the standard output.'
    );

    test.done();
  },

  'cmdYaml2CheckstyleRelative': function (test: NodeUnit.Test): void {
    test.expect(1);

    var cli: ICli = require('cli');
    var fs: typeof FS = require('fs');
    var path: typeof Path = require('path');
    var jsYaml: typeof JsYaml = require('js-yaml');
    var converter: TslintFormatterConvert.Handler;
    var outputExpected: string;

    cli.output = context.mockCliOutput;

    converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
    converter.readInput = function (): string {
      return FS.readFileSync(
        Path.join('fixtures', 'checkstyle-definition.yml'),
        'utf8'
      );
    };

    context.mockCliOutputResult = '';
    converter.cmdYaml2CheckstyleRelative();

    outputExpected = FS
      .readFileSync(Path.join('fixtures', 'checkstyle-expected-2.xml'), 'utf8')
      .split('%path%')
      .join('');

    test.equal(
      context.mockCliOutputResult,
      outputExpected,
      'The output is well written to the standard output.'
    );

    test.done();
  },

  'main': {
    'checkstyle2checkstyle': function (test: NodeUnit.Test): void {
      test.expect(1);

      var cli: ICli = require('cli');
      var fs: typeof FS = require('fs');
      var path: typeof Path = require('path');
      var jsYaml: typeof JsYaml = require('js-yaml');
      var converter: TslintFormatterConvert.Handler;
      var outputExpected: string;

      context.mockCliOutputResult = '';
      cli.output = context.mockCliOutput;
      cli.command = 'checkstyle2checkstyle';

      converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
      converter.readInput = function (): string {
        return FS.readFileSync(
          Path.join('fixtures', 'checkstyle-original.xml'),
          'utf8'
        );
      };

      converter.main([], {out: ''});

      outputExpected = FS
        .readFileSync(Path.join('fixtures', 'checkstyle-expected-1.xml'), 'utf8')
        .split('%path%')
        .join('');

      test.equal(
        outputExpected,
        context.mockCliOutputResult,
        'Output is correct'
      );

      test.done();
    },

    'yaml2checkstyleRelative': function (test: NodeUnit.Test): void {
      test.expect(1);

      var cli: ICli = require('cli');
      var fs: typeof FS = require('fs');
      var path: typeof Path = require('path');
      var jsYaml: typeof JsYaml = require('js-yaml');
      var converter: TslintFormatterConvert.Handler;
      var outputExpected: string;

      context.mockCliOutputResult = '';
      cli.output = context.mockCliOutput;
      cli.command = 'yaml2checkstyleRelative';

      converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
      converter.readInput = function (): string {
        return FS.readFileSync(
          Path.join('fixtures', 'checkstyle-definition.yml'),
          'utf8'
        );
      };

      converter.main([], {});

      outputExpected = FS
        .readFileSync(Path.join('fixtures', 'checkstyle-expected-2.xml'), 'utf8')
        .split('%path%')
        .join('');

      test.equal(
        outputExpected,
        context.mockCliOutputResult,
        'Output is correct'
      );

      test.done();
    },

    'yaml2checkstyle': function (test: NodeUnit.Test): void {
      test.expect(1);

      var cli: ICli = require('cli');
      var fs: typeof FS = require('fs');
      var path: typeof Path = require('path');
      var jsYaml: typeof JsYaml = require('js-yaml');
      var converter: TslintFormatterConvert.Handler;
      var outputExpected: string;

      context.mockCliOutputResult = '';
      cli.output = context.mockCliOutput;
      cli.command = 'yaml2checkstyle';

      converter = new TslintFormatterConvert.Handler(fs, path, cli, jsYaml);
      converter.readInput = function (): string {
        return FS.readFileSync(
          Path.join('fixtures', 'checkstyle-definition.yml'),
          'utf8'
        );
      };

      converter.main([], {});

      outputExpected = FS
        .readFileSync(Path.join('fixtures', 'checkstyle-expected-2.xml'), 'utf8')
        .split('%path%')
        .join(Path.resolve('.') + Path.sep);

      test.equal(
        outputExpected,
        context.mockCliOutputResult,
        'Output is correct'
      );

      test.done();
    },
  },

};
