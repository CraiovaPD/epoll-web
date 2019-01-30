import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, startWith, scan, flatMap } from 'rxjs/operators';

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
  private _canLoadMore = true;

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
      .pipe(flatMap(newBatch => {
        if (newBatch.length > 0) {
          this._cursor = newBatch[newBatch.length - 1]._id;
          this._canLoadMore = true;
        }

        return newBatch;
      }))
      .pipe(scan<IDebateAnouncementListItem, IDebateAnouncementListItem[]>( (acc, crt) => acc.concat(crt), [] ));
    // types are explicitly mentioned above because of some weird bug in rxjs
    // https://github.com/ReactiveX/rxjs/issues/4086
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
  }

  ngOnDestroy () {
  }

  /**
   * Load next batch of anouncements.
   */
  loadMore () {
    if (this._canLoadMore) {
      this._canLoadMore = false;
      this._loadStream$.next(0);
    }
  }
}
