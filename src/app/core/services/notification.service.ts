import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/api/notifications';

  constructor(private http: HttpClient) {}

  // Show toast notifications
  showSuccess(message: string): void {
    this.showToast(message, 'success');
  }

  showError(message: string): void {
    this.showToast(message, 'error');
  }

  showInfo(message: string): void {
    this.showToast(message, 'info');
  }

  showWarning(message: string): void {
    this.showToast(message, 'warning');
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
      </div>
    `;

    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.removeToast(toast);
      });
    }
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case 'success': return '#27AE60';
      case 'error': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'info': return '#269C94';
      default: return '#7f8c8d';
    }
  }

  private removeToast(toast: HTMLElement): void {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // API methods for notifications
  getCustomerNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/customer`);
  }

  getDriverNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/driver`);
  }

  getAdminNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/admin`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-all-read`, {});
  }

  clearAllNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-all`);
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  // Create notification (for internal use)
  createNotification(userId: string, message: string, type: Notification['type'], data?: any): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, {
      userId,
      message,
      type,
      data
    });
  }
}