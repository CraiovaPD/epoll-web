import { Component, OnInit, OnDestroy } from '@angular/core';

import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

/**
 * Component used for displaying a page from
 * where a debate can be edited.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ]
})
export class EditDebatePageComponent implements OnInit, OnDestroy {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _debateService: DebateService
  ) {
  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {

    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Create a new debate.
   */
  createDebate () {
    try {
      this._debateService;
    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
