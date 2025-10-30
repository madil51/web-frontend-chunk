import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CreateRequestComponent } from '../features/customer/components/create-request/create-request.component';

@NgModule({
  declarations: [
    // Components
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SuccessMessageComponent,
    ConfirmDialogComponent,
    FileUploadComponent,
    
    // Directives
    ClickOutsideDirective,
    AutoFocusDirective,
    
    // Pipes
    TruncatePipe,
    SafeHtmlPipe,
    TimeAgoPipe,
    CreateRequestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Components
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SuccessMessageComponent,
    ConfirmDialogComponent,
    FileUploadComponent,
    
    // Directives
    ClickOutsideDirective,
    AutoFocusDirective,
    
    // Pipes
    TruncatePipe,
    SafeHtmlPipe,
    TimeAgoPipe,
    CreateRequestComponent
  ]
})
export class SharedModule { }