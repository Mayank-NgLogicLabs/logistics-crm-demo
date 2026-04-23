import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authActions } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  protected readonly revealPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly quickProfiles = [
    { label: 'Ops Lead', email: 'ops@freightflow.io' },
    { label: 'Regional Manager', email: 'manager@freightflow.io' }
  ];

  protected readonly form = this.fb.nonNullable.group({
    email: ['ops@freightflow.io', [Validators.required, Validators.email]],
    password: ['welcome123', [Validators.required, Validators.minLength(6)]]
  });

  protected togglePassword(): void {
    this.revealPassword.update((value) => !value);
  }

  protected applyProfile(email: string): void {
    this.form.patchValue({ email });
  }

  protected login(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(authActions.login(this.form.getRawValue()));
  }
}
