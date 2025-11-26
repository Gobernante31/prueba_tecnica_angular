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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { EntidadesService } from '../entidades/services/entidades.service';
import { Contacto } from './interfaces/contacto';
import { ContactosService } from './services/contactos.service';

@Component({
  selector: 'app-contactos',
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
    InputTextareaModule,
    DropdownModule,
  ],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css',
  providers: [MessageService],
})
export class ContactosComponent {
  public contactosService = inject(ContactosService);
  public entidadesService = inject(EntidadesService);
  private fb = inject(FormBuilder);

  total = computed(() => this.contactosService.contactos().length);
  selectedContactos: Contacto[] = [];

  displayDialog: boolean = false;
  contactoForm: FormGroup;
  isEditing: boolean = false;
  currentContactoId: number | null = null;

  constructor() {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(191)]],
      identificacion: ['', [Validators.required, Validators.maxLength(191)]],
      email: ['', [Validators.email, Validators.maxLength(191)]],
      telefono: ['', [Validators.maxLength(191)]],
      direccion: ['', [Validators.maxLength(191)]],
      entidad_id: [null, [Validators.required]],
      notas: [''],
    });
  }

  openNew() {
    this.contactoForm.reset();
    this.isEditing = false;
    this.currentContactoId = null;
    this.displayDialog = true;
  }

  edit(contacto: Contacto) {
    this.contactoForm.patchValue({
      nombre: contacto.nombre,
      identificacion: contacto.identificacion,
      email: contacto.email,
      telefono: contacto.telefono,
      direccion: contacto.direccion,
      entidad_id: contacto.entidad_id,
      notas: contacto.notas,
    });
    this.isEditing = true;
    this.currentContactoId = contacto.id;
    this.displayDialog = true;
  }

  save() {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    const contactoData = this.contactoForm.value;

    if (this.isEditing && this.currentContactoId) {
      this.contactosService.update(this.currentContactoId, contactoData);
    } else {
      this.contactosService.create(contactoData);
    }

    this.displayDialog = false;
    this.contactoForm.reset();
  }

  deleteSelected() {
    if (this.selectedContactos.length > 0) {
      this.contactosService.deleteMultiple(this.selectedContactos);
      this.selectedContactos = [];
    }
  }

  get f() {
    return this.contactoForm.controls;
  }
}
