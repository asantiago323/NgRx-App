import {
  TrainingActions,
  SET_AVAILABLE_TRAINING,
  SET_FINISHED_TRAINING,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  pastExercises: Exercise[];
  activeExercise: string;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  pastExercises: [],
  activeExercise: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAINING:
      return {
        ...state,
        availableExercises: action.payload
      };

    case SET_FINISHED_TRAINING:
      return {
        ...state,
        pastExercises: action.payload
      };

    case START_TRAINING:
      return {
        ...state,
        activeExercise: {
          ...state.availableExercises.find(ex => ex.id === action.payload)
        }
      };

    case STOP_TRAINING:
      return {
        ...state,
        activeExercise: null
      };

    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>(
  'training'
);

export const getAvailableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getPastExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.pastExercises
);
export const getActiveExercise = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeExercise
);
export const getIsExercising = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeExercise != null
);
