import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar class="toolbar" [@fadeIn]>
      <span class="welcome-message" *ngIf="username">Welcome, {{ username }}</span>
      <span class="toolbar-title">StackTask</span>
      <button mat-icon-button (click)="logout()" class="logout-button">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <div class="center-container" [@fadeIn]>
      <div class="content">
        <div class="filter-container" [@fadeIn]>
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>Filter by Status</mat-label>
            <mat-select [(ngModel)]="filterStatus" (ngModelChange)="onFilterChange($event)">
              <mat-option value="">All</mat-option>
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="completed">Completed</mat-option>
            </mat-select>
            <mat-icon matPrefix>filter_list</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" routerLink="/tasks/new" class="add-task-button">
            <mat-icon>add</mat-icon> Add Task
          </button>
        </div>
        <div class="task-list" *ngIf="tasks.length > 0; else noTasks">
          <div *ngFor="let task of tasks; let i = index" class="task-card" [@cardFade]="i">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>{{ task.status | titlecase }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>{{ task.description }}</mat-card-content>
              <mat-card-actions>
                <button mat-icon-button [disabled]="task.status === 'completed'" (click)="markAsCompleted(task)">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/tasks/edit', task.id]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
        <ng-template #noTasks>
          <div class="no-tasks">No tasks found.</div>
        </ng-template>
      </div>
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
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(90deg, #7b68ee, #ff6b6b, #4ecdc4);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      padding: 0 1rem;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .welcome-message {
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
    }
    .welcome-message:hover {
      transform: scale(1.05);
    }
    .toolbar-title {
      font-family: 'Roboto', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      text-align: center;
      flex-grow: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .logout-button {
      font-family: 'Roboto', sans-serif;
      color: white;
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
      padding: 0.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
    }
    .logout-button:hover {
      transform: scale(1.1);
    }
    .center-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 64px);
      width: 100vw;
      background: linear-gradient(145deg, #7b68ee, #ff6b6b, #4ecdc4);
      background-size: 200% 200%;
      animation: gradientShift 15s ease infinite;
      padding: 2rem 0;
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .content {
      width: 90%;
      max-width: 1000px;
      z-index: 1;
    }
    .filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .filter-field {
      width: 250px;
      font-family: 'Roboto', sans-serif;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .filter-field mat-icon {
      color: #7b68ee;
      margin-right: 8px;
    }
    .add-task-button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .add-task-button:hover {
      background: linear-gradient(90deg, #e55a5a, #6a57d5);
      transform: scale(1.05);
    }
    .task-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .task-card {
      perspective: 1000px;
    }
    .task-card mat-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .task-card:hover mat-card {
      transform: rotateX(3deg) rotateY(3deg) translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 16px rgba(123, 104, 238, 0.5);
    }
    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0;
      margin-bottom: 1rem;
    }
    mat-card-title {
      font-family: 'Roboto', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
    }
    mat-card-subtitle {
      font-family: 'Roboto', sans-serif;
      font-size: 0.9rem;
      font-weight: 300;
      color: #636e72;
      margin: 0.25rem 0 0;
    }
    mat-card-content {
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #4B5563;
      font-weight: 400;
      min-height: 60px;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0;
    }
    mat-card-actions button {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    mat-card-actions button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }
    mat-card-actions button:disabled {
      background: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
      opacity: 0.6;
    }
    mat-card-actions button:first-child {
      background: linear-gradient(90deg, #4ecdc4, #7b68ee);
    }
    mat-card-actions button:first-child:hover:not(:disabled) {
      background: linear-gradient(90deg, #3db8af, #6a57d5);
    }
    mat-card-actions button:nth-child(2) {
      background: linear-gradient(90deg, #ff6b6b, #7b68ee);
    }
    mat-card-actions button:nth-child(2):hover {
      background: linear-gradient(90deg, #e55a5a, #6a57d5);
    }
    mat-card-actions button[color="warn"] {
      background: #ff6b6b;
    }
    mat-card-actions button[color="warn"]:hover {
      background: #e55a5a;
    }
    .no-tasks {
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;
      color: #636e72;
      text-align: center;
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
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filterStatus: string = '';
  username: string | null = null;
  private filterSubject = new Subject<string>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.filterSubject.pipe(debounceTime(300)).subscribe(status => {
      this.loadTasks(status);
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.filterSubject.complete();
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.filterSubject.next(status);
  }

  loadTasks(status: string = this.filterStatus): void {
    this.taskService.getTasks(status).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.cdr.markForCheck();
      },
      error: (err) => {
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

  markAsCompleted(task: Task): void {
    if (!task.id) {
      this.snackBar.open('Task ID is missing', 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.taskService.updateTask(task.id, { ...task, status: 'completed' }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        this.snackBar.open(err.error.message, 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteTask(id: number | undefined): void {
    if (!id) {
      this.snackBar.open('Task ID is missing', 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        this.snackBar.open(err.error.message, 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}