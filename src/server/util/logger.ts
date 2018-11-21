import {format} from 'date-fns';
import * as nconf from 'nconf';

/**
 * Class used for writing in log files.
 *
 * @author Dragos Sebestin
 */
export class Logger {
  private static _instance: Logger = new Logger();

  /**
   * Hide class constructor.
   */
  private constructor () {}

  /**
   * Return singleton instance.
   */
  static get () : Logger {
    return this._instance;
  }

  /**
   * Write to output stream.
   */
  write (...args: any[]) {
    console.log(this.getDefaultFormat(args), ...args);
  }

  /**
   * Write to error stream.
   */
  error (...args: any[]) {
    console.error(this.getDefaultFormat(args), ...args);
  }

  /**
   * Write to output stream only on debug.
   */
  debug (...args: any[]) {
    if (nconf.get('config') === 'debug')
      console.log(this.getDefaultFormat(args), ...args);
  }

  /**
   * Return default parameters for console
   */
  private getDefaultFormat (args : any[]) {
    let prefix = `[${format(Date.now(), `D/MMM/YYYY HH:mm:ss`)}]`;
    if ( (args.length > 0) && (typeof args[0] === 'string') )
      prefix += ' ' + args.shift();
    return prefix;
  }
}
