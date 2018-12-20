import { Exercise } from './exercise.model';
import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class ExerciseService {
  public exercising = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private firestore;
  private fbSubs;

  constructor(

  ) {
    // set firestore
    this.firestore = window[`firestore`];
    this.firestore.settings({
      timestampsInSnapshots: true
    });
  }

  public fetchAvailableExercises() {
    const exerciseArray = [];
    this.firestore
      .collection('availableExercises')
      .get()
      .then((docArray) => {
        docArray.forEach(doc => {
          exerciseArray.push(this.convertToExercise(doc));
        });
      });
      this.availableExercises = exerciseArray;
      this.exercisesChanged.next(this.availableExercises);
  }

  getPastExercises(): any {
    this.fbSubs = this.firestore
      .collection('finishedExercises')
      .onSnapshot((exercises) => {
        this.finishedExercisesChanged.next(this.makePastExerciseArray(exercises.docs));
      });
  }

  public cancelSubscriptions() {
    if (this.fbSubs) {
      this.fbSubs();
    }
  }

  public startExercise(exercise: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === exercise
    );
    this.exercising.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date().toDateString(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exercising.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date().toDateString(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exercising.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  convertToExercise(doc): Exercise {
    return {
      id: doc.id,
      name: doc.data().name,
      duration: doc.data().duration,
      calories: doc.data().calories
    };
  }

  private addDataToDatabase(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
  }

  private makePastExerciseArray(docs): Exercise[] {
    const arr = [];

    docs.forEach(doc => {
      arr.push(doc.data());
    });

    return arr;
  }

}
