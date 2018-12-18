import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";

export class ExerciseService {
  public exercising = new Subject<Exercise>();
  private availableExercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
    { id: "toe-touches", name: "Toe Touches", duration: 180, calories: 15 },
    { id: "lunges", name: "Lunges", duration: 120, calories: 18 },
    { id: "push-ups", name: "Push ups", duration: 60, calories: 28 }
  ];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  public getExercises() {
    return this.availableExercises.slice();
  }

  getPastExercises(): any {
    return this.exercises.slice();
  }

  public startExercise(exercise: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === exercise
    );
    this.exercising.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exercising.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exercising.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }
}
