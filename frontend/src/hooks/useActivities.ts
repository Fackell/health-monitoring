import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../services/activityService';

import type { CreateActivityData, UpdateActivityData } from '../types/activity';

import type { ActivityFilters } from '../services/activityService';

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: ActivityFilters) => [...activityKeys.lists(), filters] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

export function useActivities(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => getActivities(filters),
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => getActivity(id),
    enabled: Boolean(id),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityData) => createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      toast.success('Активність успішно додано');
    },
    onError: () => {
      toast.error('Не вдалося додати активність');
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActivityData }) =>
      updateActivity(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({
        queryKey: activityKeys.detail(variables.id),
      });
      toast.success('Активність оновлено');
    },
    onError: () => {
      toast.error('Не вдалося оновити активність');
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      toast.success('Активність видалено');
    },
    onError: () => {
      toast.error('Не вдалося видалити активність');
    },
  });
}
