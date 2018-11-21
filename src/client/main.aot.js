import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';

import {AppModuleNgFactory} from '../../pre-build/client/app.module.ngfactory.js';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
