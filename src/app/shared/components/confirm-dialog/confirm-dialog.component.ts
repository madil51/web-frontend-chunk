import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog-overlay" *ngIf="isOpen">
      <div class="confirm-dialog">
        <h3>{{title}}</h3>
        <p>{{message}}</p>
        <div class="dialog-actions">
          <button class="btn btn-cancel" (click)="onCancel()">{{cancelText}}</button>
          <button class="btn btn-confirm" (click)="onConfirm()">{{confirmText}}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .confirm-dialog { background: white; padding: 2rem; border-radius: 8px; max-width: 400px; margin: 1rem; }
    .dialog-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-cancel { background: #7f8c8d; color: white; }
    .btn-confirm { background: #e74c3c; color: white; }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() onConfirm: () => void = () => {};
  @Input() onCancel: () => void = () => {};
}