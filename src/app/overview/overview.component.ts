import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable, forkJoin } from 'rxjs';
import {StudentService} from "../../services/student.service";

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './Overview.component.html',
  styleUrls: []
})
export class OverviewComponent implements OnInit {
  totalStudents = 0; // Initialize as 0, will be updated from service
  studentData = {
    ingenierie: 0,
    license: 0,
    preparatoire: 0,
    architecture: 0
  };

  pieChart: any;
  barChart: any;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.fetchStudentData();
  }

  fetchStudentData(): void {
    // Combine all API calls using forkJoin
    forkJoin({
      total: this.studentService.getTotalStudents(),
      ingenierie: this.studentService.getTotalStudentsByCycle(1), // Cycle ID for Ingénierie
      license: this.studentService.getTotalStudentsByCycle(2),    // Cycle ID for License
      preparatoire: this.studentService.getTotalStudentsByCycle(3), // Cycle ID for Préparatoire
      architecture: this.studentService.getTotalStudentsByCycle(4)  // Cycle ID for Architecture
    }).subscribe({
      next: (results) => {
        // Update component properties with fetched data
        this.totalStudents = results.total;
        this.studentData.ingenierie = results.ingenierie;
        this.studentData.license = results.license;
        this.studentData.preparatoire = results.preparatoire;
        this.studentData.architecture = results.architecture;

        // Initialize charts after data is fetched
        this.initCharts();
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
        // Optionally handle errors (e.g., show a message to the user)
        this.initCharts(); // Initialize charts with default/empty data
      }
    });
  }

  initCharts(): void {
    this.createPieChart();
    this.createBarChart();
  }

  createPieChart(): void {
    const ctx = document.getElementById('studentPieChart') as HTMLCanvasElement;

    const labels = ['Ingénierie', 'License', 'Préparatoire', 'Architecture'];
    const data = [
      this.studentData.ingenierie,
      this.studentData.license,
      this.studentData.preparatoire,
      this.studentData.architecture
    ];

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#3B82F6',
            '#EF4444',
            '#14B8A6',
            '#FACC15'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Distribution des Étudiants par Cycle'
          }
        }
      }
    });
  }

  createBarChart(): void {
    const ctx = document.getElementById('studentBarChart') as HTMLCanvasElement;

    const labels = ['Ingénierie', 'License', 'Préparatoire', 'Architecture'];
    const data = [
      this.studentData.ingenierie,
      this.studentData.license,
      this.studentData.preparatoire,
      this.studentData.architecture
    ];

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'étudiants',
          data: data,
          backgroundColor: [
            '#3B82F6',
            '#EF4444',
            '#14B8A6',
            '#FACC15'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Nombre d\'Étudiants par Cycle'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getPercentage(value: number): string {
    return this.totalStudents > 0
      ? ((value / this.totalStudents) * 100).toFixed(1) + '%'
      : '0%'; // Prevent division by zero
  }
}
