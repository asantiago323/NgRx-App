import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class UIService {
  loadingSubscription = new Subject<boolean>();

  constructor(
    private snackbar: MatSnackBar
  ) {}

  openSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
