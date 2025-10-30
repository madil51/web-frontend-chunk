import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-message',
  template: `<div class="success-message"><div class="success-icon">✓</div><div class="success-content"><h4>Success</h4><p>{{message}}</p></div></div>`,
  styles: [`
    .success-message {
      display: flex; align-items: flex-start; gap: 1rem; padding: 1.5rem; 
      background: #e8f5e8; border: 1px solid #27AE60; border-radius: 8px; color: #27AE60;
      .success-icon { flex-shrink: 0; font-size: 1.5rem; font-weight: bold; }
      .success-content { flex: 1; h4 { margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600; }
        p { margin: 0; font-size: 0.9rem; line-height: 1.4; } }
    }
  `]
})
export class SuccessMessageComponent {
  @Input() message: string = 'Operation completed successfully';
}