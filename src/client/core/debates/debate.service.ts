import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import EPollAPI from 'epoll-api-sdk';

// types
import { IDebatePollListItem, IDebate } from '../../types/debates/IDebate';

/**
 * Angular Debate service class.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class DebateService {

  /**
   * Class constructor.
   */
  constructor (
  ) {}

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * List polls.
   */
  listPolls (params: {
    limit?: number
  }) : Observable<IDebatePollListItem[]> {
    return EPollAPI.Debates().listPolls({
      limit: params.limit
    });
  }

  /**
   * Get Poll by id.
   */
  getPollById (id: string) : Observable<IDebate<any>> {
    return EPollAPI.Debates().getDebateById(id);
  }
}
