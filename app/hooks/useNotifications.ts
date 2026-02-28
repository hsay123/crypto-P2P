import { useState } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  timestamp: Date
  link?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter(n => !n.read).length
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }
  return { notifications, unreadCount, markAllRead }
}
