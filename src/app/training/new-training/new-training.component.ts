import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseSubscription: Subscription;
  private exercises: Exercise[];

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
      this.exerciseSubscription = this.exerciseService.exercisesChanged.subscribe(
        exercises => {
          this.exercises = exercises;
        }
      );
      this.exerciseService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
