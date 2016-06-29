/**
 * @file
 * TypeScript type definitions for CLI.
 *
 * @link https://www.npmjs.com/package/cli
 */

/**
 * 0: Short name.
 * 1: Description.
 * 2: Validator.
 * 3: Default value.
 */
declare type CLIOptionDefinition = [
  string | boolean,
  string,
  string,
  string
];

declare type CLIOptionDefinitions = {
  [name: string]: CLIOptionDefinition
};

declare type CLIOutputWriterCallback = (
  line: string,
  sep: string,
  unknown: boolean
) => void;

declare type CLIMainCommandCallback = (
  args: any,
  options: any
) => void;

interface ICli {

  app: string;

  version: string;

  argv: string[];

  argc: number;

  options: {};

  command: string;

  width: number;

  option_width: number;

  native: {};

  // @todo
  exit: any;

  output(
    message?: any,
    ...optionalParams: any[]
  ): void;

  enable(
    ...plugins: string[]
  ): ICli;

  disable(
    ...plugins: string[]
  ): ICli;

  setArgv(
    args: string | string[],
    /* tslint:disable:variable-name */
    keep_arg0: boolean
    /* tslint:enable:variable-name */
  ): void;

  next(): string | boolean;

  parse(
    opts: CLIOptionDefinitions,
    /* tslint:disable:variable-name */
    command_def?: string[]
    /* tslint:enable:variable-name */
  ): {[name: string]: string | number | boolean};

  parse(
    opts: CLIOptionDefinitions,
    /* tslint:disable:variable-name */
    command_def?: {[name: string]: string}
    /* tslint:enable:variable-name */
  ): {[name: string]: string | number | boolean};

  autocompleteCommand(
    command: string
  ): string;

  setApp(
    name: string,
    version: string
  ): ICli;

  parsePackageJson(
    path: string
  ): void;

  setUsage(
    usage: string
  ): ICli;

  getUsage(
    code: any
  ): void;

  getOptError(
    expects: string,
    type: string
  ): string;

  getValue(
    /* tslint:disable:variable-name */
    default_val: string,
    validate_func: (
      curr_val: string
    ) => string,
    err_msg: string
    /* tslint:enable:variable-name */
  ): string;

  getInt(
    /* tslint:disable:variable-name */
    default_val: number
    /* tslint:enable:variable-name */
  ): number;

  getFloat(
    /* tslint:disable:variable-name */
    default_val: number
    /* tslint:enable:variable-name */
  ): number;

  getUrl(
    /* tslint:disable:variable-name */
    default_val: string,
    /* tslint:enable:variable-name */
    identifier: string
  ): string;

  getEmail(
    /* tslint:disable:variable-name */
    default_val: string
    /* tslint:enable:variable-name */
  ): string;

  getIp(
    /* tslint:disable:variable-name */
    default_val: string
    /* tslint:enable:variable-name */
  ): string;

  getPath(
    /* tslint:disable:variable-name */
    default_val: string,
    /* tslint:enable:variable-name */
    identifier: string
  ): string;

  getArrayValue(
    arr: string[],
    /* tslint:disable:variable-name */
    default_val: string
    /* tslint:enable:variable-name */
  ): string;

  withStdin(
    encoding: string,
    callback: (
      data: number
    ) => string
  ): void;

  withStdin(
    callback: (
      data: number
    ) => string
  ): void;

  withStdinLines(
    callback: (
      lines: string[],
      sep: string
    ) => void
  ): void;

  withInput(
    encoding: string,
    callback: CLIOutputWriterCallback
  ): void;

  withInput(
    file: string,
    callback: CLIOutputWriterCallback
  ): void;

  withInput(
    callback: CLIOutputWriterCallback
  ): void;

  daemon(
    arg: string,
    callback: () => void
  ): void;

  daemon(
    callback: () => void
  ): void;

  main(
    callback: CLIMainCommandCallback
  ): void;

  exec(
    cmd: string,
    callback: (
      lines: string[]
    ) => void,
    errback: (
      err: any,
      stdout: any
    ) => void
  ): void;

  progress(
    progress: number,
    decimals: number,
    stdout: NodeJS.WritableStream
  ): void;

  spinner(
    prefix: string | boolean,
    end: boolean,
    stream: NodeJS.WritableStream
  ): void;

}

declare module 'cli' {

  var cli: ICli;

  export = cli;

}
