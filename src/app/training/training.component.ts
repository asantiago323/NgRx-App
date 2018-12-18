import { Component, OnInit } from "@angular/core";
import { ExerciseService } from "./exercise.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.scss"]
})
export class TrainingComponent implements OnInit {
  ongoingTraining = false;
  exerciseSubscription: Subscription;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.exerciseSubscription = this.exerciseService.exercising.subscribe(
      exercise => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }
}
