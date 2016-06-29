/**
 * @file
 * Documentation missing.
 */

import * as CheckstyleFormatter from './checkstyleFormatter';

export class Formatter extends CheckstyleFormatter.Formatter {

  protected initProperties(): void {
    super.initProperties();

    this.absoluteFileName = false;
  }

}
