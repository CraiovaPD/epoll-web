import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import EPollAPI from 'epoll-api-sdk';

// rxjs imports
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

import { AppComponent } from './app.component';
import { EPollApiSdkHttpClient } from './api/sdkHttpClient';
import { LocalStorage } from './util/storage/localStorage';

import { UtilModule } from './util/util.module';
import { PagesModule, ROUTES as CORE_ROUTES } from './pages/pages.module';

// store
import { IAppState, rootReducers, EFFECTS } from './store/IApp';

// users
import { UserService, JWT_STORAGE_KEY, JWT_TYPE_STORAGE_KEY } from './core/users/user.service';
import { ToastNotificationsService } from './util/component/toast-notifications/toast-notifications.service';

import {
  ENVIRONMENT_CONFIG, IEnvironmentConfig, IServerConfig
} from './environment.config';
import { SetProfile } from './store/users/profile.actions';

export function init (
  localStorage: LocalStorage,
  http: HttpClient,
  sdkApiClient: EPollApiSdkHttpClient,
  env: IEnvironmentConfig,
  store: Store<IAppState>
) {
  return async () => {
    let serverConfig = await http.get(`/config?cache-buster=${new Date().toISOString()}`).toPromise() as IServerConfig;
    env.api = serverConfig.api;
    env.authorization = serverConfig.authorization;
    env.facebook = serverConfig.facebook;
    EPollAPI.setHttpClient(sdkApiClient);
    EPollAPI.loadConfig(env.api);
    let jwt = localStorage.getItem(JWT_STORAGE_KEY);
    if (jwt) {
      let jwtType = localStorage.getItem(JWT_TYPE_STORAGE_KEY);
      EPollAPI.startSession(jwtType, jwt);
      let user = await EPollAPI.Users().getMyUserProfile().toPromise();
      store.dispatch(new SetProfile(user));
    }
  };
}

const initialState: IAppState = {
  profile: undefined
};
export function getInitialState () {
  return {...initialState};
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'epoll'
    }),
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,

    PagesModule,
    UtilModule,

    StoreModule.forRoot(rootReducers, {initialState: getInitialState}),
    EffectsModule.forRoot(
      EFFECTS
    ),
    RouterModule.forRoot([
      ...CORE_ROUTES
    ])
  ],
  providers: [
    LocalStorage,
    EPollApiSdkHttpClient,
    {provide: ENVIRONMENT_CONFIG, useValue: {
      baseUrl: '/'
    }, multi: true},
    {provide: APP_INITIALIZER, useFactory: init, deps: [
      LocalStorage, HttpClient, EPollApiSdkHttpClient,
      ENVIRONMENT_CONFIG, Store
    ], multi: true},

    UserService,
    ToastNotificationsService
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
