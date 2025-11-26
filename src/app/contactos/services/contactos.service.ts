import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { Contacto } from '../interfaces/contacto';
import { StateContacto } from '../interfaces/state-contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  url: string = environment.apiUrl;

  #state = signal<StateContacto>({
    loading: true,
    contactos: [],
  });

  contactos = computed(() => this.#state().contactos);
  loading = computed(() => this.#state().loading);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.#state.set({ loading: true, contactos: [] });
    this.http
      .get<Contacto[]>(`${this.url}contactos`)
      .pipe(
        tap((res: Contacto[]) => {
          this.#state.set({
            loading: false,
            contactos: res,
          });
        }),
        catchError((error: any) => {
          console.error('Error al cargar contactos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los contactos',
          });
          this.#state.set({ loading: false, contactos: [] });
          return of([]);
        })
      )
      .subscribe();
  }

  create(contacto: Partial<Contacto>): void {
    this.http
      .post<Contacto>(`${this.url}contactos`, contacto)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contacto creado correctamente',
          });
          this.refresh();
        }),
        catchError((error: any) => {
          console.error('Error al crear contacto:', error);
          // Manejo específico para errores de validación del backend (ej. duplicados)
          const errorMsg =
            error.error?.error ||
            error.error?.message ||
            'No se pudo crear el contacto';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
          });
          return of(null);
        })
      )
      .subscribe();
  }

  update(id: number, contacto: Partial<Contacto>): void {
    this.http
      .put<Contacto>(`${this.url}contactos/${id}`, contacto)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contacto actualizado correctamente',
          });
          this.refresh();
        }),
        catchError((error: any) => {
          console.error('Error al actualizar contacto:', error);
          const errorMsg =
            error.error?.error ||
            error.error?.message ||
            'No se pudo actualizar el contacto';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
          });
          return of(null);
        })
      )
      .subscribe();
  }

  delete(contacto: Contacto): void {
    this.http
      .delete<any>(`${this.url}contactos/${contacto.id}`)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contacto eliminado correctamente',
          });
          this.refresh();
        }),
        catchError((error: any) => {
          console.error('Error al eliminar contacto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'No se pudo eliminar el contacto',
          });
          return of(null);
        })
      )
      .subscribe();
  }

  deleteMultiple(contactos: Contacto[]): void {
    let completed = 0;
    const total = contactos.length;

    contactos.forEach((contacto) => {
      this.http
        .delete<any>(`${this.url}contactos/${contacto.id}`)
        .pipe(
          tap(() => {
            completed++;
            if (completed === total) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `${total} contacto(s) eliminado(s) correctamente`,
              });
              this.refresh();
            }
          }),
          catchError((error: any) => {
            console.error('Error al eliminar contacto:', error);
            completed++;
            if (completed === total) {
              this.refresh();
            }
            return of(null);
          })
        )
        .subscribe();
    });
  }
}
