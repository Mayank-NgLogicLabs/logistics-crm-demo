import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styles: [`:host { display: block; min-height: 100vh; }`]
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const user = this.authService.getStoredUser();
    if (user) {
      this.store.dispatch(AuthActions.restoreSession({ user }));
    }
  }
}
