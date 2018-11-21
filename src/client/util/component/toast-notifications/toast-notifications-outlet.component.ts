import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger, state } from '@angular/animations';

import { ToastNotificationsService } from './toast-notifications.service';

import { IToast } from './IToast';

const TOAST_TIMEOUT = 5 * 1000; // 5 seconds

/**
 * Component used for displaying toast style notifications.
 *
 * @author Dragos Sebestin.
 */
@Component({
  selector: 'epoll-toast-notifications-outlet',
  moduleId: module.id,
  templateUrl: 'toast-notifications-outlet.component.html',
  styleUrls: ['toast-notifications-outlet.component.css'],
  animations: [
    trigger('slide', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate('150ms ease-in')
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})
export class ToastNotificationsOutletComponent implements OnInit, OnDestroy {
  public toasts: IToast[] = [];
  private _timers: NodeJS.Timer[] = [];

  private _subscription: Subscription;

  /**
   * Class constructor.
   */
  constructor (
    toasts: ToastNotificationsService
  ) {
    this._subscription = toasts.stream.subscribe(toast => {
      this.showToast(toast);
    });
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {

  }

  ngOnDestroy () {
    this._subscription.unsubscribe();
  }

  /**
   * Close a toast by index.
   */
  close (index: number) {
    this.toasts.splice(index, 1);
    let timer = this._timers[index];
    if (timer)
      clearTimeout(timer);

    this._timers.splice(index, 1);
  }

  /**
   * Display a new toast.
   */
  private showToast (toast: IToast) {
    this.toasts.push(toast);

    let timer = setTimeout(() => {
      this._timers.shift();
      this.toasts.shift();
    }, TOAST_TIMEOUT);

    this._timers.push(timer);
  }
}
