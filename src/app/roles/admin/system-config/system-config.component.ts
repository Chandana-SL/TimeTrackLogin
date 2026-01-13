import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  name: string;
  color: string; // hex
  active: boolean;
}

interface SystemSettings {
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  overtimeThresholdHoursPerWeek: number;
  minimumBreakMinutes: number;
  minimumLogDurationMinutes: number;
  autoLogoutMinutes: number;
}

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})
export class SystemConfigComponent implements OnInit {
  // Categories UI
  categories: Category[] = [];
  showAddCategory = false;
  newCategoryName = '';
  newCategoryColor = '#3b82f6';

  // Settings defaults (match screenshot)
  settings: SystemSettings = {
    workingHoursPerDay: 8,
    workingDaysPerWeek: 5,
    overtimeThresholdHoursPerWeek: 40,
    minimumBreakMinutes: 30,
    minimumLogDurationMinutes: 15,
    autoLogoutMinutes: 60
  };

  ngOnInit(): void {
    // Populate demo categories from the screenshot
    this.categories = [
      { name: 'Development', color: '#3b82f6', active: true },
      { name: 'Design', color: '#8b5cf6', active: true },
      { name: 'Meeting', color: '#fc4899', active: true },
      { name: 'Documentation', color: '#10b981', active: true },
      { name: 'Testing', color: '#f59e0b', active: true }
    ];
  }

  toggleAddCategory() {
    this.showAddCategory = !this.showAddCategory;
    if (!this.showAddCategory) this.resetNewCategory();
  }

  resetNewCategory() {
    this.newCategoryName = '';
    this.newCategoryColor = '#3b82f6';
  }

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) {
      alert('Please enter a category name.');
      return;
    }
    // prevent duplicates (case-insensitive)
    if (this.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Category already exists.');
      return;
    }
    this.categories.push({ name, color: this.newCategoryColor, active: true });
    this.resetNewCategory();
    this.showAddCategory = false;
  }

  removeCategory(i: number) {
    if (!confirm(`Delete category "${this.categories[i].name}"?`)) return;
    this.categories.splice(i, 1);
  }

  toggleCategoryActive(c: Category) {
    c.active = !c.active;
  }

  saveSettings() {
    // Basic validation
    if (this.settings.workingHoursPerDay <= 0 || this.settings.workingDaysPerWeek <= 0) {
      alert('Working hours and working days must be positive numbers.');
      return;
    }
    // In a real app persist settings via API; here we simulate save
    console.log('Saved settings:', this.settings, 'categories:', this.categories);
    alert('Settings saved.');
  }
}