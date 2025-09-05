import { userNoteReducer } from '@org/angular/core';
import { refreshTokenReducer } from '@org/angular/core';
import { userReducer } from '@org/angular/core';
import { ActionReducer, createReducer, INIT, MetaReducer } from '@ngrx/store';
import {
  authReducer,
  CoreAppState,
  sidenavIsOpenReducer,
} from '@org/angular/core';

export type MainAppState = CoreAppState;

function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    console.log(`[ACTION]${action.type}`, action, state);

    return reducer(state, action);
  };
}

const hydrationMetaReducer = (
  reducer: ActionReducer<MainAppState>
): ActionReducer<MainAppState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue) as MainAppState;
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    const copyOfState = {
      auth: nextState?.['auth'],
    };
    localStorage.setItem('state', JSON.stringify(copyOfState));
    return nextState;
  };
};

export const mainAppMetaReducers: MetaReducer[] = [debug, hydrationMetaReducer];

export const mainAppReducers = {
  isMainApp: createReducer(true),
  sidenavIsOpen: sidenavIsOpenReducer,
  auth: authReducer,
  user: userReducer,
  refreshToken: refreshTokenReducer,
  userNote: userNoteReducer,
};
