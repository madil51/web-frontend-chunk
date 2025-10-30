import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SocketService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.scss']
})
export class DriverDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: any;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;
  onlineStatus = false;

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
    this.updateOnlineStatus();
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

    // Listen for new job postings
    this.socketService.on('newJobPosted')
      .pipe(takeUntil(this.destroy$))
      .subscribe((job: any) => {
        this.notificationService.showSuccess(`New job available: ${job.title}`);
      });

    // Listen for job status updates
    this.socketService.on('jobStatusUpdate')
      .pipe(takeUntil(this.destroy$))
      .subscribe((update: any) => {
        this.notificationService.showInfo(`Job #${update.jobId} status: ${update.status}`);
      });
  }

  private loadNotifications(): void {
    this.notificationService.getDriverNotifications()
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

  toggleOnlineStatus(): void {
    this.onlineStatus = !this.onlineStatus;
    this.socketService.emit('updateDriverStatus', {
      driverId: this.user.id,
      status: this.onlineStatus ? 'online' : 'offline'
    });
    
    this.notificationService.showSuccess(
      this.onlineStatus ? 'You are now online' : 'You are now offline'
    );
  }

  private updateOnlineStatus(): void {
    // Update driver status when component loads
    this.socketService.emit('updateDriverStatus', {
      driverId: this.user.id,
      status: 'online'
    });
    this.onlineStatus = true;
  }

  logout(): void {
    this.socketService.emit('updateDriverStatus', {
      driverId: this.user.id,
      status: 'offline'
    });
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
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
        error: (error: any) => {
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
}