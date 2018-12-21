import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscriptions: Subscription[] = [];
  isLoading = false;

  constructor(
    private exerciseService: ExerciseService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.exerciseSubscriptions.push(
      this.uiService.loadingStateChanges.subscribe(loading => {
        this.isLoading = loading;
      })
    );
    this.exerciseSubscriptions.push(
      this.exerciseService.exercisesChanged.subscribe(exercises => {
        this.exercises = exercises;
      })
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.exerciseService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscriptions) {
      this.exerciseSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
