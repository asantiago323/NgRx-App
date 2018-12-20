import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public maxDate;
  public isLoading = false;
  private loadingSub: Subscription;
  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSub = this.uiService.loadingSubscription.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form[`email`],
      password: form[`password`]
    });
  }

  ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
