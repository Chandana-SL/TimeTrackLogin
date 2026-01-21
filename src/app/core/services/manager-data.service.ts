import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerDataService {

  // UPDATED: Initial state now calls getSavedUser() to prevent "Loading..." on refresh
  private currentUserSubject = new BehaviorSubject<any>(this.getSavedUser());
  currentUser$ = this.currentUserSubject.asObservable();

  // 1. DUMMY DATA FOR TIME LOGS
  private initialLogs = [
    { employee: 'Akash', date: 'Jan 12', startTime: '09:00', endTime: '17:30', break: 60, totalHours: 7.50 },
    { employee: 'Chandana chai', date: 'Jan 12', startTime: '08:30', endTime: '17:00', break: 60, totalHours: 7.50 },
    { employee: 'Prachothan reddy', date: 'Jan 12', startTime: '09:00', endTime: '18:30', break: 60, totalHours: 8.50 },
    { employee: 'Akash', date: 'Jan 11', startTime: '09:00', endTime: '18:00', break: 60, totalHours: 8.00 },
    { employee: 'Chandana chai', date: 'Jan 11', startTime: '09:00', endTime: '17:00', break: 30, totalHours: 7.50 },
    { employee: 'Prachothan reddy', date: 'Jan 10', startTime: '10:00', endTime: '19:00', break: 60, totalHours: 8.00 },
    { employee: 'Gopi Krishna', date: 'Jan 12', startTime: '10:00', endTime: '19:00', break: 60, totalHours: 8.00 },
    { employee: 'Umesh', date: 'Jan 12', startTime: '08:00', endTime: '16:00', break: 60, totalHours: 7.00 }
  ];

  // 2. DUMMY DATA FOR TASKS
  private initialTasks = [
    { title: 'API Integration', description: 'Connect frontend to login service', assignedTo: 'Akash', hours: 12, status: 'In Progress' },
    { title: 'UI Refinement', description: 'Adjust table padding and font sizes', assignedTo: 'Chandana chai', hours: 4, status: 'Completed' },
    { title: 'Database Design', description: 'Create SQL schema for time tracking', assignedTo: 'Prachothan reddy', hours: 20, status: 'Pending' },
    { title: 'Unit Testing', description: 'Write tests for manager dashboard', assignedTo: 'Umesh', hours: 8, status: 'In Progress' }
  ];

  // 3. DUMMY DATA FOR ANALYTICS
  private initialPerformance = [
    { name: 'Akash', hours: 35.5, tasks: 4, efficiency: 92, status: 'Excellent' },
    { name: 'Chandana', hours: 28.0, tasks: 3, efficiency: 85, status: 'Excellent' },
    { name: 'Prachothan', hours: 15.5, tasks: 1, efficiency: 45, status: 'Needs Attention' },
    { name: 'Gopi', hours: 11.5, tasks: 1, efficiency: 27, status: 'Needs Attention' },
    { name: 'Umesh', hours: 40.2, tasks: 6, efficiency: 98, status: 'Excellent' }
  ];

  private logsSubject = new BehaviorSubject<any[]>(this.initialLogs);
  private tasksSubject = new BehaviorSubject<any[]>(this.initialTasks);
  private perfSubject = new BehaviorSubject<any[]>(this.initialPerformance);

  logs$ = this.logsSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();
  performance$ = this.perfSubject.asObservable();

  constructor() {}

  // NEW: Helper to recover user data from storage during page refresh
  private getSavedUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('user_session');
      if (saved) {
        const user = JSON.parse(saved);
        // Prioritize fullName from signup to ensure it displays correctly
        const name = user.fullName || user.firstName || 'Manager';
        return {
          name: name,
          role: user.role,
          initial: name.charAt(0).toUpperCase()
        };
      }
    }
    return { name: 'Loading...', role: '', initial: '' };
  }

  // Updates the navbar globally
  setUser(name: string, role: string) {
    this.currentUserSubject.next({
      name: name,
      role: role,
      initial: name.charAt(0).toUpperCase()
    });
  }

  // NEW: Resets the navbar data back to default on logout
  clearUser() {
    this.currentUserSubject.next({
      name: 'Loading...',
      role: '',
      initial: ''
    });
  }

  addLog(log: any) {
    const current = this.logsSubject.value;
    this.logsSubject.next([...current, log]);
  }

  addTask(task: any) {
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([task, ...currentTasks]);
  }

  deleteTask(index: number) {
    const currentTasks = this.tasksSubject.value;
    currentTasks.splice(index, 1);
    this.tasksSubject.next([...currentTasks]);
  }
}