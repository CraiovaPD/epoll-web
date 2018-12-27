import {IUserProfile} from './IUserProfile';
import {
  ProfileActionTypes,
  ProfileActions,
  SetProfile
} from './profile.actions';

export function userProfileReducer (
  state: IUserProfile | undefined, action: ProfileActions
): IUserProfile | undefined {
  switch (action.type) {
    case ProfileActionTypes.SET: {
      return (action as SetProfile).payload;
    }

    default:
      return state;
  }
}
