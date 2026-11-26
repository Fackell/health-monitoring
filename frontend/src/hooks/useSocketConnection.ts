import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { socket, connectSocket, disconnectSocket } from '../services/socket';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { activityKeys } from './useActivities';

import type { Activity } from '../types/activity';

interface DeletedActivity {
  id: string;
}

export default function useSocketConnection() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    const addNotification = useNotificationStore.getState().addNotification;

    const handleCreated = (activity: Activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });

      addNotification({
        type: 'success',
        title: 'Нову активність додано',
        message: `Тип активності: ${activity.type}`,
      });
    };

    const handleUpdated = (activity: Activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });

      addNotification({
        type: 'info',
        title: 'Активність оновлено',
        message: `Тип активності: ${activity.type}`,
      });
    };

    const handleDeleted = (data: DeletedActivity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });

      addNotification({
        type: 'warning',
        title: 'Активність видалено',
        message: `ID запису: ${data.id}`,
      });
    };

    socket.on('activity:created', handleCreated);
    socket.on('activity:updated', handleUpdated);
    socket.on('activity:deleted', handleDeleted);

    connectSocket(accessToken);

    return () => {
      socket.off('activity:created', handleCreated);
      socket.off('activity:updated', handleUpdated);
      socket.off('activity:deleted', handleDeleted);

      disconnectSocket();
    };
  }, [accessToken, queryClient]);
}
