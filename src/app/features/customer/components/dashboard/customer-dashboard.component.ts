import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '.././../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SocketService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: any;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.initializeSocketListeners();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSocketListeners(): void {
    // Listen for real-time notifications
    this.socketService.on('newNotification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification: any) => {
        this.notifications.unshift(notification);
        this.unreadCount++;
        this.notificationService.showInfo(notification.message);
      });

    // Listen for request status updates
    this.socketService.on('requestStatusUpdate')
      .pipe(takeUntil(this.destroy$))
      .subscribe((update: any) => {
        this.notificationService.showSuccess(`Request #${update.requestId} status updated to ${update.status}`);
      });
  }

  private loadNotifications(): void {
    // Load existing notifications
    this.notificationService.getCustomerNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.filter(n => !n.read).length;
        },
        error: (error) => {
          console.error('Failed to load notifications:', error);
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  markNotificationAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
          }
        },
        error: (error) => {
          console.error('Failed to mark notification as read:', error);
        }
      });
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications = [];
          this.unreadCount = 0;
        },
        error: (error) => {
          console.error('Failed to clear notifications:', error);
        }
      });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}