import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-available-jobs',
  templateUrl: './available-jobs.component.html',
  styleUrls: ['./available-jobs.component.scss']
})
export class AvailableJobsComponent implements OnInit {
  jobs: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllAvailableJobs();
  }

  getAllAvailableJobs(): void {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    this.http.get<any[]>(`${environment.apiUrl}/drivers/available-jobs`, { headers }).subscribe(response => {
      this.jobs = response.map(job => ({
        ...job,
        postedAgo: this.getTimeAgo(job.created_at) // optional formatting
      }));
      console.log('Available jobs:', this.jobs);
    });
  }

  getTimeAgo(dateString: string): string {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`;
  }
}