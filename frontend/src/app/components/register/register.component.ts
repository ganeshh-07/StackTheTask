import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="center-container" [@fadeIn]>
      <div class="keywords-container">
        <span class="keyword">Task</span>
        <span class="keyword">To-Do</span>
        <span class="keyword">Done</span>
        <span class="keyword">Priority</span>
        <span class="keyword">Deadline</span>
        <span class="keyword">Complete</span>
        <span class="keyword">Plan</span>
        <span class="keyword">Schedule</span>
        <span class="keyword">Organize</span>
        <span class="keyword">Checklist</span>
        <span class="keyword">Reminder</span>
        <span class="keyword">Goal</span>
        <span class="keyword">Project</span>
        <span class="keyword">Due</span>
        <span class="keyword">List</span>
        <span class="keyword">Note</span>
        <span class="keyword">Category</span>
        <span class="keyword">Progress</span>
        <span class="keyword">Action</span>
        <span class="keyword">Today</span>
        <span class="keyword">Tomorrow</span>
        <span class="keyword">Urgent</span>
        <span class="keyword">Overdue</span>
        <span class="keyword">Status</span>
        <span class="keyword">Track</span>
      </div>
      <mat-card class="register-card" [@cardBounce]>
       <mat-card-header>
          <mat-card-title class="title">
            <mat-icon class="title-icon">check_circle</mat-icon>
            StackTask
          </mat-card-title>
          <mat-card-subtitle class="subtitle">Sign in to organize your tasks</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form #registerForm="ngForm" (ngSubmit)="onSubmit()" [@bounceIn]>
            <mat-form-field appearance="fill" class="form-field" floatLabel="always">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required #usernameInput="ngModel">
              <mat-icon matPrefix class="icon">person</mat-icon>
              <mat-error *ngIf="usernameInput.touched && usernameInput.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="form-field" floatLabel="always">
              <mat-label>Password</mat-label>
              <input matInput [(ngModel)]="password" name="password" [type]="hidePassword ? 'password' : 'text'" required #passwordInput="ngModel">
              <mat-icon matPrefix class="icon">lock</mat-icon>
              <mat-icon matSuffix (click)="hidePassword = !hidePassword" class="icon">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              <mat-error *ngIf="passwordInput.touched && passwordInput.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>
            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" class="register-button" [disabled]="!registerForm.valid || loading">
                <span *ngIf="!loading">Register</span>
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              </button>
              <button mat-raised-button routerLink="/login" class="login-button">
                Login
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');

    :host {
      display: block;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
    .center-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100vw;
      background: linear-gradient(145deg, #7b68ee, #ff6b6b, #4ecdc4);
      background-size: 200% 200%;
      animation: gradientShift 15s ease infinite;
      position: fixed;
      top: 0;
      left: 0;
      overflow: hidden;
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .keywords-container {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
    }
    .keyword {
      position: absolute;
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.5);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      animation: flow 12s infinite ease-in-out;
      animation-fill-mode: forwards;
      will-change: transform, opacity, visibility;
    }
    @keyframes flow {
      0% {
        opacity: 0;
        visibility: visible;
        transform: translateY(0) translateX(0) scale(0.8);
      }
      20% {
        opacity: 0.5;
        transform: translateY(-10vh) translateX(1vw) scale(1);
      }
      80% {
        opacity: 0.5;
        transform: translateY(-15vh) translateX(3vw) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translateY(-18vh) translateX(4vw) scale(1.3);
      }
    }
    .keyword:nth-child(1) { left: 5%; top: 10%; animation-duration: 12s; animation-delay: 0.1s; transform: scale(0.8); }
    .keyword:nth-child(2) { left: 15%; top: 25%; animation-duration: 10s; animation-delay: 0.12s; transform: scale(1.1); }
    .keyword:nth-child(3) { left: 25%; top: 40%; animation-duration: 14s; animation-delay: 0.14s; transform: scale(0.9); }
    .keyword:nth-child(4) { left: 35%; top: 55%; animation-duration: 11s; animation-delay: 0.16s; transform: scale(1); }
    .keyword:nth-child(5) { left: 45%; top: 70%; animation-duration: 13s; animation-delay: 0.18s; transform: scale(0.7); }
    .keyword:nth-child(6) { left: 55%; top: 85%; animation-duration: 9s; animation-delay: 0.2s; transform: scale(1.2); }
    .keyword:nth-child(7) { left: 65%; top: 15%; animation-duration: 15s; animation-delay: 0.22s; transform: scale(0.8); }
    .keyword:nth-child(8) { left: 75%; top: 30%; animation-duration: 10s; animation-delay: 0.24s; transform: scale(1); }
    .keyword:nth-child(9) { left: 85%; top: 45%; animation-duration: 12s; animation-delay: 0.26s; transform: scale(0.9); }
    .keyword:nth-child(10) { left: 10%; top: 60%; animation-duration: 11s; animation-delay: 0.28s; transform: scale(1.1); }
    .keyword:nth-child(11) { left: 20%; top: 75%; animation-duration: 13s; animation-delay: 0.3s; transform: scale(0.7); }
    .keyword:nth-child(12) { left: 30%; top: 90%; animation-duration: 9s; animation-delay: 0.32s; transform: scale(1.2); }
    .keyword:nth-child(13) { left: 40%; top: 20%; animation-duration: 14s; animation-delay: 0.34s; transform: scale(0.8); }
    .keyword:nth-child(14) { left: 50%; top: 35%; animation-duration: 10s; animation-delay: 0.36s; transform: scale(1); }
    .keyword:nth-child(15) { left: 60%; top: 50%; animation-duration: 12s; animation-delay: 0.38s; transform: scale(0.9); }
    .keyword:nth-child(16) { left: 70%; top: 65%; animation-duration: 11s; animation-delay: 0.4s; transform: scale(1.1); }
    .keyword:nth-child(17) { left: 80%; top: 80%; animation-duration: 13s; animation-delay: 0.42s; transform: scale(0.7); }
    .keyword:nth-child(18) { left: 90%; top: 95%; animation-duration: 9s; animation-delay: 0.44s; transform: scale(1.2); }
    .keyword:nth-child(19) { left: 12%; top: 5%; animation-duration: 14s; animation-delay: 0.46s; transform: scale(0.8); }
    .keyword:nth-child(20) { left: 22%; top: 20%; animation-duration: 10s; animation-delay: 0.48s; transform: scale(1); }
    .keyword:nth-child(21) { left: 32%; top: 35%; animation-duration: 12s; animation-delay: 0.5s; transform: scale(0.9); }
    .keyword:nth-child(22) { left: 42%; top: 50%; animation-duration: 11s; animation-delay: 0.52s; transform: scale(1.1); }
    .keyword:nth-child(23) { left: 52%; top: 65%; animation-duration: 13s; animation-delay: 0.54s; transform: scale(0.7); }
    .keyword:nth-child(24) { left: 62%; top: 80%; animation-duration: 9s; animation-delay: 0.56s; transform: scale(1.2); }
    .keyword:nth-child(25) { left: 72%; top: 95%; animation-duration: 14s; animation-delay: 0.66s; transform: scale(0.8); }
    .register-card {
      width: 90%;
      max-width: 420px;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 1;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      perspective: 1000px;
    }
    .register-card:hover {
      transform: rotateX(3deg) rotateY(3deg) translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 16px rgba(123, 104, 238, 0.5);
    }
    mat-card-header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin-bottom: 1.5rem;
    }
    .title {
      display: flex;
      align-items: center;
      font-family: 'Roboto', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      text-align: center;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .title-icon {
      font-size: 2rem;
      color: #7b68ee;
      margin-right: 0.5rem;
    }
    .subtitle {
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 300;
      color: #636e72;
      text-align: center;
      margin: 0.5rem 0 0;
    }
    .form-field {
      width: 100%;
      margin-bottom: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(8px);
      font-family: 'Roboto', sans-serif;
    }
    .form-field .icon {
      color: #7b68ee;
      margin-right: 8px;
    }
    .form-field input {
      font-family: 'Roboto', sans-serif;
      color: #2c3e50;
      font-weight: 400;
    }
    .form-field input::placeholder {
      color: #b0b0b0;
      font-weight: 300;
      font-style: italic;
      opacity: 0.7;
    }
    mat-error {
      font-family: 'Roboto', sans-serif;
      font-size: 0.8rem;
      color: #ff6b6b;
      font-weight: 400;
    }
    .button-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .register-button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .register-button:hover:not(:disabled) {
      background: linear-gradient(90deg, #e55a5a, #6a57d5);
      transform: scale(1.05);
    }
    .register-button:disabled {
      background: #d3d3d3;
      cursor: not-allowed;
    }
    .login-button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .login-button:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }
    mat-spinner {
      display: inline-block;
      vertical-align: middle;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        animate('500ms ease-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.3)', offset: 0 }),
          style({ opacity: 0.5, transform: 'scale(1.1)', offset: 0.6 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('cardBounce', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(): void {
    this.loading = true;
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error.message, 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}