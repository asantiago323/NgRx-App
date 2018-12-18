import { Component, OnInit } from "@angular/core";
import { Exercise } from "../exercise.model";
import { ExerciseService } from "../exercise.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.scss"]
})
export class NewTrainingComponent implements OnInit {
  exercises: Exercise[];

  constructor(private exerciseService: ExerciseService) {
    this.exercises = this.exerciseService.getExercises();
  }

  ngOnInit() {}

  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }
}
