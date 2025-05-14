import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="center-container" [@fadeIn]>
      <mat-card class="task-form-card" [@cardFade] *ngIf="!loading; else loadingTemplate">
        <mat-card-header>
          <mat-card-title class="title">{{ isEdit ? 'Edit Task' : 'Create Task' }}</mat-card-title>
          <mat-card-subtitle class="subtitle">{{ isEdit ? 'Update your task details' : 'Add a new task' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form #taskForm="ngForm" (ngSubmit)="onSubmit(taskForm)" [@fadeIn]>
            <mat-form-field appearance="fill" class="form-field" floatLabel="always">
              <mat-label>Title</mat-label>
              <input matInput [(ngModel)]="task.title" name="title" required #titleInput="ngModel">
              <mat-icon matPrefix class="icon">title</mat-icon>
              <mat-error *ngIf="titleInput.touched && titleInput.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="form-field" floatLabel="always">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="task.description" name="description" rows="4"></textarea>
              <mat-icon matPrefix class="icon">description</mat-icon>
            </mat-form-field>
            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" class="submit-button" [disabled]="!taskForm.valid || submitting">
                {{ isEdit ? 'Update' : 'Create' }}
              </button>
              <button mat-raised-button routerLink="/tasks" class="cancel-button" [disabled]="submitting">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      <ng-template #loadingTemplate>
        <div class="loading-container">
          <span>Loading task...</span>
        </div>
      </ng-template>
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
    .task-form-card {
      width: 90%;
      max-width: 600px;
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
    .task-form-card:hover {
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
      font-family: 'Roboto', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      text-align: center;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    .form-field input,
    .form-field textarea {
      font-family: 'Roboto', sans-serif;
      color: #2c3e50;
      font-weight: 400;
    }
    .form-field input::placeholder,
    .form-field textarea::placeholder {
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
    .submit-button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .submit-button:hover:not(:disabled) {
      background: linear-gradient(90deg, #e55a5a, #6a57d5);
      transform: scale(1.05);
    }
    .submit-button:disabled {
      background: #d3d3d3;
      cursor: not-allowed;
    }
    .cancel-button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .cancel-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;
      color: #ffffff;
      padding: 2rem;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('cardFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TaskFormComponent implements OnInit {
  task: Task = { title: '', description: '', status: 'pending' };
  isEdit: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          const task = tasks.find(t => t.id === +id);
          if (task) {
            this.task = task;
          } else {
            this.snackBar.open('Task not found', 'Dismiss', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
            this.router.navigate(['/tasks']);
          }
          this.loading = false;
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error.message || 'Failed to load task', 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/tasks']);
          this.cdr.markForCheck();
        }
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    this.submitting = true;
    if (this.isEdit) {
      this.taskService.updateTask(this.task.id!, this.task).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/tasks']);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.submitting = false;
          this.snackBar.open(err.error.message, 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.cdr.markForCheck();
        }
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/tasks']);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.submitting = false;
          this.snackBar.open(err.error.message, 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.cdr.markForCheck();
        }
      });
    }
  }
}