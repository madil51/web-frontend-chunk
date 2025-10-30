import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @ViewChild('modal') modalRef!: ElementRef;
  showModal = false;
  // Required fields
  address: string = '';
  phone: string = '';
  contactMethod: 'phone' | 'email' | 'both' = 'phone';
  description: string = '';
  category: string = '';
  volume: 'small' | 'medium' | 'large' = 'small';
  pricingPreference: 'ai' | 'bidding' = 'ai';

  // Optional fields
  scheduledDate?: string;
  instructions?: string;

  // Media files (optional)
  mediaFiles: File[] = [];
  serviceType: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  openModal() {
    console.log('openModal called');
    this.showModal = true;
  }

  hideCreateRequest() {
    this.showModal = false;
  }
  submitRequest() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      address: this.address,
      phone: this.phone,
      contactMethod: this.contactMethod,
      description: this.description,
      category: this.category,
      volume: this.volume,
      serviceType: 'asap',
      pricingPreference: this.pricingPreference,
      mediaFiles: this.mediaFiles.map(file => file.name),
      scheduledDate: this.scheduledDate,
      instructions: this.instructions
    };

    this.http.post(`http://localhost:3000/api/jobs/create`, payload, { headers })
      .subscribe({
        next: (res) => {
          console.log('Job created:', res);
          alert('✅ Job created successfully!');
          // Optionally reset form or navigate
          this.hideCreateRequest();
          this.resetForm();
        },
        error: (err) => {
          console.error('Job creation failed:', err);
          if (err.status === 400 && err.error?.errors) {
            alert('⚠️ Validation error: ' + err.error.errors[0].msg);
          } else if (err.status === 403) {
            alert('🚫 Unauthorized: Invalid or expired token.');
          } else {
            alert('❌ Failed to create job. Please try again.');
          }
        }
      });
  }

  resetForm() {
    this.address = '';
    this.phone = '';
    this.contactMethod = 'phone'; // default value from union type
    this.description = '';
    this.category = '';
    this.volume = 'small'; // default value from union type
    this.pricingPreference = 'ai'; // default value from union type
    this.mediaFiles = [];
    this.scheduledDate = undefined;
    this.instructions = undefined;
  }


  triggerFileUpload() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.mediaFiles = Array.from(input.files);
    }
  }
}
