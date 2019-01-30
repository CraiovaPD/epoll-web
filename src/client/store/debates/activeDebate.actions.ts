import { Action } from '@ngrx/store';
import { IDebate, DebateState } from '../../types/debates/IDebate';
import { IVote } from '../../types/debates/IVote';

export enum ActiveDebateActionTypes {
  SET = '[Active Debate] Set',
  ADD_VOTE = '[Active Debate] Add Vote',
  UPDATE_STATE = '[Active Debate] Update State'
}

export class SetActiveDebate implements Action {
  readonly type: string = ActiveDebateActionTypes.SET;

  constructor (public payload?: IDebate<any>) {}
}

export class AddVoteToActiveDebate implements Action {
  readonly type: string = ActiveDebateActionTypes.ADD_VOTE;

  constructor (public payload?: IVote) {}
}

export class UpdateActiveDebateState implements Action {
  readonly type: string = ActiveDebateActionTypes.UPDATE_STATE;

  constructor (public payload?: DebateState) {}
}

export type ActiveDebateActions =
 SetActiveDebate | AddVoteToActiveDebate | UpdateActiveDebateState;
