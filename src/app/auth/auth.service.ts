import { Subject } from 'rxjs';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseService } from '../training/exercise.service';

@Injectable()
export class AuthService {
  public authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private user: User;
  private afAuth;

  constructor(private router: Router, private trainingService: ExerciseService) {
    this.afAuth = window[`auth`];
  }

  registerUser(authData: AuthData) {
    // user being registered
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(res => {
      this.authSuccess();
    })
    .catch(e => {
      console.log(`Err Message ${e.message}`);
    });
    this.authSuccess();
  }

  login(authData: AuthData) {
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(res => {
      this.user = this.createUserObject(res[`user`][`email`], res[`user`][`uid`]);
      this.authSuccess();
    })
    .catch(e => {
      console.log(`Err Message ${e.message}`);
    });
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.afAuth.signOut();
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
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
