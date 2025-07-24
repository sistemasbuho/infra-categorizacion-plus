import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export interface CampoFormulario {
  nombre_campo: string;
  tipo: 'text' | 'select';
  opciones: string | null;
  obligatorio: boolean;
}

export interface FormularioData {
  nombre: string;
  descripcion: string;
  proyecto_id: string;
  campos: CampoFormulario[];
}

export interface FormularioResponse {
  id: string;
  nombre: string;
  descripcion: string;
  proyecto_id: string;
  campos: CampoFormulario[];
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
