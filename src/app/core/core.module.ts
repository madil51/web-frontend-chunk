import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Services
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { SocketService } from './services/socket.service';
import { MediaUploadService } from './services/media-upload.service';
import { CustomerService } from './services/customer.service';

// Interceptors
// import { AuthInterceptor } from './interceptors/auth.interceptor';
// import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    AuthService,
    NotificationService,
    SocketService,
    MediaUploadService,
    CustomerService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorInterceptor,
    //   multi: true
    // }
  ]
})
export class CoreModule { }