import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../store/auth/auth.actions';
import { selectSession } from '../store/auth/auth.selectors';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly store = inject(Store);

  protected readonly navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'DS' },
    { label: 'Shipments', path: '/shipments', icon: 'SH' },
    { label: 'Customers', path: '/customers', icon: 'CU' },
    { label: 'Operations', path: '/operations', icon: 'OP' },
    { label: 'Analytics', path: '/analytics', icon: 'AN' }
  ];

  protected readonly sidebarCollapsed = signal(false);
  protected readonly session = this.store.selectSignal(selectSession);
  protected readonly userBadge = computed(() => this.session()?.name?.charAt(0) ?? 'F');

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  protected logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
