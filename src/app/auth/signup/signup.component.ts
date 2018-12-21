import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public maxDate;
  isLoading = false;
  private loadingSubs: Subscription;
  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanges.subscribe(loading => {
      this.isLoading = loading;
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form[`email`],
      password: form[`password`]
    });
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }
}
