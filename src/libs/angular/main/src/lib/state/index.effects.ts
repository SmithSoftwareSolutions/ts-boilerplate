import { UserNoteEffects } from '@org/angular/core';
import { RefreshTokenEffects } from '@org/angular/core';
import { UserEffects } from '@org/angular/core';
import { AuthEffects } from '@org/angular/core';

export const mainAppEffects = [
  AuthEffects,
  UserEffects,
  RefreshTokenEffects,
  UserNoteEffects,
];
