// express-engine.ts
// taken from https://github.com/robwormald/ng-universal-demo/

import * as fs from 'fs';
import {enableProdMode} from '@angular/core';
import {renderModuleFactory} from '@angular/platform-server';

// load zone and let it do it's monkey patches
require('zone.js/dist/zone-node');

const templateCache: any = {};

enableProdMode();

export function ngExpressEngine (setupOptions: any) {
  return async function (filePath: string, options: any, callback: any) {
    if (!templateCache[filePath]) {
      let file = fs.readFileSync(filePath);
      templateCache[filePath] = file.toString();
    }

    try {
      let template = await renderModuleFactory(setupOptions.bootstrap[0], {
        document: templateCache[filePath],
        url: options.req.url,
        extraProviders: setupOptions.providers
      });

      callback(null, template);
    } catch (err) {
      console.log(err);
      callback(err);
    }
  };
}
