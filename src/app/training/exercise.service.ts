import { Exercise } from './exercise.model';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class ExerciseService {
  public exercising = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private db;
  private firestore;

  constructor() {

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
    this.firestore
      .collection('finishedExercises')
      .onSnapshot((exercises) => {
        this.finishedExercisesChanged.next(this.makePastExerciseArray(exercises.docs));
      });
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
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exercising.next(null);
  }

  cancelExercise(progress: number) {
    console.log(this.runningExercise);
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
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

  private makePastExerciseArray(docs) {
    const arr = [];

    docs.forEach(doc => {
      const ex = doc.data();
      const date = new Date();
      date.setTime(ex.date.seconds * 1000);
      ex[`date`] = date;

      arr.push(ex);
    });

    return arr;
  }
}
