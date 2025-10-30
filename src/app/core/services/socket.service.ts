import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface JobUpdate {
  jobId: string;
  status: string;
  driverId?: string;
  driverName?: string;
  eta?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
    on(eventName: string): Observable<any> {
    return new Observable(observer => {
      if (!this.socket) {
        observer.error(new Error('Socket not initialized'));
        // Return a no-op cleanup
        return () => {};
      }

      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });

      // Optional: cleanup when unsubscribed
      return () => {
        if (this.socket) {
          this.socket.off(eventName);
        }
      };
    });
  }

  emit(eventName: string, data: any): void {
    if (this.socket) {
      this.socket.emit(eventName, data);
    } else {
      // Socket not initialized - avoid calling methods on null
      console.warn('Socket not initialized, cannot emit event:', eventName);
    }
  }
  private socket: Socket | null = null;
  private isConnected = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.isConnected.asObservable();

  constructor(
    private authService: AuthService
  ) {}

  
  initializeSocket(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.socket = io(environment.socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected.next(true);
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected.next(false);
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.next(false);
    }
  }

  // Chat functionality
  joinChat(jobId: string): void {
    if (this.socket) {
      this.socket.emit('join-chat', jobId);
    }
  }

  leaveChat(jobId: string): void {
    if (this.socket) {
      this.socket.emit('leave-chat', jobId);
    }
  }

  sendMessage(jobId: string, message: string): void {
    if (this.socket) {
      this.socket.emit('send-message', { jobId, message });
    }
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('new-message', (message: ChatMessage) => {
          observer.next(message);
        });
      }
    });
  }

  onTyping(): Observable<{ jobId: string; userId: string; isTyping: boolean }> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('typing', (data) => {
          observer.next(data);
        });
      }
    });
  }

  sendTypingIndicator(jobId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { jobId, isTyping });
    }
  }

  // Job updates
  onJobUpdate(): Observable<JobUpdate> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('job-update', (update: JobUpdate) => {
          observer.next(update);
        });
      }
    });
  }

  // Driver location updates
  onDriverLocationUpdate(): Observable<{ jobId: string; location: { lat: number; lng: number } }> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('driver-location', (data) => {
          observer.next(data);
        });
      }
    });
  }

  // New job notifications for drivers
  onNewJob(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('new-job', (job) => {
          observer.next(job);
        });
      }
    });
  }

  // Bid updates
  onBidUpdate(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('bid-update', (bid) => {
          observer.next(bid);
        });
      }
    });
  }
}