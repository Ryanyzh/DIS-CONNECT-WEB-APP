import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCurrentUser } from "../lib/authRepository";
import type { TicketActions } from "../components/tickets/ActionsPanel";
import { apiFetch } from "../lib/apiFetch";

export type NotificationType = "Message" | "Ticket Created" | TicketActions | string;

export interface NotificationItem {
	notification_id: string;
	title: string;
	message: string;
	type: NotificationType;
	ticket_id: string;
	is_read: boolean;
	created_at: string;
}

export function useInbox() {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [loading, setLoading] = useState(true);
	const currentUser = getCurrentUser();

	useEffect(() => {
		if (!currentUser?.uid) {
			setNotifications([]);
			setLoading(false);
			return;
		}

		// Real-time query
		const inboxRef = collection(db, "users", currentUser.uid, "inbox");
		const q = query(inboxRef, orderBy("created_at", "desc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const items: NotificationItem[] = [];
				snapshot.forEach((doc) => {
					const data = doc.data();

					// Convert timestamp object from Firestore to just a simple ISO string
					const createdAt = data.created_at.toDate().toISOString();

					items.push({
						...data,
						created_at: createdAt,
					} as NotificationItem);
				});
				setNotifications(items);
				setLoading(false);
			},
			(error) => {
				console.error("Error retrieving notifications:", error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [currentUser?.uid]);

	// Mark one notification as read
	const markAsRead = async (notificationId: string) => {
		try {
			await apiFetch("/api/v1/users/inbox/read", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ notification_ids: [notificationId] }),
			});
		} catch (err) {
			console.error("Failed to mark notification as read:", err);
		}
	};

	// Mark all notifications as read
	const markAllAsRead = async () => {
		try {
			await apiFetch("/api/v1/users/inbox/read", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ notification_ids: [] }), // Empty array will mark all unread notifications as read
			});
		} catch (err) {
			console.error("Failed to mark all notifications as read:", err);
		}
	};

	const unreadCount = notifications.filter((n) => !n.is_read).length;

	return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
