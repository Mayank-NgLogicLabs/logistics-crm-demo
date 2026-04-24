import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, BottomNavComponent],
  template: `
    <div class="shell" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())" />

      <div class="shell-main">
        <app-topbar
          [sidebarCollapsed]="sidebarCollapsed()"
          (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
        <main class="shell-content">
          <router-outlet />
        </main>
      </div>

      <app-bottom-nav class="hide-desktop" />
    </div>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  sidebarCollapsed = signal(false);

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth < 1024) {
      this.sidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 1024) {
      this.sidebarCollapsed.set(true);
    }
  }
}
