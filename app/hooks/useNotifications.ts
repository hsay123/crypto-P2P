"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const lastOrderIds = useRef<Set<string>>(new Set());
    const initialized = useRef(false);

    const requestPermission = useCallback(async () => {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }
    }, []);

    const addNotification = useCallback((notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
        const newNotif: AppNotification = {
            ...notif,
            id: `${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
        setUnreadCount((c) => c + 1);

        // Fire browser notification
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(notif.title, { body: notif.message, icon: "/favicon.ico" });
        }
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const pollOrders = useCallback(async () => {
        try {
            const res = await fetch("/api/p2p/orders?type=SELL&cryptocurrency=USDC");
            const data = await res.json();
            if (!data.success) return;

            const currentIds = new Set<string>(data.orders.map((o: { id: string }) => o.id));

            if (!initialized.current) {
                // First poll — just seed the set, don't notify
                lastOrderIds.current = currentIds;
                initialized.current = true;
                return;
            }

            // Find new orders
            for (const order of data.orders) {
                if (!lastOrderIds.current.has(order.id)) {
                    addNotification({
                        title: "New USDC Sell Order 🔔",
                        message: `New USDC sell order at ${order.price} — tap to trade!`,
                        link: "/exchange",
                    });
                }
            }

            lastOrderIds.current = currentIds;
        } catch (e) {
            console.error("Notification poll error:", e);
        }
    }, [addNotification]);

    useEffect(() => {
        requestPermission();
        pollOrders();
        const interval = setInterval(pollOrders, 30000);
        return () => clearInterval(interval);
    }, [pollOrders, requestPermission]);

    return { notifications, unreadCount, markAllRead, addNotification };
}
