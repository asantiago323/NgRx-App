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
    // set database ref
    this.db = window[`dbRef`];

    // set firestore
    this.firestore = window[`firestore`];
    this.firestore.settings({
      timestampsInSnapshots: true
    });
  }

  public fetchAvailableExercises() {

    this.firestore
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return this.convertToExercise(doc.payload.doc);
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  getPastExercises(): any {
    this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
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
    this.db.collection('finishedExercises').add(exercise);
  }
}
