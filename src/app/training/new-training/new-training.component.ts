import { Component, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  private exercises: Exercise[];
  private db;
  private firestore;
  private data;

  constructor(private exerciseService: ExerciseService) {
    // set database ref
    this.db = window[`dbRef`];

    // set firestore
    this.firestore = window[`firestore`];
    this.firestore.settings({
      timestampsInSnapshots: true
    });
  }

  ngOnInit() {
    this.data = this.firestore.collection('availableExercises').get().then(res => {
      res.forEach( doc => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data(), undefined, 2)}`);
      });
    });
  }

  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }
}
