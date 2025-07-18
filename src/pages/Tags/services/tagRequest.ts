import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';
import { TagResponse, PaginatedResponse } from '../hooks/useTags';

let config: AxiosRequestConfig = {};

export async function getTags(
  page: number = 1,
  pageSize: number = 50,
  nombre: string = ''
): Promise<PaginatedResponse<TagResponse>> {
  config = {
    method: 'GET',
    url: 'tags/',
    params: {
      page,
      page_size: pageSize,
      ...(nombre && { nombre }),
    },
  };
  return await categorizationPlusRequest<PaginatedResponse<TagResponse>>(
    config
  );
}

export async function createTag(newTag: TagResponse) {
  config = {
    method: 'POST',
    url: 'tags/',
    data: newTag,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}

export async function updateTag(tag: TagResponse) {
  config = {
    method: 'PATCH',
    url: `tags/${tag.id}/`,
    data: tag,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}

export async function deleteATag(tagid: TagResponse['id']) {
  config = {
    method: 'DELETE',
    url: `tags/${tagid}/`,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}
