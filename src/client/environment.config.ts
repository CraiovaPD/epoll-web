import {InjectionToken} from '@angular/core';

/**
 * Interface representing a config object sent by the server.
 */
export interface IServerConfig {
  api: {
    hostname: string,
    version: string
  },
  authorization: {
    clientId: string
  },
  facebook: {
    appId: string
  }
}

export interface IEnvironmentConfig extends IServerConfig {
  baseUrl: string
}

export const ENVIRONMENT_CONFIG = new InjectionToken<IEnvironmentConfig>('environment-config');
