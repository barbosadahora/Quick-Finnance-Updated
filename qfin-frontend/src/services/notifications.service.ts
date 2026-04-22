import api from "../config/api";
import { Notification } from "../types";

const BASE_URL = "/api/notifications";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>(BASE_URL);
  return response.data;
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>(`${BASE_URL}/unread`);
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<Notification> => {
  const response = await api.put<Notification>(`${BASE_URL}/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
