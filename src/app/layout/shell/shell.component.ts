import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-shell',
    imports: [RouterOutlet, SidebarComponent, TopbarComponent],
    templateUrl: './shell.component.html',
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
