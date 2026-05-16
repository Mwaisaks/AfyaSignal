'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRightCircle,
  Bell,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { cn } from '@/lib/utils';
import type { NotificationResponse } from '@/lib/api';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return 'just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

function getNotificationIcon(type: NotificationResponse['type']): {
  Icon: LucideIcon;
  className: string;
} {
  switch (type) {
    case 'CRITICAL_CASE_FLAGGED':
      return { Icon: AlertTriangle, className: 'text-destructive' };
    case 'OUTBREAK_ALERT_GENERATED':
      return { Icon: Activity, className: 'text-secondary' };
    case 'REFERRAL_INCOMING':
      return { Icon: ArrowRightCircle, className: 'text-accent' };
    case 'ASSESSMENT_SUBMITTED':
      return { Icon: CheckCircle, className: 'text-primary' };
    default:
      return { Icon: Bell, className: 'text-muted-foreground' };
  }
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: NotificationResponse;
  onMarkAsRead: (id: string) => Promise<void>;
}) {
  const { Icon, className } = getNotificationIcon(notification.type);

  const handleClick = () => {
    if (!notification.isRead) {
      void onMarkAsRead(notification.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full gap-3 border-t border-border px-4 py-3 text-left transition-colors hover:bg-muted/50',
        notification.isRead ? 'bg-card' : 'bg-primary/5'
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', className)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{notification.title}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

export function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications(user?.id ?? '');

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs font-medium text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading && notifications.length === 0 ? (
            <p className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : notifications.length === 0 ? (
            <p className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
