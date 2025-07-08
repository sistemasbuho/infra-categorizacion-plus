import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from './axiosRequest';
import { TagResponse, PaginatedResponse } from '../hooks/useTags';

let config: AxiosRequestConfig = {};

export async function getTags(
  url?: string
): Promise<PaginatedResponse<TagResponse>> {
  config = {
    method: 'GET',
    url: url || 'tags/',
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
