import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateRequestComponent } from '../customer/components/create-request/create-request.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(CreateRequestComponent) createRequestComp!: CreateRequestComponent;
  private destroy$ = new Subject<void>();
  isAuthenticated = false;
  showModal = false;

  features = [
    {
      icon: 'photo_camera',
      title: 'AI-Powered Pricing',
      description: 'Get instant price estimates by uploading photos of your junk. Our AI analyzes items and provides accurate pricing.'
    },
    {
      icon: 'local_shipping',
      title: 'Local Drivers',
      description: 'Connect with verified local haulers in your area. Choose from multiple bids or accept AI-priced jobs instantly.'
    },
    {
      icon: 'chat',
      title: 'Real-time Chat',
      description: 'Communicate directly with your assigned driver through our secure messaging system with live updates.'
    },
    {
      icon: 'security',
      title: 'Secure Payments',
      description: 'Pay safely through our platform with Stripe integration. Money is held until job completion.'
    },
    {
      icon: 'schedule',
      title: 'Flexible Scheduling',
      description: 'Schedule pickups that work for you. Choose ASAP service or book in advance at your convenience.'
    },
    {
      icon: 'eco',
      title: 'Eco-Friendly',
      description: 'We prioritize responsible disposal and recycling. Track where your items go and their environmental impact.'
    }
  ];

  steps = [
    {
      title: 'Create Request',
      description: 'Upload photos, describe your items, and set your preferred pickup time.'
    },
    {
      title: 'Get Estimates',
      description: 'Receive AI-powered pricing or wait for driver bids within minutes.'
    },
    {
      title: 'Choose Driver',
      description: 'Review driver profiles, ratings, and select the best option for you.'
    },
    {
      title: 'Track & Pay',
      description: 'Monitor your job in real-time and pay securely upon completion.'
    }
  ];

  testimonials = [
    {
      stars: '⭐⭐⭐⭐⭐',
      text: 'Chunk made it so easy! My garage is finally clean. The AI pricing was accurate and the driver was professional.',
      author: 'Sarah L.'
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      text: 'Drivers bid and I saved 30%. The real-time chat was super helpful for coordinating the pickup time.',
      author: 'John D.'
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      text: 'Live chat was super helpful. I could track exactly when the driver would arrive and communicate easily.',
      author: 'Alex R.'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createRequest(): void {
    debugger
    if (this.isAuthenticated) {
      this.router.navigate(['/customer/create-request']);
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/customer/create-request' } });
    }
  }

  showCreateRequest() {
    console.log("Showing create request modal");
    this.showModal = true;
    this.createRequestComp.openModal();
  }

  hideCreateRequest() {
    document.getElementById('create-request-modal')?.classList.add('hidden');
  }

  
  becomeDriver(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/driver/onboarding']);
    } else {
      this.router.navigate(['/auth/register'], { queryParams: { role: 'driver' } });
    }
  }

  joinWaitlist(): void {
    // Show waitlist modal or redirect to waitlist page
    this.router.navigate(['/join-waitlist']);
  }
}