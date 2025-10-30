import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SocketService } from './core/services/socket.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Chunk';
  showHeader = true;
  showFooter = true;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {}

ngOnInit() {
  this.authService.initializeAuth();
  this.socketService.initializeSocket();

  this.router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe((event) => {
      this.showHeader = !event.url.includes('/auth');
      this.showFooter = !event.url.includes('/auth');
    });
}
}