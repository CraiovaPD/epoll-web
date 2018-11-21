import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerException, ClientException, format } from 'exceptional.js';

import { ToastNotificationsService } from '../component/toast-notifications/toast-notifications.service';
import { Location } from '@angular/common';

/**
 * Namespace holding helper methods for handling exceptions.
 * Used as an Angular service.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class ErrorUtil {

  /**
   * Class constructor.
   */
  constructor (
    private _toasts: ToastNotificationsService,
    private _http: HttpClient,
    private _location: Location
  ) {}

  /**
   * Dispatch an exception to the appropriate channel.
   *
   * Useful mostly for displaying server side exceptions.
   *
   * @param exception any time ob object
   */
  dispatch (exception: any) {
    try {
      if (exception instanceof ServerException) {
        let ex: ServerException = exception;
        if (
          ex.status === 401 &&
          ex.exception.code === 4 &&
          ex.exception.namespace === 'default'
        ) {
          this._toasts.addWarning('Sesiunea ta a expirat. Te rugam sa te autentifici din nou.');
        } else {
          this._toasts.addError(ex.message);
        }
        return console.log(ex.message);
      } else {
        let ex = new ClientException(exception);

        this._toasts.addError(format(ex.error));

        // log client error to server
        // this._logToServer(exception);
        this._logToServer;
        return console.log(format(ex.error));
      }
    } catch (error) {
      console.log(error);
      console.log(exception);
    }

  }

  /**
   * Log exception to server.
   */
  private _logToServer (ex: any) {
    this._http.post('/epoll-client-error', {
      ex,
      route: this._location.path
    }).subscribe(() => {}, err => {
      console.error(err);
    });
  }
}
