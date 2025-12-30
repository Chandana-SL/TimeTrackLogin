import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
roles: string[] = ['Employee', 'Manager', 'Admin'];
  signinForm: FormGroup;
 
  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }
 
  // Helper for HTML access
  get f() { return this.signinForm.controls; }
 
  // signin.component.ts
onLogin() {
  if (this.signinForm.valid) {
    const email = this.signinForm.value.email.toLowerCase();
    const selectedRole = this.signinForm.value.role;
    const enteredpassword=this.signinForm.value.password;
 
    // Retrieve the role saved during registration
   // const registeredRole = localStorage.getItem(email);
    const storedUserJson = localStorage.getItem(email);
 
    if (!storedUserJson) {
      alert('Email not found. Please register first.');
      return;
    }
    const registeredUser = JSON.parse(storedUserJson);
    if (selectedRole !== registeredUser.role) {
      alert(`Access Denied: You are registered as ${registeredUser.role}, not ${selectedRole}.`);
      return;
    }

    if (enteredpassword !== registeredUser.password) {
      alert('Invalid Password. Please try again.');
      return;
    }
    
    
    localStorage.setItem('isLoggedIn', 'true');
    alert('Login Successful!');
 
    // Role-based navigation using your folder structure
    if (selectedRole === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (selectedRole === 'Employee') {
      this.router.navigate(['/employee/dashboardemployee']);
    } else {
      this.router.navigate(['/manager']);
    }
  }
}
}