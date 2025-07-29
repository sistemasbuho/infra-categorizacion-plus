import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export interface CampoFormulario {
  nombre_campo: string;
  tipo: 'text' | 'select';
  opciones: string | null;
  obligatorio: boolean;
}

export interface CampoFormularioConId extends CampoFormulario {
  id: string;
  activo: boolean;
}

export interface CampoFormularioUpdate {
  id?: string;
  nombre_campo: string;
  tipo: 'text' | 'select';
  opciones: string | null;
  obligatorio: boolean;
  activo?: boolean;
}

export interface FormularioData {
  nombre: string;
  descripcion: string;
  proyecto_id: string;
  campos: CampoFormulario[];
}

export interface FormularioUpdateData {
  formulario_id: string;
  nombre: string;
  descripcion: string;
  campos: CampoFormularioUpdate[];
}

export interface FormularioUpdateBody {
  nombre: string;
  descripcion: string;
  campos: CampoFormularioUpdate[];
}

export interface FormularioResponse {
  formulario_id: string;
  nombre: string;
  descripcion: string;
  proyecto_id: string;
  campos: CampoFormularioConId[];
  created_at: string;
  modified_at: string;
}

export async function crearFormulario(
  formularioData: FormularioData
): Promise<FormularioResponse> {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: 'redes/crear-formulario/',
    data: formularioData,
  };
  return categorizationPlusRequest<FormularioResponse>(config);
}

export async function actualizarFormulario(
  formularioData: FormularioUpdateData
): Promise<FormularioResponse> {
  const config: AxiosRequestConfig = {
    method: 'PATCH',
    url: 'redes/actualizar-formulario/',
    data: formularioData,
  };
  return categorizationPlusRequest<FormularioResponse>(config);
}

export async function obtenerFormulario(
  formularioId: string
): Promise<FormularioResponse> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `redes/obtener-formulario/?formulario_id=${formularioId}`,
  };
  return categorizationPlusRequest<FormularioResponse>(config);
}
