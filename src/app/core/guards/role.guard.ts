import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    this.snackBar.open('You do not have permission to access this page from ROLE', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    
    // Redirect based on user role
    const user = this.authService.getCurrentUser();
    console.log('Current User in RoleGuard:', user);
    if (user) {
      switch (user.role) {
        case 'customer':
          this.router.navigate(['/customer/dashboard']);
          break;
        case 'driver':
          this.router.navigate(['/driver/dashboard']);
          break;
        case 'admin':
        case 'super_admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
    
    return false;
  }
}