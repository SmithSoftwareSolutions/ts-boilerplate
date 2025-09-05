import { createAction, props } from '@ngrx/store';
import { MESSAGE_QUEUE_DISPLAY_TYPE } from './layout.reducer';

export const toggleSidenavIsOpen = createAction(
  '[DEFAULT] Toggle Sidenav Is Open'
);
export const setSidenavIsOpen = createAction(
  '[DEFAULT] Set Sidenav Is Open',
  props<{ open: boolean }>()
);

export const addMessageToSnackbarQueue = createAction(
  '[DEFAULT] Add Message to Snackbar Queue',
  props<{ message: string; messageType?: MESSAGE_QUEUE_DISPLAY_TYPE }>()
);
