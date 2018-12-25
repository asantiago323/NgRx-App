import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAINING = '[TRAINING] Set Available Training';
export const SET_FINISHED_TRAINING = '[TRAINING] Set Finished Training';
export const START_TRAINING = '[TRAINING] Start Training';
export const STOP_TRAINING = '[TRAINING] Stop Training';

export class SetAvailableTraining implements Action {
  readonly type = SET_AVAILABLE_TRAINING;

  constructor(public payload: Exercise[]) {}
}

export class SetFinishedTraining implements Action {
  readonly type = SET_FINISHED_TRAINING;

  constructor(public payload: Exercise[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public payload: string) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  | SetAvailableTraining
  | SetFinishedTraining
  | StartTraining
  | StopTraining;
