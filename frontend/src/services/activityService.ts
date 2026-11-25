import api from './api';
import type { Activity, CreateActivityData, UpdateActivityData } from '../types/activity';
import type { PaginatedResponse, ApiResponse } from '../types/api';

export interface ActivityFilters {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export async function getActivities(
  filters: ActivityFilters = {}
): Promise<PaginatedResponse<Activity>> {
  const response = await api.get<PaginatedResponse<Activity>>('/activities', {
    params: filters,
  });

  return response.data;
}

export async function getActivity(id: string): Promise<Activity> {
  const response = await api.get<ApiResponse<Activity>>(`/activities/${id}`);

  if (!response.data.data) {
    throw new Error('Запис не знайдено');
  }

  return response.data.data;
}

export async function createActivity(data: CreateActivityData): Promise<Activity> {
  const response = await api.post<ApiResponse<Activity>>('/activities', data);

  if (!response.data.data) {
    throw new Error('Не вдалося створити запис');
  }

  return response.data.data;
}

export async function updateActivity(id: string, data: UpdateActivityData): Promise<Activity> {
  const response = await api.put<ApiResponse<Activity>>(`/activities/${id}`, data);

  if (!response.data.data) {
    throw new Error('Не вдалося оновити запис');
  }

  return response.data.data;
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete(`/activities/${id}`);
}
