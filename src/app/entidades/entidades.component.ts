import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Entidad } from './interfaces/entidad';
import { EntidadesService } from './services/entidades.service';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService],
})
export class EntidadesComponent {
  public entidadesService = inject(EntidadesService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[] = [];

  displayDialog: boolean = false;
  entidadForm: FormGroup;
  isEditing: boolean = false;
  currentEntidadId: number | null = null;

  constructor() {
    this.entidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(191)]],
      nit: ['', [Validators.required, Validators.maxLength(191)]],
      direccion: ['', [Validators.maxLength(191)]],
      telefono: ['', [Validators.maxLength(191)]],
      email: ['', [Validators.email, Validators.maxLength(191)]],
    });
  }

  openNew() {
    this.entidadForm.reset();
    this.isEditing = false;
    this.currentEntidadId = null;
    this.displayDialog = true;
  }

  edit(entidad: Entidad) {
    this.entidadForm.patchValue({
      nombre: entidad.nombre,
      nit: entidad.nit,
      direccion: entidad.direccion,
      telefono: entidad.telefono,
      email: entidad.email,
    });
    this.isEditing = true;
    this.currentEntidadId = entidad.id;
    this.displayDialog = true;
  }

  save() {
    if (this.entidadForm.invalid) {
      this.entidadForm.markAllAsTouched();
      return;
    }

    const entidadData = this.entidadForm.value;

    if (this.isEditing && this.currentEntidadId) {
      this.entidadesService.update(this.currentEntidadId, entidadData);
    } else {
      this.entidadesService.create(entidadData);
    }

    this.displayDialog = false;
    this.entidadForm.reset();
  }

  deleteSelected() {
    if (this.selectedEntidades.length > 0) {
      this.entidadesService.deleteMultiple(this.selectedEntidades);
      this.selectedEntidades = [];
    }
  }

  get f() {
    return this.entidadForm.controls;
  }
}
