import * as nconf from 'nconf';
import  {EventEmitter} from 'events';

import {Logger} from './logger';
import {consoleRedirect} from './consoleRedirect';

/**
 * Class managing node process.
 *
 * @author Dragos Sebestin
 */
export class ProcessManager extends EventEmitter {

  /**
   * Class constructor.
   */
  constructor () {
    super();
  }

  /**
   * Initializes the service and emits the Start event.
   */
  init (defaultConfigPath: string) {
    this.loadConfig(defaultConfigPath);

    // redirect output and error streams before writting anyting to the console
    consoleRedirect(nconf.get('console:stdout'), nconf.get('console:stderr'));

    Logger.get().write('loaded ' + (nconf.get('config') || '(default)') + ' configuration file');

    process.on('SIGINT', this.shutdown.bind(this));
    process.on('SIGTERM', this.shutdown.bind(this));
    process.on('SIGQUIT', this.shutdown.bind(this));

    this.emit('start');
  }

  /**
   * Emits the Stop event when the process has to close.
   */
  private shutdown () {
    this.emit('stop');
  }

  /**
   * Load the configuration files.
   */
  private loadConfig (defaultConfigFilePath: string) {
    // in-memory storage engine
    nconf.use('memory');

    /**
     * Nconf creates a config object from the provided stores(file, arv, etc).
     * If a key is found in multiple stores, the key found in the first registered
     * store is added to the object.
     * We use this mechanism to override default values.
     */
    nconf.argv({
      configFile: {
        alias: ['c', 'config-file-path'],
        describe: 'service configuration file'
      }
    });

    // loading custom config
    if (nconf.get('configFile'))
      nconf.file('overrides-store', {file: nconf.get('configFile')});

    // loading default config and hard-coded defaults
    nconf.file('default-store', {file: defaultConfigFilePath});
  }
}
