import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  pastExercisesSubscriptions: Subscription[] = [];
  isLoading = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private exerciseService: ExerciseService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.pastExercisesSubscriptions.push(
      this.uiService.loadingStateChanges.subscribe(loading => {
        this.isLoading = loading;
      })
    );
    this.pastExercisesSubscriptions.push(
      this.exerciseService.finishedExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.dataSource.data = exercises;
        }
      )
    );
    this.exerciseService.getPastExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.pastExercisesSubscriptions) {
      this.pastExercisesSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
