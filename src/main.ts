import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as nconf from 'nconf';
import * as helmet from 'helmet';
import * as compression from 'compression';

import {ProcessManager} from './server/util/processManager';
import {Logger} from './server/util/logger';
import {accessLogger} from './server/util/accessLogger';

import {IServerConfig} from './client/environment.config';

// wrap HttpServer with gracefull shutdown module
require('http-shutdown').extend();

let pm = new ProcessManager();
let app: express.Express;
let server: http.Server;

pm.once('start', async () => {
  try {
    app = express();

    // to be used only with a frontend (nginx or any load balancer)
    // (by default req.ip will ignore the 'x-forwarded-for' header)
    app.enable('trust proxy');

    // redirect http -> https
    app.use((req, res, next) => {
      let wwwRx = /^www\./i;
      // check for load balancer forwarded protocol header, not the direct protocol which will always be HTTP
      if (req.headers['x-forwarded-proto'] === 'http') {
        let host = req.hostname.replace(/^www\./i, '');
        let href = `https://${host}${req.url}`;
        return res.redirect(href);
      }

      if (wwwRx.test(req.hostname)) {
        let host = req.hostname.replace(/^www\./i, '');
        let href = `https://${host}${req.url}`;
        return res.redirect(href);
      }

      next();
    });

    // load balancer health check route
    app.get('/health-check', (req, res) => {
      req; res.end();
    });

    // configure middleware
    app.use(accessLogger(nconf.get('accesslog:format'), nconf.get('accesslog:file')));
    app.use(helmet());
    app.use(compression());

    // route used for fetching app config
    app.get('/config', (req, res) => {
      req;
      let config: IServerConfig = {
        api: {
          hostname: nconf.get('apiConfig:hostname'),
          version: nconf.get('apiConfig:version')
        },
        authorization: {
          clientId: nconf.get('apiConfig:authorization:clientId')
        },
        facebook: {
          appId: nconf.get('apiConfig:facebook:appId')
        }
      };
      res.json(config);
    });

    // route used for collecting client side errors
    app.post('/epoll-client-error', (req, res) => {
      Logger.get().error(
`<===== CLIENT_EXCEPTION =====>
[MESSAGE]
${JSON.stringify(req.body)}
[CLIENT]
IP: ${req.ip}
User Agent: ${req.headers['user-agent']}
`
      );
      res.end();
    });

    // load configuration
    let config: Function;
    if (nconf.get('config') === 'debug') {
      config = require('./server/config.dev.js').default;
    } else {
      config = require('./server/config.prod.js').default;
    }

    config(app);

    let host: string = nconf.get('host');
    let port: number = nconf.get('port');
    server = app.listen(port, host, () => {
      Logger.get().write('magic happens on port', port);
    });

    // enable gracefull shutdown on server
    (server as any).withShutdown();

    server.once('close', async () => {
      Logger.get().write('server closed gracefully.');
    });
  } catch (err) {
    Logger.get().error(err);
  }
});

pm.once('stop', async () => {
  try {
    Logger.get().write('received shutdown signal, closing server ...');
    (server as any).shutdown();
  } catch (err) {
    Logger.get().error(err);
  }
});

// start process
pm.init(path.join(__dirname, '../default.json'));
