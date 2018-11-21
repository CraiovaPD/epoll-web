import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var store: any;

/**
 * Class used for accessing the browser's localStorage API.
 *
 * Is aware of the platform it's running on to be universal compatible.
 * Used npm store underneath.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class LocalStorage {

  /**
   * Class constructor.
   */
  constructor (
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {

  }

  setItem (key: string, value: any) {
    if (isPlatformBrowser(this._platformId)) {
      store.set(key, value);
    }
  }

  getItem (key: string) : any {
    if (isPlatformBrowser(this._platformId)) {
      return store.get(key);
    }
  }

  clear (key: string) {
    if (isPlatformBrowser(this._platformId)) {
      store.remove(key);
    }
  }
}
