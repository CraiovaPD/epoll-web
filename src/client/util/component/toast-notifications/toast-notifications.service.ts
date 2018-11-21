import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IToast, ToastType } from './IToast';

/**
 * Service used for dispatching toasts notifications to a toast outlet.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class ToastNotificationsService {
  public stream = new Subject<IToast>();

  /**
   * Display a success toast.
   */
  addSuccess (message: string) {
    this.stream.next({
      message: message,
      type: ToastType.success
    });
  }

  /**
   * Display a error toast.
   */
  addError (message: string) {
    this.stream.next({
      message: message,
      type: ToastType.error
    });
  }

  /**
   * Display a warning toast.
   */
  addWarning (message: string) {
    this.stream.next({
      message: message,
      type: ToastType.warning
    });
  }
}
