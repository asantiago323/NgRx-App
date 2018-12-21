import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseService } from '../training/exercise.service';
import { UIService } from '../shared/ui.service';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  public authChange = new Subject<boolean>();
  private user: User;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private exerciseService: ExerciseService,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.createUserObject(user);
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.exerciseService.cancelSubscriptions();
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        this.createUserObject(res.user);
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .catch(e => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiService.showSnackbar(e.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        this.createUserObject(res.user);
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .catch(e => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiService.showSnackbar(e.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private createUserObject(userData) {
    this.user = {
      email: userData.email,
      userId: userData.uid
    };
  }
}
