import * as express from 'express';
import * as path from 'path';
import * as nconf from 'nconf';

import {ngExpressEngine} from './expressEngine';
const ENVIRONMENT_CONFIG = require('../../pre-build/client/environment.config').ENVIRONMENT_CONFIG;

const AppServerModuleNgFactory =
  require('../../pre-build/client/app.server.module.ngfactory').AppServerModuleNgFactory;

export default function config (app: express.Express) {
  app.engine('html', ngExpressEngine({
    providers: [
      {
        provide: ENVIRONMENT_CONFIG,
        useValue: {
          baseUrl: nconf.get('hostname'),
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
        }
      },
    ],
    bootstrap: [AppServerModuleNgFactory],
  }));

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../client'));

  // exclude client-side routes from SSR
  app.get([
    '/404',
    '/login',
    '/anouncements(/*)?',
    '/polls(/*)?',
  ], async (req, res) => {
    req;
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  // server rendered routes
  app.get([
    '/',
    '/u/**',
    '/debates/**',
    '/privacy-policy'
  ], (req, res) => {
    try {
      res.render('index', {req});
    } catch (err) {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    }
  });

  // server static assets
  app.use(express.static(path.join(__dirname, '../../favicon')));
  app.use(express.static(path.join(__dirname, '../client')));
  app.use('/assets', express.static(path.join(__dirname, '../../assets')));
  app.use(express.static(path.join(__dirname, '../../node_modules'), {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }));

  // serve index for root
  app.get('/', (req, res) => {
    req;
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}
