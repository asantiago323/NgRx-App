import {
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private store: Store<fromRoot.State>) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const allowed = this.store
      .select(fromRoot.getIsAuthenticated)
      .pipe(take(1));
    if (allowed) {
      return allowed;
    } else {
      this.router.navigate(['/login']);
    }
  }

  canLoad(route: Route) {
    const allowed = this.store
      .select(fromRoot.getIsAuthenticated)
      .pipe(take(1));
    if (allowed) {
      return allowed;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
