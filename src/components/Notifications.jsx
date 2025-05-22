import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue, update } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const notificationsRef = ref(rtdb, `users/${currentUser.uid}/notifications`);
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const notificationsArray = Object.entries(data)
            .map(([id, notification]) => ({
              id,
              ...notification
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setNotifications(notificationsArray);
        }
        setLoading(false);
      } catch (error) {
        setError('Error al cargar las notificaciones');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationRef = ref(
        rtdb,
        `users/${currentUser.uid}/notifications/${notificationId}`
      );
      await update(notificationRef, {
        read: true
      });
    } catch (error) {
      setError('Error al marcar la notificación como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const updates = {};
      notifications.forEach(notification => {
        if (!notification.read) {
          updates[`users/${currentUser.uid}/notifications/${notification.id}/read`] = true;
        }
      });
      await update(ref(rtdb), updates);
    } catch (error) {
      setError('Error al marcar todas las notificaciones como leídas');
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading">Cargando notificaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notificaciones</h1>
        {unreadCount > 0 && (
          <button
            className="mark-all-read-button"
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">
            <i className="fas fa-bell" />
          </div>
          <h3>No tienes notificaciones</h3>
          <p>
            Te notificaremos cuando haya actualizaciones importantes
            o nuevos contenidos disponibles.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                <i className={`fas ${notification.icon}`} />
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <button
                  className="mark-read-button"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <i className="fas fa-check" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 