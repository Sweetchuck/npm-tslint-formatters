/**
 * @file
 * Documentation missing.
 */

declare module 'xmlbuilder' {

  export interface IHeaderAttributes {

    version?: string;

    encoding?: string;

    standalone?: boolean;

  }

  export interface ICreateSettings {

    allowSurrogateChars?: boolean;

    skipNullAttributes?: boolean;

    headless?: boolean;

    ignoreDecorators?: boolean;

    separateArrayItems?: boolean;

    stringify?: any;
  }

  export interface ICreateOptions {

    pubID?: any;

    sysID?: any;

  }

  export interface IEndOptions {

    pretty?: boolean;

    indent?: string;

    newline?: string;

  }

  export function create(
    tagName: string,
    attributes?: IHeaderAttributes,
    options?: ICreateOptions,
    settings?: ICreateSettings
  ) : IElement;

  export interface IElement {

    ele(
      tagName: string,
      attributes?: {[name: string]: string|number}
    ): IElement;

    end(
      options: IEndOptions
    ) : string;

  }

}
