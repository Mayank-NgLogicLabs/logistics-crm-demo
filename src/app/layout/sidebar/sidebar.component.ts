import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';

interface NavItem { path: string; label: string; iconHtml: SafeHtml; }

const RAW_ICONS: Record<string, string> = {
  dashboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  shipments: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  customers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  fleet:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>`,
  reports:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private store = inject(Store);
  private sanitizer = inject(DomSanitizer);

  user = toSignal(this.store.select(selectUser));

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', iconHtml: this.sanitizer.bypassSecurityTrustHtml(RAW_ICONS['dashboard']) },
    { path: '/shipments', label: 'Shipments',  iconHtml: this.sanitizer.bypassSecurityTrustHtml(RAW_ICONS['shipments']) },
    { path: '/customers', label: 'Customers',  iconHtml: this.sanitizer.bypassSecurityTrustHtml(RAW_ICONS['customers']) },
    { path: '/fleet',     label: 'Fleet',      iconHtml: this.sanitizer.bypassSecurityTrustHtml(RAW_ICONS['fleet']) },
    { path: '/reports',   label: 'Reports',    iconHtml: this.sanitizer.bypassSecurityTrustHtml(RAW_ICONS['reports']) },
  ];

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  onNavClick(): void {
    if (window.innerWidth < 1024 && !this.collapsed) {
      this.toggleCollapse.emit();
    }
  }
}
