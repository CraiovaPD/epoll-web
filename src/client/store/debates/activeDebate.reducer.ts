import {
  ActiveDebateActions,
  ActiveDebateActionTypes,
  SetActiveDebate,
  AddVoteToActiveDebate
} from './activeDebate.actions';
import { IDebate, IPollDebate } from '../../types/debates/IDebate';
import { IVote } from '../../types/debates/IVote';

export function activeDebateReducer (
  state: IDebate<any> | undefined, action: ActiveDebateActions
): IDebate<any> | undefined {
  switch (action.type) {
    case ActiveDebateActionTypes.SET: {
      let debate = (action as SetActiveDebate).payload;
      Object.freeze(debate);
      return debate;
    }

    case ActiveDebateActionTypes.ADD_VOTE: {
      if (state) {
        let poll = state as IDebate<IPollDebate>;
        let newVote = (action as AddVoteToActiveDebate).payload as IVote;
        let newPollPayload = Object.assign({}, poll.payload, {
          votes: {
            count: poll.payload.votes.count + 1,
            data: poll.payload.votes.data.concat(newVote)
          }
        });

        let newPoll = Object.assign({}, poll, {
          payload: newPollPayload
        });
        Object.freeze(newPoll);

        return newPoll;
      } else {
        return undefined;
      }
    }

    default:
      return state;
  }
}
