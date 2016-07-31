/**
 * @file
 * Documentation missing.
 */

import * as Tslint from 'tslint/lib/lint';
import * as Path from 'path';
import * as TslintFormatters from 'tslint-formatters';

export class Formatter extends Tslint.Formatters.AbstractFormatter {

    protected absoluteFileName: boolean;

    protected path: typeof Path;

    protected files: {[fileName: string]: TslintFormatters.ICheckstyleEntry[]};

    constructor(dependencies?: TslintFormatters.ICheckstyleDependencies) {
        super();

        this.initDependencies(dependencies);
        this.initProperties();
    }

    public resolveFileName: {
        (fileName: string): string
    } = (fileName: string): string => {
        return this.absoluteFileName ? this.path.resolve(fileName) : fileName;
    };

    public processStart: {(): void} = () => {
        // Nothing to do.
    };

    public processAddFailure: {
        (fileName: string,
         entry: TslintFormatters.ICheckstyleEntry): void,
    } = (
        fileName: string,
         entry: TslintFormatters.ICheckstyleEntry
    ) => {
        fileName = this.resolveFileName(fileName);

        if (!this.files.hasOwnProperty(fileName)) {
            this.files[fileName] = [];
        }

        this.files[fileName].push({
            severity: entry.severity,
            source: entry.source,
            line: entry.line,
            column: entry.column,
            message: entry.message,
        });
    };

    public processEnd: {(): string} = () => {
        return JSON.stringify(this.files, null, 2) + '\n';
    };

    public format(failures: Tslint.RuleFailure[]): string {
        let i: number;

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

    protected initDependencies(d?: TslintFormatters.ICheckstyleDependencies): void {
        if (typeof d === 'undefined') {
            d = {};
        }

        this.path = (d.hasOwnProperty('path') && d.path) ? d.path : require('path');
    };

    protected initProperties(): void {
        this.absoluteFileName = true;
        this.files = {};
    }

}
