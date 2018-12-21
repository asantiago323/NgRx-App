import { Exercise } from './exercise.model';
import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';

@Injectable()
export class ExerciseService {
  public exercising = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  public fetchAvailableExercises() {
    this.uiService.loadingStateChanges.next(true);
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return this.convertToExercise(doc.payload.doc);
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiService.loadingStateChanges.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          error => {
            this.uiService.loadingStateChanges.next(false);
            this.uiService.showSnackbar(
              'Unable to fetch exercises',
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  getPastExercises(): any {
    this.uiService.loadingStateChanges.next(true);
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiService.loadingStateChanges.next(false);
            this.finishedExercisesChanged.next(exercises);
          },
          error => {
            this.uiService.loadingStateChanges.next(false);
            this.uiService.showSnackbar(
              'Unable to fetch exercises',
              null,
              3000
            );
          }
        )
    );
  }

  public startExercise(exercise: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === exercise
    );
    this.exercising.next({ ...this.runningExercise });
  }

  public cancelSubscriptions() {
    if (this.fbSubs) {
      this.fbSubs.forEach(sub => sub.unsubscribe());
    }
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
    this.db.collection('finishedExercises').add(exercise);
  }
}
