import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ParentService } from '../../../../services/parent.service';
import { AuthService } from '../../../../services/auth.service';
import { Parent } from '../../../../models/parent.model';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.scss']
})
export class ParentListComponent implements OnInit {
  parents: Parent[] = [];
  pagination: { current_page: number; last_page: number; per_page: number; total: number } | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  isMobile: boolean = window.innerWidth < 640; // Mobile breakpoint (sm)

  constructor(
    private parentService: ParentService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.role.toLowerCase() !== 'admin') {
      this.authService.logout();
      return;
    }
    this.loadParents();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 640;
  }

  loadParents(page: number = 1, perPage: number = 6): void {
    this.isLoading = true;
    this.parentService.getParentsPaginated(page, perPage).subscribe({
      next: (response) => {
        this.parents = response.parents;
        this.pagination = response.pagination;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagination!.last_page) {
      this.loadParents(page);
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    const currentPage = this.pagination.current_page;
    const lastPage = this.pagination.last_page;
    const maxPagesToShow = 5; // Show up to 5 page numbers
    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  addParent(): void {
    this.router.navigate(['/admin/parents/add']);
  }

  editParent(id: number): void {
    this.router.navigate([`/admin/parents/edit/${id}`]);
  }

  deleteParent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.isMobile ? '90%' : '300px',
      height: '200px',
      data: { message: 'Are you sure you want to delete this parent?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.parentService.deleteParent(id).subscribe({
          next: () => {
            // Reload the current page to maintain pagination
            this.loadParents(this.pagination!.current_page);
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = err.message;
          }
        });
      }
    });
  }
}
