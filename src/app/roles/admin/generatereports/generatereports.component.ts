import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart as ChartType } from 'chart.js';

declare var Chart: any;

@Component({
  selector: 'app-generatereports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generatereports.component.html',
  styleUrls: ['./generatereports.component.css']
})
export class GeneratereportsComponent implements OnInit, AfterViewInit, OnDestroy {
  availablePeriods = [
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 }
  ];
  selectedPeriod = 7;
  departments = ['Engineering', 'IT', 'Marketing'];
  selectedDepartment = 'All';

  summary = {
    totalHours: 39,
    avgHoursPerEmployee: 9.8,
    taskCompletionPct: 20,
    activeEmployees: 4,
    avgEmployeesPerDept: 1.3
  };

  roleDistribution = { employees: 4, managers: 1, admins: 1 };
  taskStatus = { completed: 1, inProgress: 2, pending: 2 };

  departmentRows = [
    { department: 'Engineering', employees: 4, totalHours: 39.3, completedTasks: 1, avgHoursPerEmployee: 9.8 },
    { department: 'IT', employees: 1, totalHours: 0, completedTasks: 0, avgHoursPerEmployee: 0.0 },
    { department: 'Marketing', employees: 1, totalHours: 0, completedTasks: 0, avgHoursPerEmployee: 0.0 }
  ];

  @ViewChild('hoursTrendCanvas') hoursTrendCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('roleDistributionCanvas') roleDistributionCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('hoursByDeptCanvas') hoursByDeptCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskStatusCanvas') taskStatusCanvas?: ElementRef<HTMLCanvasElement>;

  hoursTrendChart: any = null;
  roleChart: any = null;
  hoursByDeptChart: any = null;
  taskStatusChart: any = null;

  constructor() {
    this.loadChartJS();
  }

  private loadChartJS() {
    if (!window.hasOwnProperty('Chart')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.createCharts(), 100);
    window.addEventListener('resize', () => this.onWindowResize());
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    window.removeEventListener('resize', () => this.onWindowResize());
  }

  private onWindowResize() {
    this.updateCharts();
  }

  refreshData() {
    this.updateCharts();
  }

  resetFilters() {
    this.selectedPeriod = 7;
    this.selectedDepartment = 'All';
    this.updateCharts();
  }

  onPeriodChange() {
    this.updateCharts();
  }

  onDepartmentChange() {
    this.updateCharts();
  }

  exportReport() {
    const headers = ['Department', 'Employees', 'Total Hours', 'Completed Tasks', 'Avg Hours/Employee'];
    const rows = this.departmentRows.map(r => [
      r.department,
      String(r.employees),
      String(r.totalHours),
      String(r.completedTasks),
      String(r.avgHoursPerEmployee)
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organization-analytics-' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private createCharts() {
    if (typeof Chart === 'undefined') {
      setTimeout(() => this.createCharts(), 100);
      return;
    }
    this.createHoursTrendChart();
    this.createRoleDistributionChart();
    this.createHoursByDeptChart();
    this.createTaskStatusChart();
  }

  private updateCharts() {
    if (this.hoursTrendChart) {
      this.hoursTrendChart.data.labels = this.getDateLabels(this.selectedPeriod);
      this.hoursTrendChart.data.datasets[0].data = this.getHourSeriesForPeriod(this.selectedPeriod);
      this.hoursTrendChart.update();
    }
    if (this.roleChart) {
      this.roleChart.data.datasets[0].data = [this.roleDistribution.employees, this.roleDistribution.managers, this.roleDistribution.admins];
      this.roleChart.update();
    }
    if (this.hoursByDeptChart) {
      this.hoursByDeptChart.data.labels = this.departmentRows.map(r => r.department);
      this.hoursByDeptChart.data.datasets[0].data = this.departmentRows.map(r => r.totalHours);
      this.hoursByDeptChart.update();
    }
    if (this.taskStatusChart) {
      this.taskStatusChart.data.datasets[0].data = [this.taskStatus.completed, this.taskStatus.inProgress, this.taskStatus.pending];
      this.taskStatusChart.update();
    }
  }

  private destroyCharts() {
    [this.hoursTrendChart, this.roleChart, this.hoursByDeptChart, this.taskStatusChart].forEach(chart => {
      if (chart) chart.destroy();
    });
    this.hoursTrendChart = this.roleChart = this.hoursByDeptChart = this.taskStatusChart = null;
  }

  private createHoursTrendChart() {
    const canvas = this.hoursTrendCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.hoursTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getDateLabels(this.selectedPeriod),
        datasets: [
          {
            label: 'Hours Logged',
            data: this.getHourSeriesForPeriod(this.selectedPeriod),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#eef2e9', drawBorder: false },
            ticks: { font: { size: 12 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: 12, cornerRadius: 8, titleFont: { size: 13 }, bodyFont: { size: 12 } }
        }
      }
    });
  }

  private createRoleDistributionChart() {
    const canvas = this.roleDistributionCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.roleChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Employees', 'Managers', 'Admins'],
        datasets: [
          {
            data: [this.roleDistribution.employees, this.roleDistribution.managers, this.roleDistribution.admins],
            backgroundColor: ['#60a5fa', '#8cc63f', '#a78bfa'],
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 15, font: { size: 12 }, generateLabels: (chart: any) => {
              const data = chart.data;
              return (data.labels || []).map((label: string, i: number) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: (data.datasets[0].backgroundColor as string[])[i],
                hidden: false,
                index: i
              }));
            }}
          },
          tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: 12, cornerRadius: 8 }
        }
      }
    });
  }

  private createHoursByDeptChart() {
    const canvas = this.hoursByDeptCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.hoursByDeptChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departmentRows.map(r => r.department),
        datasets: [
          {
            label: 'Total Hours',
            data: this.departmentRows.map(r => r.totalHours),
            backgroundColor: ['#6366f1', '#8cc63f', '#f59e0b'],
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#eef2e9', drawBorder: false },
            ticks: { font: { size: 12 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: 12, cornerRadius: 8 }
        }
      }
    });
  }

  private createTaskStatusChart() {
    const canvas = this.taskStatusCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.taskStatusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
          {
            data: [this.taskStatus.completed, this.taskStatus.inProgress, this.taskStatus.pending],
            backgroundColor: ['#10b981', '#f59e0b', '#6b7280'],
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 15, font: { size: 12 }, generateLabels: (chart: any) => {
              const data = chart.data;
              return (data.labels || []).map((label: string, i: number) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: (data.datasets[0].backgroundColor as string[])[i],
                hidden: false,
                index: i
              }));
            }}
          },
          tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: 12, cornerRadius: 8 }
        }
      }
    });
  }

  private getDateLabels(days: number): string[] {
    const labels: string[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
  }

  private getHourSeriesForPeriod(days: number): number[] {
    const data7 = [0, 0, 1, 1, 3, 2, 32];
    if (days === 7) return data7;
    const data14 = [0, 0, 0, 1, 1, 1, 3, 2, 2, 5, 8, 10, 4, 32];
    if (days === 14) return data14;
    return Array.from({ length: days }, () => Math.round(Math.random() * 8));
  }
}