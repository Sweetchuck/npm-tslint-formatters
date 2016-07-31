/**
 * @file
 * NodeUnit tests for lib/tslint/formatters/checkstyleFormatter.
 */

process.env.NODE_ENV = 'test';

import * as NodeUnit from 'nodeunit';
import * as FS from 'fs';
import * as Path from 'path';
import * as TslintFormatters from 'tslint-formatters';
import * as JsonGroupByFilesFormatter from '../../../../lib/tslint/formatters/jsonGroupByFilesFormatter';

export let formatter: NodeUnit.ITestGroup = {

    'resolveFileName': function (test: NodeUnit.Test): void {
        test.expect(1);

        let fileName: string;
        let f: JsonGroupByFilesFormatter.Formatter;

        f = new JsonGroupByFilesFormatter.Formatter();
        fileName = '.';
        test.equal(
            f.resolveFileName(fileName),
            Path.resolve(fileName),
            'Resolved'
        );

        test.done();
    },

    'format': function (test: NodeUnit.Test): void {
        let f: JsonGroupByFilesFormatter.Formatter;

        f = new JsonGroupByFilesFormatter.Formatter({path: Path});

        test.expect(1);

        test.equal(
            f.format([]),
            '{}\n',
            'Failure list is empty.'
        );

        test.done();
    },

    'process': function (test: NodeUnit.Test): void {
        let pathPrefix: string = Path.resolve('.');
        let jsonGroupByFilesFormatter: JsonGroupByFilesFormatter.Formatter;
        let f: number;
        let fileName: string;
        let cases: {
            files: {
                [fileName: string]: TslintFormatters.ICheckstyleEntry[]
            },
            expected: string,
            message: string,
        }[] = [
            require('../../../../fixtures/input.01.json'),
        ];

        test.expect(cases.length);

        jsonGroupByFilesFormatter = new JsonGroupByFilesFormatter.Formatter();
        for (let c of cases) {
            jsonGroupByFilesFormatter.processStart();
            for (fileName in c.files) {
                if (c.files.hasOwnProperty(fileName)) {
                    for (f = 0; f < c.files[fileName].length; f++) {
                        jsonGroupByFilesFormatter.processAddFailure(
                            fileName,
                            c.files[fileName][f]
                        );
                    }
                }
            }

            test.equal(
                jsonGroupByFilesFormatter.processEnd(),
                FS
                    .readFileSync(c.expected + '.jsonGroupByFiles.json', {encoding: 'utf8'})
                    .split('%path%')
                    .join(pathPrefix + '/'),
                c.message
            );
        }

        test.done();
    },

};
