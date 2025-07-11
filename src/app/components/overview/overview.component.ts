import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { CycleService } from '../../services/cycle.service';
import { TeacherService } from '../../services/teacher.service';
import { StudentsByCycleAndFieldResponse, CycleData, FieldData } from '../../models/overview.model';

Chart.register(...registerables);

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  totalStudents = 0;
  totalTeachers = 0;
  cycles: { id: number; name: string; count: number }[] = [];
  cycleFieldData: CycleData[] = [];
  loading = true;
  currentDate = new Date();

  pieChart: Chart<'pie', number[], string> | null = null;
  barChart: Chart<'bar', number[], string> | null = null;
  cycleFieldPieCharts: Chart<'pie', number[], string>[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private cycleService: CycleService
  ) {}

  ngOnInit(): void {
    this.fetchStudentData();
    this.fetchCycleFieldData();
  }

  ngAfterViewInit(): void {
    if (this.cycles.length > 0 && !this.pieChart && !this.barChart && this.cycleFieldPieCharts.length === 0) {
      setTimeout(() => this.initCharts(), 100);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
    this.cycleFieldPieCharts.forEach(chart => chart.destroy());
  }

  fetchStudentData(): void {
    this.loading = true;
    this.currentDate = new Date();

    const dataSub = forkJoin({
      totalStudents: this.studentService.getTotalStudents(),
      totalTeachers: this.teacherService.getTotalTeachers(),
      cycles: this.cycleService.getAllCycles()
    })
      .pipe(
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ({ totalStudents, totalTeachers, cycles }) => {
          this.totalStudents = totalStudents;
          this.totalTeachers = totalTeachers;

          const requests = cycles.map(cycle =>
            this.studentService.getTotalStudentsByCycle(cycle.id)
          );

          const countsSub = forkJoin(requests).subscribe(
            counts => {
              this.cycles = cycles.map((cycle, index) => ({
                id: cycle.id,
                name: cycle.name,
                count: counts[index]
              }));
              this.initCharts();
            },
            error => console.error('Error fetching student counts:', error)
          );
          this.subscriptions.push(countsSub);
        },
        error => console.error('Error fetching data:', error)
      );

    this.subscriptions.push(dataSub);
  }

  fetchCycleFieldData(): void {
    const sub = this.studentService.getStudentsByCycleAndField()
      .subscribe(
        response => {
          if (response.success) {
            this.cycleFieldData = response.data;
            this.initCharts();
          }
        },
        error => console.error('Error fetching cycle and field data:', error)
      );
    this.subscriptions.push(sub);
  }

  initCharts(): void {
    this.createPieChart();
    this.createBarChart();
    this.createCycleFieldPieCharts();
  }

  createPieChart(): void {
    const ctx = document.getElementById('studentPieChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.pieChart) this.pieChart.destroy();

    const labels = this.cycles.map(c => c.name);
    const data = this.cycles.map(c => c.count);

    this.pieChart = new Chart<'pie', number[], string>(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.generateColors(this.cycles.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14 },
              padding: 20,
              color: '#1f2937'
            }
          },
          title: {
            display: true,
            text: 'Student Distribution by Cycle',
            font: { size: 18, weight: 'bold' },
            color: '#1f2937',
            padding: { top: 20, bottom: 20 }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 10,
            callbacks: {
              label: context => {
                const label = context.label || '';
                const value = context.formattedValue;
                const percentage = this.getPercentage(this.cycles[context.dataIndex].count);
                return `${label}: ${value} (${percentage})`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  createBarChart(): void {
    const ctx = document.getElementById('studentBarChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.barChart) this.barChart.destroy();

    const labels = this.cycles.map(c => c.name);
    const data = this.cycles.map(c => c.count);

    this.barChart = new Chart<'bar', number[], string>(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Number of Students',
          data,
          backgroundColor: this.generateColors(this.cycles.length)[0],
          borderRadius: 8,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Students per Cycle',
            font: { size: 18, weight: 'bold' },
            color: '#1f2937',
            padding: { top: 20, bottom: 20 }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 10,
            callbacks: {
              label: context => {
                const value = context.formattedValue;
                const percentage = this.getPercentage(this.cycles[context.dataIndex].count);
                return `Students: ${value} (${percentage})`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { color: '#1f2937', font: { size: 12 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#1f2937', font: { size: 12 } }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  createCycleFieldPieCharts(): void {
    this.cycleFieldPieCharts.forEach(chart => chart.destroy());
    this.cycleFieldPieCharts = [];

    this.cycleFieldData.forEach((cycleData, index) => {
      const ctx = document.getElementById(`cycleFieldPieChart${index}`) as HTMLCanvasElement;
      if (!ctx) return;

      const labels = cycleData.fields.map(f => f.field_name);
      const data = cycleData.fields.map(f => f.student_count);

      const chart = new Chart<'pie', number[], string>(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: this.generateColors(labels.length),
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 20
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 12 },
                padding: 10,
                color: '#1f2937'
              }
            },
            title: {
              display: true,
              text: `Distribution des Étudiants - ${cycleData.cycle_name}`,
              font: { size: 16, weight: 'bold' },
              color: '#1f2937',
              padding: { top: 10, bottom: 10 }
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleFont: { size: 14 },
              bodyFont: { size: 12 },
              padding: 10,
              callbacks: {
                label: context => {
                  const value = context.raw as number;
                  const label = context.label || '';
                  const total = cycleData.fields.reduce((sum, f) => sum + f.student_count, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                  return `${label}: ${value} (${percentage})`;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
      this.cycleFieldPieCharts.push(chart);
    });
  }

  getPercentage(value: number): string {
    return this.totalStudents > 0
      ? ((value / this.totalStudents) * 100).toFixed(1) + '%'
      : '0%';
  }

  getFieldPercentage(value: number, cycleName: string): string {
    const cycle = this.cycles.find(c => c.name === cycleName);
    const total = cycle ? cycle.count : 0;
    return total > 0
      ? ((value / total) * 100).toFixed(1) + '%'
      : '0%';
  }

  generateColors(count: number): string[] {
    const baseColors = [
      '#3b82f6', '#ef4444', '#14b8a6', '#facc15',
      '#a78bfa', '#f472b6', '#34d399', '#f87171',
      '#60a5fa', '#fb7185', '#2dd4bf', '#f4d03f'
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  }

  getCycleIcon(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ingenieur')) return 'fas fa-cogs';
    if (lowerName.includes('license')) return 'fas fa-scroll';
    if (lowerName.includes('preparatoire')) return 'fas fa-book-open';
    if (lowerName.includes('architecture')) return 'fas fa-drafting-compass';
    return 'fas fa-graduation-cap';
  }

  getCycleIconClass(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ingenieur')) return 'bg-blue-100 text-blue-600';
    if (lowerName.includes('license')) return 'bg-red-100 text-red-600';
    if (lowerName.includes('preparatoire')) return 'bg-teal-100 text-teal-600';
    if (lowerName.includes('architecture')) return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-600';
  }
}
