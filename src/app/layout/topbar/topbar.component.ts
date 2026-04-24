import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockDataService } from '../../core/services/mock-data.service';
import { selectUser } from '../../store/auth/auth.selectors';
import { AuthActions } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  private store = inject(Store);
  user = toSignal(this.store.select(selectUser));
  notifOpen = signal(false);
  searchVisible = signal(false);
}
