/**
 * @file
 * Documentation missing.
 */

import * as Lint from 'tslint/lib/lint';

export class Formatter extends Lint.Formatters.AbstractFormatter {

    public failure2Json: {
        (failure: Lint.RuleFailure): string
    } = (failure: Lint.RuleFailure): string => {
        return failure.toJson();
    };

    public format(failures: Lint.RuleFailure[]): string {
        return '---\n' + require('js-yaml').safeDump(
                {
                    failures: failures.map(this.failure2Json),
                }
            );
    }

}
