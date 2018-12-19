import { Injectable, Injector } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpErrorResponse, HttpParams
} from '@angular/common/http';
import { ServerException } from 'exceptional.js';
import { IHttpClient, IHttpRequestOptions } from 'epoll-api-sdk';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../core/users/user.service';

@Injectable()
export class EPollApiSdkHttpClient implements IHttpClient {

  /**
   * Class constructor.
   */
  constructor (
    private _httpClient: HttpClient,
    private _injector: Injector
  ) { }

  /**
   * IHttpClient interface methods.
   */
  get (url: string, options?: IHttpRequestOptions) {
    return this._httpClient.get(url, {
      headers: this._getAngularHttpHeaders(options),
      params: this._getParams(options)
    }).pipe(catchError(this._handleError.bind(this)));
  }
  post (url: string, options?: IHttpRequestOptions) {
    return this._httpClient.post(url, this._getBody(options), {
      headers: this._getAngularHttpHeaders(options),
      params: this._getParams(options)
    }).catch(this._handleError.bind(this));
  }
  put (url: string, options?: IHttpRequestOptions) {
    return this._httpClient.put(url, this._getBody(options), {
      headers: this._getAngularHttpHeaders(options),
      params: this._getParams(options)
    }).catch(this._handleError.bind(this));
  }
  delete (url: string, options?: IHttpRequestOptions) {
    return this._httpClient.delete(url, {
      headers: this._getAngularHttpHeaders(options),
      params: this._getParams(options)
    }).catch(this._handleError.bind(this));
  }
  upload (method: string, url: string, options?: IHttpRequestOptions) {
    return this._httpClient.request(method, url, {
      headers: this._getAngularHttpHeaders(options),
      body: this._getFormData(options),
      params: this._getParams(options)
    }).catch(this._handleError.bind(this));
  }

  private _getAngularHttpHeaders (options?: IHttpRequestOptions) : HttpHeaders {
    let headers = new HttpHeaders();
    if (options && options.headers) {
      for (let key in options.headers) {
        let value = options.headers[key];
        if (value)
          headers = headers.set(key, value);
      }
    }

    return headers;
  }

  private _getBody (options?: IHttpRequestOptions) : any {
    if (options && options.body)
      return options.body;

    return undefined;
  }

  private _getParams (options?: IHttpRequestOptions) : HttpParams {
    let params = new HttpParams();
    if (options && options.params) {
      for (let key in options.params) {
        let value = options.params[key];
        if (value)
        params = params.set(key, value);
      }
    }

    // add cache buster param
    params = params.set('cache-buster', String(new Date().valueOf()));

    return params;
  }

  private _getFormData (options?: IHttpRequestOptions) {
    let formData = new FormData();

    if (options && options.body) {
      this._objectToFormData(options.body, formData);
    }

    return formData;
  }

  private _handleError (ex: HttpErrorResponse) {
    let err = new ServerException(ex.status, ex.error);
    if (
        err.status === 401 &&
        err.exception.code === 4 &&
        err.exception.namespace === 'default'
    ) {
      let users = this._injector.get(UserService);
      users.logout();
    }

    return throwError(err);
  }

  private _objectToFormData (obj: any, form: FormData, namespace?: string) {
    let fd = form || new FormData();
    let formKey: string;

    for (let property in obj) {
      if (obj.hasOwnProperty(property) && obj[property] !== undefined) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }

        // if the property is an object, but not a File,
        // use recursivity.
        if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          this._objectToFormData(obj[property], fd, formKey);
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }
      }
    }

    return fd;
  }
}
