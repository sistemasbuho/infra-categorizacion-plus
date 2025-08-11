import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

interface Usuario {
  id: string;
  nombre: string;
  numero_articulos: number;
}

export interface Colaborador {
  id: number;
  username: string;
  email: string;
  nombre_completo: string;
}

export interface AsignacionManualRequest {
  desde_id: number;
  hasta_id: number;
  cantidad: number;
  proyecto_id: string;
}

export interface AsignacionPorFechaRequest {
  desde_id: number;
  hasta_id: number;
  cantidad: number;
  fecha_inicio: string;
  fecha_fin: string;
  proyecto_id: string;
}

export interface ResumenAsignados {
  usuarios?: Usuario[];
  [key: string]: any;
}

export type TipoRecurso = 'articulos' | 'redes';

const getEndpointPrefix = (tipo: TipoRecurso): string => {
  return tipo === 'redes' ? 'redes/asignar' : 'asignaciones';
};

const getEndpointSuffix = (tipo: TipoRecurso, action: string): string => {
  return tipo === 'redes' ? `${action}-${tipo}` : action;
};

export async function searchColaboradores(
  nombre: string
): Promise<Colaborador[]> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'usuarios/buscar/',
    params: {
      nombre: nombre,
    },
  };
  return categorizationPlusRequest<Colaborador[]>(config);
}

export async function asignarManual(
  data: AsignacionManualRequest,
  tipo: TipoRecurso = 'articulos'
): Promise<void> {
  const prefix = getEndpointPrefix(tipo);
  const suffix = getEndpointSuffix(tipo, 'asignar-manual');

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: `${prefix}/${suffix}/`,
    data: data,
  };
  return categorizationPlusRequest<void>(config);
}

export async function asignarPorFecha(
  data: AsignacionPorFechaRequest,
  tipo: TipoRecurso = 'articulos'
): Promise<void> {
  const prefix = getEndpointPrefix(tipo);
  const suffix = getEndpointSuffix(tipo, 'asignar-por-fecha');

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: `${prefix}/${suffix}/`,
    data: data,
  };
  return categorizationPlusRequest<void>(config);
}

export async function getResumenAsignados(
  proyectoId: string,
  tipo: TipoRecurso = 'articulos'
): Promise<ResumenAsignados> {
  const prefix = getEndpointPrefix(tipo);
  const suffix = getEndpointSuffix(tipo, 'resumen-asignados');

  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `${prefix}/${suffix}/`,
    params: {
      proyecto_id: proyectoId,
    },
  };
  return categorizationPlusRequest<ResumenAsignados>(config);
}
