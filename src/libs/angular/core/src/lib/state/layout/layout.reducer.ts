import { createReducer, on } from '@ngrx/store';
import {
  addMessageToSnackbarQueue,
  setSidenavIsOpen,
  toggleSidenavIsOpen,
} from './layout.actions';

export const sidenavIsOpenReducer = createReducer(
  true,
  on(toggleSidenavIsOpen, (open) => !open),
  on(setSidenavIsOpen, (_, { open }) => open)
);

export enum MESSAGE_QUEUE_DISPLAY_TYPE {
  INFO,
  WARN,
  ERROR,
}
export interface MessageQueueState {
  message?: string | null;
  messageType?: MESSAGE_QUEUE_DISPLAY_TYPE;
}

const initialMessageQueueState: MessageQueueState = {};

export const messageQueueReducer = createReducer(
  initialMessageQueueState,
  on(addMessageToSnackbarQueue, (state, { message, messageType }) => ({
    ...state,
    message: message,
    messageType: messageType ?? MESSAGE_QUEUE_DISPLAY_TYPE.INFO,
  }))
);
