import { useState, useRef, useEffect } from "react";
import { useInbox, type NotificationItem, type NotificationType } from "../../hooks/useInbox";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Mail, MessageSquare, Ticket, Check } from "lucide-react";

export function InboxDropdown() {
	const { notifications, unreadCount, markAsRead, markAllAsRead } = useInbox();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
    const location = useLocation();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleNotificationClick = async (notification: NotificationItem) => {
		if (!notification.is_read) {
			await markAsRead(notification.notification_id);
		}
		setIsOpen(false);
        const ticketPath = `/tickets/${notification.ticket_id}`;
		if (location.pathname !== ticketPath) {
            navigate(ticketPath);
        }
	};

	const getIcon = (type: NotificationType) => {
		switch (type) {
			case "Ticket Created":
				return <Ticket className="h-4 w-4 text-sky-500" />;
			case "Assignment":
				return <Mail className="h-4 w-4 text-emerald-500" />;
			case "Message":
				return <MessageSquare className="h-4 w-4 text-amber-500" />;
			default:
				return <Bell className="h-4 w-4 text-wise-mute" />;
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Bell button to open inbox */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-wise-ink/20 bg-wise-canvas text-wise-ink transition btn-gradient-hover dark:border-wise-canvasSoft/30 dark:bg-wise-ink dark:text-white"
			>
				<div className="relative">
					<Bell className="h-5 w-5 text-wise-ink dark:text-wise-mute group-hover:text-white transition-colors" />
					{unreadCount > 0 && (
						<span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-wise-canvas dark:ring-wise-ink">
							{unreadCount}
						</span>
					)}
				</div>
			</button>

			{/* Dropdown menu displaying notifications */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-wiseXl border border-wise-ink/20 bg-wise-canvas shadow-lg dark:border-wise-canvasSoft/20 dark:bg-wise-ink z-50 flex flex-col">
					<div className="p-4 border-b border-wise-ink/10 dark:border-wise-canvasSoft/20 flex justify-between items-center bg-wise-canvas/50 dark:bg-wise-ink/50">
						<span className="font-semibold text-wise-ink dark:text-white text-sm">
							Notifications
						</span>
						{unreadCount > 0 && (
							<button
								type="button"
								onClick={markAllAsRead}
								className="text-xs flex items-center gap-1 text-dc-primary hover:underline"
							>
								<Check className="h-3 w-3" /> Mark all as read
							</button>
						)}
					</div>

					<div className="overflow-y-auto divide-y divide-wise-ink/10 dark:divide-wise-canvasSoft/10 flex-1">
						{notifications.length === 0 ? (
							<div className="p-8 text-center text-xs text-wise-mute dark:text-wise-neutral">
								No new notifications
							</div>
						) : (
							notifications.map((notification) => (
								<button
									key={notification.notification_id}
									onClick={() => handleNotificationClick(notification)}
									className={`p-4 flex gap-3 cursor-pointer transition-colors text-left w-full hover:bg-wise-ink/5 dark:hover:bg-wise-canvasSoft/10 ${
										!notification.is_read
											? "bg-dc-primary/5 dark:bg-dc-primary/10"
											: ""
									}`}
								>
									<div className="mt-0.5 shrink-0">
										{getIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<p
											className={`text-xs text-wise-ink dark:text-gray-100 truncate ${
												!notification.is_read ? "font-bold" : "font-medium"
											}`}
										>
											{notification.title}
										</p>
										<p className="text-xs text-wise-body dark:text-wise-neutral line-clamp-2 mt-0.5 leading-relaxed">
											{notification.message}
										</p>
										<span className="text-[10px] text-wise-mute dark:text-wise-neutral block mt-1">
											{new Date(notification.created_at).toLocaleString(
												"en-SG"
											)}
										</span>
									</div>
									{!notification.is_read && (
										<div className="h-1.5 w-1.5 rounded-full bg-dc-primary self-center shrink-0" />
									)}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
