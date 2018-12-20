import { Subject } from 'rxjs';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseService } from '../training/exercise.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  public authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private user: User;
  private afAuth;

  constructor(
    private router: Router,
    private trainingService: ExerciseService,
    private uiService: UIService
  ) {
    this.afAuth = window[`auth`];
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingSubscription.next(true);
    // user being registered
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(res => {
      this.uiService.loadingSubscription.next(false);
      this.authSuccess();
    })
    .catch(e => {
      this.uiService.loadingSubscription.next(false);
      this.uiService.openSnackbar(e.message, null, 3000);
    });
    this.authSuccess();
  }

  login(authData: AuthData) {
    this.uiService.loadingSubscription.next(true);
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(res => {
      this.uiService.loadingSubscription.next(false);
      this.user = this.createUserObject(res[`user`][`email`], res[`user`][`uid`]);
      this.authSuccess();
    })
    .catch(e => {
      this.uiService.loadingSubscription.next(false);
      this.uiService.openSnackbar(e.message, null, 3000);
    });
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
    this.afAuth.signOut();
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  private createUserObject(email, id): User {
    return {email: email, userId: id};
  }
}
