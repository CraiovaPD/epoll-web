import * as fs from 'fs';
import * as morgan from 'morgan';

/**
 * Express middleware used for logging HTTP access.
 * Uses morgan module as backend
 *
 * @author: Dragos Sebestin
 */
export function accessLogger (logMethod?: string, logFilePath?: string) {
  let stream = process.stdout as any as fs.WriteStream;
  if (logFilePath)
    stream = fs.createWriteStream(logFilePath, {flags: 'a+'});

  return morgan(logMethod || 'dev', {
    stream: stream
  });
}

/**
 * Define custom morgan formats to be used in production.
 */

// generic apache style format
morgan.format(
  'access',     // compatible with Apache "common" LogFormat
  ':remote-addr - :remote-user [:date[clf]]' +
  ' ":method :url HTTP/:http-version" :status :res[content-length] :response-time'
);
