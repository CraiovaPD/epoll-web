import { Injectable, Inject } from '@angular/core';

import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';

// declare var AccountKit_OnInteractive: any;
declare var AccountKit: any;
let _inited = false;
@Injectable()
export class AccountKitService {

  private _state = new Date().toISOString();

  /**
   * Class constructor.
   */
  constructor (
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig
  ) {
  }

  /**
   * Start authentication flow.
   */
  login (countryCode: string, phoneNumber: string) {
    return new Promise<string>((resolve, reject) => {
      if (!_inited) {
        AccountKit.init(
          {
            appId: `${this._env.facebook.appId}`,
            state: `${this._state}`,
            version: `v1.3`,
            fbAppEventsEnabled: true,
            redirect: `${window.location.protocol}://${window.location.hostname}/account-kit-redirect`
          }
        );
        _inited = true;
      }

      AccountKit.login(
        'PHONE',
        {countryCode: countryCode, phoneNumber: phoneNumber},
        (response: any) => {
          if (response.status === 'PARTIALLY_AUTHENTICATED') {
            var code = response.code;
            // var csrf = response.state;
            resolve(code);
          } else if (response.status === 'NOT_AUTHENTICATED') {
            reject(response.status);
          } else if (response.status === 'BAD_PARAMS') {
            reject(response.status);
          }
        }
      );
    });
  }
}
