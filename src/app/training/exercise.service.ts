import { Exercise } from "./exercise.model";
import { Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { UIService } from "../shared/ui.service";
import * as UI from "../shared/ui.actions";
import * as Training from "./training.actions";
import * as fromTraining from "./training.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class ExerciseService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  public fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection("availableExercises")
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
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTraining(exercises));
          },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              "Unable to fetch exercises",
              null,
              3000
            );
            this.store.dispatch(new Training.StopTraining());
          }
        )
    );
  }

  getPastExercises(): any {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetFinishedTraining(exercises));
          },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              "Unable to fetch exercises",
              null,
              3000
            );
          }
        )
    );
  }

  public startExercise(exerciseId: string) {
    this.store.dispatch(new Training.StartTraining(exerciseId));
  }

  public cancelSubscriptions() {
    if (this.fbSubs) {
      this.fbSubs.forEach(sub => sub.unsubscribe());
    }
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe(ex => {
        const exe: Exercise = this.makeObject(ex);
        console.log(exe);
        this.addDataToDatabase({
          ...exe,
          date: new Date().toDateString(),
          state: "completed"
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe(ex => {
        const exe: Exercise = this.makeObject(ex);
        this.addDataToDatabase({
          ...exe,
          duration: ex[`duration`] * (progress / 100),
          calories: ex[`calories`] * (progress / 100),
          date: new Date().toDateString(),
          state: "cancelled"
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  convertToExercise(doc): Exercise {
    return {
      id: doc.id,
      name: doc.data().name,
      duration: doc.data().duration,
      calories: doc.data().calories
    };
  }

  private makeObject(exe) {
    return {
      id: exe.id,
      name: exe.name,
      duration: exe.duration,
      calories: exe.calories
    };
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }
}
