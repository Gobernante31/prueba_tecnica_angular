import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { EntidadesService } from '../entidades/services/entidades.service';
import { ContactosService } from '../contactos/services/contactos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private entidadesService = inject(EntidadesService);
  private contactosService = inject(ContactosService);

  totalEntidades = computed(() => this.entidadesService.entidades().length);
  totalContactos = computed(() => this.contactosService.contactos().length);

  recentEntidades = computed(() =>
    this.entidadesService.entidades().slice(0, 5)
  );
}
