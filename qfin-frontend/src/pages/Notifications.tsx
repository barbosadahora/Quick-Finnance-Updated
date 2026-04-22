import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/notifications.service';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Erro ao buscar notificações.');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      toast.success('Notificação marcada como lida.');
      fetchNotifications();
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida.');
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta notificação?')) {
      try {
        await deleteNotification(id);
        toast.success('Notificação deletada com sucesso!');
        fetchNotifications();
      } catch (error) {
        toast.error('Erro ao deletar notificação.');
        console.error('Error deleting notification:', error);
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return <div className="container mx-auto p-4">Carregando notificações...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Notificações</h1>

      {notifications.length === 0 ? (
        <p>Você não tem novas notificações.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.isRead ? 'bg-gray-100' : 'bg-white'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  {notification.type || 'Geral'}
                </CardTitle>
                <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{notification.message}</p>
                <div className="mt-4 flex space-x-2">
                  {!notification.isRead && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id!)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como lida
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteNotification(notification.id!)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
