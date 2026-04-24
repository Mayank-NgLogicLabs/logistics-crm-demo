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
  standalone: true,
  imports: [StatusBadgeComponent, TitleCasePipe, ReactiveFormsModule],
  template: `
    <div class="page-header">
        <div>
          <h1 class="heading-lg">Fleet Management</h1>
          <p class="text-muted text-sm">{{ vehicles().length }} vehicles registered</p>
        </div>
      <button class="btn btn-primary" (click)="showVehicleForm.set(true)" id="add-vehicle-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vehicle
        </button>
      </div>

      <!-- Fleet Stats -->
      <div class="fleet-stats">
        <div class="fstat-card">
          <div class="fstat-val">{{ fleetStats().total }}</div>
          <div class="fstat-lbl">Total Fleet</div>
        </div>
        <div class="fstat-card active-stat">
          <div class="fstat-val">{{ fleetStats().active }}</div>
          <div class="fstat-lbl">Active</div>
        </div>
        <div class="fstat-card maint-stat">
          <div class="fstat-val">{{ fleetStats().maintenance }}</div>
          <div class="fstat-lbl">Maintenance</div>
        </div>
        <div class="fstat-card idle-stat">
          <div class="fstat-val">{{ fleetStats().idle }}</div>
          <div class="fstat-lbl">Idle</div>
        </div>
      </div>

      <!-- Status filter -->
      <div class="status-tabs">
        <button class="status-tab" [class.active]="statusFilter() === 'all'" (click)="statusFilter.set('all')" id="fleet-all">All</button>
        <button class="status-tab" [class.active]="statusFilter() === 'active'" (click)="statusFilter.set('active')" id="fleet-active">Active</button>
        <button class="status-tab" [class.active]="statusFilter() === 'maintenance'" (click)="statusFilter.set('maintenance')" id="fleet-maint">Maintenance</button>
        <button class="status-tab" [class.active]="statusFilter() === 'idle'" (click)="statusFilter.set('idle')" id="fleet-idle">Idle</button>
      </div>

      <!-- Vehicle Grid -->
      <div class="grid grid-auto-fill vehicle-grid">
        @if (isLoading()) {
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="skeleton" style="height: 240px; border-radius: var(--radius-xl)"></div>
          }
        } @else {
          @for (v of filteredVehicles(); track v.id) {
            <div class="vehicle-card" [class]="'status-card-' + v.status" [id]="'vehicle-' + v.id">
              <div class="vc-header">
                <div class="vc-icon">
                  <span [innerHTML]="getVehicleIcon(v.type)"></span>
                </div>
                <app-status-badge [status]="v.status" />
              </div>
              <div class="vc-reg">{{ v.registrationNumber }}</div>
              <div class="vc-name">{{ v.make }} {{ v.model }}</div>
              <div class="vc-meta text-sm text-muted">{{ v.year }} · {{ v.type | titlecase }} · {{ v.capacity }}T capacity</div>

              @if (v.driverName) {
                <div class="vc-driver">
                  <div class="driver-avatar">{{ getInitials(v.driverName) }}</div>
                  <span class="text-sm">{{ v.driverName }}</span>
                </div>
              }

              @if (v.currentLocation) {
                <div class="vc-location text-sm text-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ v.currentLocation }}
                </div>
              }

              <div class="vc-fuel">
                <div class="fuel-bar-bg">
                  <div class="fuel-bar-fill" [style.width.%]="v.fuelLevel" [class.low]="v.fuelLevel < 30"></div>
                </div>
                <span class="text-xs text-muted">Fuel {{ v.fuelLevel }}%</span>
              </div>

              <button class="btn btn-ghost btn-sm w-full" [id]="'assign-' + v.id" style="margin-top: 0.5rem">
                Assign to Shipment
              </button>
            </div>
          }
        }
      </div>

    @if (showVehicleForm()) {
      <div class="overlay-backdrop" (click)="showVehicleForm.set(false)"></div>
      <div class="drawer">
        <div class="drawer-header">
          <div>
            <h2 class="heading-md">Add New Vehicle</h2>
            <p class="text-sm text-muted">Register a vehicle to your fleet</p>
          </div>
          <button class="btn btn-ghost btn-icon" (click)="showVehicleForm.set(false)" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="drawer-body">
          <form [formGroup]="vehicleForm" (ngSubmit)="submitVehicle()" id="vehicle-form">
            <div class="input-wrap">
              <label for="v-reg">Registration Number</label>
              <input id="v-reg" class="input" formControlName="registrationNumber" placeholder="MH-14-AB-1234">
            </div>
            <div class="drawer-row">
              <div class="input-wrap">
                <label for="v-type">Vehicle Type</label>
                <select id="v-type" class="input" formControlName="type">
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="ship">Ship</option>
                  <option value="rail">Rail</option>
                </select>
              </div>
              <div class="input-wrap">
                <label for="v-year">Year</label>
                <input id="v-year" class="input" type="number" formControlName="year" placeholder="2024">
              </div>
            </div>
            <div class="drawer-row">
              <div class="input-wrap">
                <label for="v-make">Make</label>
                <input id="v-make" class="input" formControlName="make" placeholder="Tata">
              </div>
              <div class="input-wrap">
                <label for="v-model">Model</label>
                <input id="v-model" class="input" formControlName="model" placeholder="Prima 4928">
              </div>
            </div>
            <div class="drawer-row">
              <div class="input-wrap">
                <label for="v-capacity">Capacity (Tonnes)</label>
                <input id="v-capacity" class="input" type="number" formControlName="capacity" placeholder="20">
              </div>
              <div class="input-wrap">
                <label for="v-driver">Driver Name</label>
                <input id="v-driver" class="input" formControlName="driverName" placeholder="Optional">
              </div>
            </div>
            <div class="input-wrap">
              <label for="v-location">Current Location</label>
              <input id="v-location" class="input" formControlName="currentLocation" placeholder="Mumbai Port">
            </div>
            <div class="drawer-footer">
              <button type="button" class="btn btn-ghost" (click)="showVehicleForm.set(false)">Cancel</button>
              <button type="submit" class="btn btn-primary" id="vehicle-submit-btn">Add Vehicle</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
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
