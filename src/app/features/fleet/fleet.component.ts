import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { FleetActions } from '../../store/fleet/fleet.actions';
import { selectVehicles, selectIsLoading, selectFleetStats } from '../../store/fleet/fleet.selectors';
import { Vehicle } from '../../core/models/fleet.model';

@Component({
    selector: 'app-fleet',
    imports: [StatusBadgeComponent, TitleCasePipe, ReactiveFormsModule],
    templateUrl: './fleet.component.html',
    styleUrl: './fleet.component.scss'
})
export class FleetComponent implements OnInit {
  private store = inject(Store);
  private sanitizer = inject(DomSanitizer);
  showVehicleForm = signal(false);

  vehicleForm = new FormGroup({
    registrationNumber: new FormControl('', Validators.required),
    type: new FormControl('truck', Validators.required),
    make: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    year: new FormControl(new Date().getFullYear(), Validators.required),
    capacity: new FormControl(20, Validators.required),
    driverName: new FormControl(''),
    currentLocation: new FormControl(''),
  });

  vehicles    = toSignal(this.store.select(selectVehicles), { initialValue: [] as Vehicle[] });
  isLoading   = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  fleetStats  = toSignal(this.store.select(selectFleetStats), { initialValue: { total: 0, active: 0, maintenance: 0, idle: 0 } });
  statusFilter = signal<'all' | Vehicle['status']>('all');

  filteredVehicles = computed(() => {
    const f = this.statusFilter();
    return f === 'all' ? this.vehicles() : this.vehicles().filter((v: Vehicle) => v.status === f);
  });


  ngOnInit(): void {
    this.store.dispatch(FleetActions.loadFleet());
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) { this.vehicleForm.markAllAsTouched(); return; }
    const v = this.vehicleForm.value;
    const newVehicle = {
      id: 'v' + Date.now(),
      registrationNumber: v.registrationNumber!,
      type: v.type as any,
      make: v.make!,
      model: v.model!,
      year: v.year!,
      capacity: v.capacity!,
      status: 'idle' as const,
      driverName: v.driverName || undefined,
      currentLocation: v.currentLocation || undefined,
      mileage: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      fuelLevel: 100,
    };
    this.store.dispatch(FleetActions.loadFleetSuccess({ vehicles: [...this.vehicles(), newVehicle] }));
    this.vehicleForm.reset({ type: 'truck', year: new Date().getFullYear(), capacity: 20 });
    this.showVehicleForm.set(false);
  }

  getSafeIcon(type: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getVehicleIcon(type));
  }

  getVehicleIcon(type: string): string {
    const icons: Record<string, string> = {
      truck: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      van: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m0 0h3l3 4v3h-6V8z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
      ship: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1C7 22 7 20 9.5 20c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0021 14l-9-4-9 4c.61 3.37 2.52 6.61 4.86 8"/><path d="M12 2v6l4 2"/></svg>`,
      rail: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`,
    };
    return icons[type] ?? icons['truck'];
  }
}
