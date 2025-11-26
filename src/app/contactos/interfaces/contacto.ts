import { Entidad } from '../../entidades/interfaces/entidad';

export interface Contacto {
  id: number;
  nombre: string;
  identificacion: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  notas?: string;
  entidad_id: number;
  entidad?: Entidad;
  fecha_nacimiento?: Date;
  creado_por?: string;
  created_at?: Date;
  updated_at?: Date;
}
