import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../../../services/parent.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html'
})
export class ParentListComponent implements OnInit {
  parents: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

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

  loadParents(): void {
    this.isLoading = true;
    this.parentService.getAllParents().subscribe({
      next: (parents) => {
        this.parents = parents;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  addParent(): void {
    this.router.navigate(['/admin/parents/add']);
  }

  editParent(id: number): void {
    this.router.navigate([`/admin/parents/edit/${id}`]);
  }

  deleteParent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this parent?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.parentService.deleteParent(id).subscribe({
          next: () => {
            this.parents = this.parents.filter(parent => parent.id !== id);
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
