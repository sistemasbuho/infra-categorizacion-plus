import { GeneralRequest } from './funcs';

/*
============================================================
==    Todas las funciones asincronas deberán estar aquí   ==
============================================================
*/

export async function getArticleData(id: string | number) {
  console.log(GeneralRequest(`articulos/${id}/fragmentos`));
  return await GeneralRequest(`articulos/${id}/fragmentos`);
}

export async function getTagCategorization(query: string, projectId: number) {
  return await GeneralRequest(`buscar_variables`, 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tag',
    proyecto_id: projectId,
  });
}

export async function getTemaCategorization(query, projectId) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tema',
    proyecto_id: projectId,
  });
}

export async function getTonoCategorization(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tono',
  });
}

// esta petición es para los activos y los pasivos
export async function getActivoPasivoCategorization(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Actor',
  });
}
