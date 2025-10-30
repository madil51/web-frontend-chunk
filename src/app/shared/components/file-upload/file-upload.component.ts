import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="file-upload">
      <input type="file" [accept]="accept" [multiple]="multiple" (change)="onFileSelected($event)" #fileInput>
      <button class="btn btn-upload" (click)="fileInput.click()">
        {{buttonText}}
      </button>
      <div class="uploaded-files" *ngIf="selectedFiles.length > 0">
        <div class="file-item" *ngFor="let file of selectedFiles">
          <span>{{file.name}}</span>
          <button (click)="removeFile(file)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload { input[type="file"] { display: none; } .btn-upload { background: #269C94; 
      color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
      .file-item { display: flex; align-items: center; justify-content: space-between; 
      padding: 0.5rem; background: #f8f9fa; border-radius: 4px; margin-top: 0.5rem; }
      button { background: #e74c3c; color: white; border: none; border-radius: 50%; 
      width: 20px; height: 20px; cursor: pointer; } }
  `]
})
export class FileUploadComponent {
  @Input() accept: string = '*';
  @Input() multiple: boolean = false;
  @Input() buttonText: string = 'Choose Files';
  @Output() filesSelected = new EventEmitter<FileList>();
  
  selectedFiles: File[] = [];

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.filesSelected.emit(files);
    }
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }
}