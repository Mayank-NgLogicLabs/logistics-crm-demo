import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectIsLoading, selectError } from '../../../store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  private store = inject(Store);

  isLoading = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  authError  = toSignal(this.store.select(selectError), { initialValue: null });
  showPassword = signal(false);

  form = new FormGroup({
    email:    new FormControl('admin@freightflow.com', [Validators.required, Validators.email]),
    password: new FormControl('Password@123', [Validators.required, Validators.minLength(6)]),
    remember: new FormControl(false),
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password } = this.form.value;
    this.store.dispatch(AuthActions.login({ email: email!, password: password! }));
  }
}
