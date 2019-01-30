import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, pairwise, startWith } from 'rxjs/operators';

import { IAppState } from '../../store/IApp';

// types
import { IDebate, DebateState, IDebateAnouncementListItem } from '../../types/debates/IDebate';
import { DebateService } from '../../core/debates/debate.service';

export interface IPageData {
  debate: IDebate<any>
}

/**
 * Component used for displaying a public debate.
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
export class AnouncementsListPageComponent implements OnInit, OnDestroy {
  public anouncements$: Observable<IDebateAnouncementListItem[]>;
  public isEditor$: Observable<boolean>;

  private _loadStream$ = new BehaviorSubject<number>(0);
  private _cursor = ''; // id of the last anoucement

  /**
   * Class constructor.
   */
  constructor (
    private _store: Store<IAppState>,
    private _debates: DebateService
  ) {
    this.isEditor$ = this._store.select(
      s => s.profile
    ).pipe(map(profile => {
      if (!profile) return false;

      return true;
    }));

    this.anouncements$ = this._loadStream$
      .pipe(switchMap(() => {
        return this._debates.listAnouncements({
          fromId: this._cursor,
          state: {
            from: DebateState.draft,
            to: DebateState.unpublished,
          },
          limit: 10
        });
      }))
      .pipe(startWith([]))
      .pipe(pairwise())
      .pipe(map(pair => {
        let newBatch = pair[1];
        this._cursor = newBatch[newBatch.length - 1]._id;

        return [...pair[0], ...pair[1]];
      }));

    // this.anouncements$.subscribe(() => {});
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
  }

  ngOnDestroy () {

  }
}
