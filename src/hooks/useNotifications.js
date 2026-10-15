import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeToNotifications, markAsRead as markRead, markAllAsRead as markAllRead } from '../services/notificationsService'

export default function useNotifications() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!currentUser) { setNotifications([]); return }
    const unsubscribe = subscribeToNotifications(currentUser.uid, setNotifications)
    return unsubscribe
  }, [currentUser])

  const unreadCount = notifications.filter(n => !n.read).length
  const markAsRead = (id) => markRead(id)
  const markAllAsRead = () => markAllRead(currentUser.uid)

  return { notifications, unreadCount, markAsRead, markAllAsRead }
}
