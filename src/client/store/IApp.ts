import { ActionReducerMap } from '@ngrx/store';

// store
import { userProfileReducer } from './users/profile.reducer';

// types
import { IUserProfile } from './users/IUserProfile';

/**
 * Application state model.
 *
 * @author Dragos Sebestin
 */
export interface IAppState {
  profile: IUserProfile | undefined
}

export const rootReducers: ActionReducerMap<IAppState> = {
  profile: userProfileReducer
};

export const EFFECTS = [
];
