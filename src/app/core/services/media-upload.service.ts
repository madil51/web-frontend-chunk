import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  response?: any;
  error?: string;
}

export interface MediaUploadResponse {
  url: string;
  key: string;
  type: string;
  size: number;
  thumbnailUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaUploadService {
  private apiUrl = '/api/media';
  private uploadProgress = new BehaviorSubject<UploadProgress[]>([]);
  
  public uploadProgress$ = this.uploadProgress.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Upload single file with progress tracking
   */
  uploadFile(file: File, type: 'profile' | 'vehicle' | 'job' | 'document'): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const uploadProgress: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };

    this.addToProgress(uploadProgress);

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request<MediaUploadResponse>(req).pipe(
      filter(event => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          uploadProgress.progress = progress;
          this.updateProgress(uploadProgress);
        } else if (event.type === HttpEventType.Response) {
          uploadProgress.status = 'completed';
          uploadProgress.progress = 100;
          uploadProgress.response = event.body;
          this.updateProgress(uploadProgress);
          return event.body as MediaUploadResponse;
        }
        throw new Error('Upload in progress');
      })
    );
  }

  /**
   * Upload multiple files
   */
  uploadMultipleFiles(files: File[], type: 'profile' | 'vehicle' | 'job' | 'document'): Observable<MediaUploadResponse[]> {
    const uploads = files.map(file => this.uploadFile(file, type));
    return new Observable(observer => {
      let completed = 0;
      const results: MediaUploadResponse[] = [];

      uploads.forEach((upload, index) => {
        upload.subscribe({
          next: (response) => {
            results[index] = response;
            completed++;
            if (completed === files.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    });
  }

  /**
   * Upload base64 image
   */
  uploadBase64Image(base64Data: string, filename: string, type: 'profile' | 'vehicle' | 'job' | 'document'): Observable<MediaUploadResponse> {
    const data = {
      image: base64Data,
      filename,
      type
    };

    return this.http.post<MediaUploadResponse>(`${this.apiUrl}/upload-base64`, data);
  }

  /**
   * Generate thumbnail for uploaded image
   */
  generateThumbnail(fileUrl: string, width: number = 300, height: number = 300): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/thumbnail`, {
      fileUrl,
      width,
      height
    });
  }

  /**
   * Delete uploaded file
   */
  deleteFile(fileKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${fileKey}`);
  }

  /**
   * Get signed URL for direct upload to S3
   */
  getSignedUrl(filename: string, fileType: string, type: 'profile' | 'vehicle' | 'job' | 'document'): Observable<{ url: string; key: string }> {
    return this.http.post<{ url: string; key: string }>(`${this.apiUrl}/signed-url`, {
      filename,
      fileType,
      type
    });
  }

  /**
   * Upload file directly to S3 using signed URL
   */
  uploadToS3(file: File, signedUrl: string): Observable<any> {
    return this.http.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, allowedTypes: string[], maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size (default 10MB)
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Compress image before upload
   */
  compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get upload progress for specific file
   */
  getFileProgress(file: File): UploadProgress | undefined {
    const progress = this.uploadProgress.value;
    return progress.find(p => p.file === file);
  }

  /**
   * Clear completed uploads from progress tracking
   */
  clearCompletedUploads(): void {
    const currentProgress = this.uploadProgress.value;
    const filteredProgress = currentProgress.filter(p => p.status !== 'completed');
    this.uploadProgress.next(filteredProgress);
  }

  private addToProgress(progress: UploadProgress): void {
    const currentProgress = this.uploadProgress.value;
    currentProgress.push(progress);
    this.uploadProgress.next(currentProgress);
  }

  private updateProgress(updatedProgress: UploadProgress): void {
    const currentProgress = this.uploadProgress.value;
    const index = currentProgress.findIndex(p => p.file === updatedProgress.file);
    if (index !== -1) {
      currentProgress[index] = updatedProgress;
      this.uploadProgress.next(currentProgress);
    }
  }
}