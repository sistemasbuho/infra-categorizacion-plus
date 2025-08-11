import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export interface CampoCategorizacion {
  id: string;
  nombre_campo: string;
  tipo: string;
  opciones: string;
  obligatorio: boolean;
  valor?: string;
}

export interface DatosPublicacion {
  id: string;
  asignado_email: string;
  proyecto_nombre: string;
  proyecto_id: string;
  created_at: string;
  modified_at: string;
  publicacion_id: string;
  fecha: string;
  autor: string;
  titulo: string | null;
  url: string;
  keyword: string | null;
  contenido: string;
  red_social: string;
  ubicacion: string;
  medio: string | null;
  me_gusta: number;
  me_encanta: number | null;
  me_importa: number | null;
  me_divierte: number | null;
  me_asombra: number | null;
  me_entristece: number | null;
  me_enoja: number | null;
  comentario: number;
  respuesta_comentarios: number | null;
  compartido: number;
  interaccion: number;
  reproduccion: number;
  seguidores: number;
  alcance: number;
  asignado: boolean;
  borrado: boolean;
  descripcion_borrado: string;
  categorizado: boolean;
  pasivo: boolean | null;
  created_by: string | null;
  modified_by: string | null;
  categorizacion_proyecto: string;
  asignado_a: number;
  categorizacion_campos: CampoCategorizacion[];
}

export interface Formulario {
  id: string;
  nombre: string;
  descripcion: string;
  campos: CampoCategorizacion[];
}

export interface CategorizacionRedesResponse {
  datos_publicacion: DatosPublicacion[];
  formulario: Formulario;
  siguiente_publicacion: string | null;
}

let config: AxiosRequestConfig = {};

export async function getCategorizacionRedes(
  publicacion_id: string,
  proyecto_id: string
): Promise<CategorizacionRedesResponse> {
  config = {
    method: 'GET',
    url: 'redes/categorizacion-publicacion',
    params: {
      publicacion_id,
      proyecto_id,
    },
  };
  return await categorizationPlusRequest<CategorizacionRedesResponse>(config);
}

export interface GuardarCategorizacionData {
  publicacion_id: string;
  categorizacion_proyecto: string;
  campos_formulario: Array<{
    campo_id: string;
    valor: string;
  }>;
}

export async function guardarCategorizacion(
  data: GuardarCategorizacionData
): Promise<{ message: string }> {
  config = {
    method: 'POST',
    url: 'redes/crear-publicacion/',
    data: data,
  };
  return await categorizationPlusRequest<{ message: string }>(config);
}
