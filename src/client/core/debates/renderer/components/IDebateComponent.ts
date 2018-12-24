import { IDebate } from '../../../../types/debates/IDebate';
import { Observable } from 'rxjs';

/**
 * Interface to a Debate rendering component.
 *
 * @author Dragos Sebestin
 */
export interface IDebateComponent {
  vote$: Observable<string>;

  /**
   * Set debate data.
   *
   * @param debate Debate JSON data;
   */
  setDebate (debate: IDebate<any>): void;
}
