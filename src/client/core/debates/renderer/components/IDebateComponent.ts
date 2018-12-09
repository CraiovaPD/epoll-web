import { IDebate } from '../../../../types/debates/IDebate';

/**
 * Interface to a Debate rendering component.
 *
 * @author Dragos Sebestin
 */
export interface IDebateComponent {

  /**
   * Set debate data.
   *
   * @param debate Debate JSON data;
   */
  setDebate (debate: IDebate<any>): void;
}
