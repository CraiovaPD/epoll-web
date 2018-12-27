import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import 'moment/locale/ro';
import moment from 'moment';
import EPollErrors from 'epoll-errors';
import { Subscription } from 'rxjs';
import { setLocale } from 'exceptional.js';

// set moment locale to ro
moment.locale('ro');

@Component({
  moduleId: module.id,
  selector: 'epoll',
  templateUrl: 'app.component.html',
  styleUrls: [
  ],
  providers: [
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscription?: Subscription;

  /**
   * Class constructor.
   */
  constructor (
    private _router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
  }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    // initialize error subsystem
    EPollErrors();
    setLocale('ro');

    if (isPlatformBrowser(this._platformId)) {
      this._subscription = this._router.events
        .filter((event: any) => event instanceof NavigationEnd)
        .subscribe(() => window.scroll(0, 0));
    }
  }

  ngOnDestroy () {
    if (this._subscription)
      this._subscription.unsubscribe();
  }
}
