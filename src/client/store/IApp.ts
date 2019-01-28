import { ActionReducerMap } from '@ngrx/store';

// store
import { userProfileReducer } from './users/profile.reducer';
import { activeDebateReducer } from './debates/activeDebate.reducer';

// types
import { IUserProfile } from './users/IUserProfile';
import { IDebate } from '../types/debates/IDebate';

/**
 * Application state model.
 *
 * @author Dragos Sebestin
 */
export interface IAppState {
  profile: IUserProfile | undefined,
  activeDebate: IDebate<any> | undefined
}

export const rootReducers: ActionReducerMap<IAppState> = {
  profile: userProfileReducer,
  activeDebate: activeDebateReducer
};

export const EFFECTS = [
];
