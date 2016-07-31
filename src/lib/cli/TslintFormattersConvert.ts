/**
 * @file
 * Documentation missing.
 */

import * as FS from 'fs';
import * as Path from 'path';
import * as mkDir from 'mkdirp';
import * as TslintFormatters from 'tslint-formatters';
import * as CheckstyleAbs from '../tslint/formatters/checkstyleFormatter';
import * as CheckstyleRel from '../tslint/formatters/checkstyleRelativeFormatter';
import * as JsonGroupByFiles from '../tslint/formatters/jsonGroupByFilesFormatter';

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

    constructor(values?: {[name: string]: any}) {
        if (typeof values !== 'undefined') {
            let i: number;
            let propertyName: string;
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
        yaml2jsonGroupByFiles: 'Convert YAML report to JSON and group the messages by files.',
        checkstyle2checkstyle: 'Fix the multi-document problem with string replace.',
    };

    protected fs: typeof FS;

    protected path: typeof Path;

    protected cli: ICli;

    protected jsYaml: typeof jsyaml;

    protected checkstyleFormatter: CheckstyleAbs.Formatter = null;
    protected jsonGroupByFileFormatter: JsonGroupByFiles.Formatter = null;

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
    public optionDefinitions: {
        (): CLIOptionDefinitions
    } = (): CLIOptionDefinitions => {
        let options: CLIOptionDefinitions = {};
        let name: string;
        let option: Option;
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

        let optionName: string;
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

            case 'yaml2jsonGroupByFiles':
                this.cmdYaml2JsonGroupByFiles();
                break;

            case 'checkstyle2checkstyle':
                this.cmdCheckstyle2Checkstyle();
                break;

        }
    };

    public cmdYaml2Checkstyle: {(): void} = (): void => {
        this.checkstyleFormatter = new CheckstyleAbs.Formatter();
        this.convertYaml2Checkstyle();
    };

    public cmdYaml2CheckstyleRelative: {(): void} = (): void => {
        this.checkstyleFormatter = new CheckstyleRel.Formatter();
        this.convertYaml2Checkstyle();
    };

    public cmdYaml2JsonGroupByFiles: {(): void} = (): void => {
        this.jsonGroupByFileFormatter = new JsonGroupByFiles.Formatter();
        this.convertYaml2JsonGroupByFiles();
    };

    public cmdCheckstyle2Checkstyle: {(): void} = (): void => {
        let delimiter: string = [
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

    public convertYaml2JsonGroupByFiles: {(): void} = (): void => {
        this.jsonGroupByFileFormatter.processStart();

        this.jsYaml.safeLoadAll(
            this.readInput(),
            this.addReportToJsonGroupByFiles
        );

        this.release(this.jsonGroupByFileFormatter.processEnd());
    };

    /**
     * @access protected
     */
    public convertYaml2Checkstyle: {(): void} = () => {
        this.checkstyleFormatter.processStart();

        this.jsYaml.safeLoadAll(
            this.readInput(),
            this.addReportToCheckstyle
        );

        this.release(this.checkstyleFormatter.processEnd());
    };

    /**
     * @access protected
     */
    public addReportToCheckstyle: {
        (report: TslintFormatters.IYamlReport): void
    } = (report: TslintFormatters.IYamlReport): void => {
        let f: number;
        for (f = 0; f < report.failures.length; f++) {
            this.checkstyleFormatter.processAddFailure(
                report.failures[f].name,
                {
                    severity: 'error',
                    source: report.failures[f].ruleName,
                    line: report.failures[f].startPosition.line,
                    column: report.failures[f].startPosition.character,
                    message: report.failures[f].failure,
                }
            );
        }
    };

    /**
     * @access protected
     */
    public addReportToJsonGroupByFiles: {
        (report: TslintFormatters.IYamlReport): void
    } = (report: TslintFormatters.IYamlReport): void => {
        let f: number;
        for (f = 0; f < report.failures.length; f++) {
            this.jsonGroupByFileFormatter.processAddFailure(
                report.failures[f].name,
                {
                    severity: 'error',
                    source: report.failures[f].ruleName,
                    line: report.failures[f].startPosition.line,
                    column: report.failures[f].startPosition.character,
                    message: report.failures[f].failure,
                }
            );
        }
    };

    /**
     * @access protected
     */
    public readInput: {(): string} = (): string => {
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
        (output: string): void
    } = (output: string): void => {
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
        (fileName: string): void
    } = (fileName: string): void => {
        let dirName: string = this.path.dirname(fileName);

        if (!this.fs.existsSync(dirName)) {
            mkDir.sync(dirName);
        }
    };

}
