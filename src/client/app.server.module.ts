import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import EPollAPI from 'epoll-api-sdk';

// rxjs imports
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

import { AppComponent } from './app.component';
import { EPollApiSdkHttpClient } from './api/sdkHttpClient';

// other modules
import { UtilModule } from './util/util.module';
import { PagesModule, ROUTES as CORE_ROUTES } from './pages/pages.module';

// store
import { IAppState, rootReducers } from './store/IApp';

// users
import { UserService } from './core/users/user.service';
import { ToastNotificationsService } from './util/component/toast-notifications/toast-notifications.service';

import {
  ENVIRONMENT_CONFIG, IEnvironmentConfig
} from './environment.config';

export function init (
  sdkApiClient: EPollApiSdkHttpClient,
  env: IEnvironmentConfig
) {
  return async () => {
    EPollAPI.setHttpClient(sdkApiClient);
    EPollAPI.loadConfig(env.api);
  };
}

const initialState: IAppState = {
  profile: undefined,
  activeDebate: undefined
};
export function getInitialState () {
  return {...initialState};
}

@NgModule({
  imports: [
    ServerModule,
    RouterModule,
    BrowserModule.withServerTransition({
      appId: 'epoll'
    }),
    // .BrowserAnimationsModule,
    HttpClientModule,

    UtilModule,
    PagesModule,

    StoreModule.forRoot(rootReducers, {initialState: getInitialState}),
    RouterModule.forRoot([
      ...CORE_ROUTES
    ])
  ],
  providers: [
    EPollApiSdkHttpClient,
    {provide: APP_INITIALIZER, useFactory: init, deps: [
      EPollApiSdkHttpClient, ENVIRONMENT_CONFIG
    ], multi: true},

    UserService,
    ToastNotificationsService
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
