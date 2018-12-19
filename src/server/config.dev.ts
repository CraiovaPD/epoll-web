import * as express from 'express';
import * as path from 'path';

export default function config (app: express.Express) {
  // server static assets
  app.use(express.static(path.join(__dirname, '../../favicon')));
  app.use(express.static(path.join(__dirname, '../client')));
  app.use('/assets', express.static(path.join(__dirname, '../../assets')));
  app.use(express.static(path.join(__dirname, '../../node_modules'), {
    maxAge: 24 * 60 * 60 * 1000 // one day
  })); // cache node modules

  // angular app
  app.get('/', (req, res) => {
    req;
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  // pages that also load the angular app
  app.get([
    '/404', '/login',
    '/u/**',
    '/debates/**'
  ], (req, res) => {
    req;
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}
