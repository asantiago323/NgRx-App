import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  MaterialModule,
  CommonModule
];

@NgModule({
  imports: [...sharedModules],
  exports: [...sharedModules]
})
export class SharedModule {}
