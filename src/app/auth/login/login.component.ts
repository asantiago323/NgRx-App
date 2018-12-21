import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoading$: Observable<boolean>;
  private loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  ngOnInit() {
    // this.loadingSubs = this.uiService.loadingStateChanges.subscribe(loading => {
    //   this.isLoading = loading;
    // });
    this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
}
