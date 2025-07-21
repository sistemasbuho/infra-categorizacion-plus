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
  data: AsignacionManualRequest
): Promise<void> {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: 'asignaciones/asignar-manual/',
    data: data,
  };
  return categorizationPlusRequest<void>(config);
}

export async function asignarPorFecha(
  data: AsignacionPorFechaRequest
): Promise<void> {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: 'asignaciones/asignar-por-fecha/',
    data: data,
  };
  return categorizationPlusRequest<void>(config);
}

export async function getResumenAsignados(
  proyectoId: string
): Promise<ResumenAsignados> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'asignaciones/resumen-asignados/',
    params: {
      proyecto_id: proyectoId,
    },
  };
  return categorizationPlusRequest<ResumenAsignados>(config);
}
