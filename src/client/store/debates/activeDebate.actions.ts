import { Action } from '@ngrx/store';
import { IDebate } from '../../types/debates/IDebate';
import { IVote } from '../../types/debates/IVote';

export enum ActiveDebateActionTypes {
  SET = '[Active Debate] Set',
  ADD_VOTE = '[Active Debate] Add Vote'
}

export class SetActiveDebate implements Action {
  readonly type: string = ActiveDebateActionTypes.SET;

  constructor (public payload?: IDebate<any>) {}
}

export class AddVoteToActiveDebate implements Action {
  readonly type: string = ActiveDebateActionTypes.ADD_VOTE;

  constructor (public payload?: IVote) {}
}

export type ActiveDebateActions =
 SetActiveDebate | AddVoteToActiveDebate;
