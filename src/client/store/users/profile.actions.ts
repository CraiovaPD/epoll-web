import { Action } from '@ngrx/store';
import { IUserProfile } from './IUserProfile';

export enum ProfileActionTypes {
  SET = '[Profile] Set'
}

export class SetProfile implements Action {
  readonly type: string = ProfileActionTypes.SET;

  constructor (public payload?: IUserProfile) {}
}

export type ProfileActions =
 SetProfile;
