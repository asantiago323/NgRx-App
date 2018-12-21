import { NgModule } from '@angular/core';
import { PastTrainingComponent } from './past-training/past-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';

@NgModule({
  declarations: [
    PastTrainingComponent,
    NewTrainingComponent,
    TrainingComponent,
    CurrentTrainingComponent,
    StopTrainingComponent
  ],
  imports: [SharedModule, TrainingRoutingModule],
  exports: [],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule {}
