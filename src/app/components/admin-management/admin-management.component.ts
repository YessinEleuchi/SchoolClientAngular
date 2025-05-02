import { Component, OnInit } from '@angular/core';
import { CycleService } from '../../../services/cycle.service';
import { FieldService } from '../../../services/field.service';
import { SpecializationService } from '../../../services/specialization.service';
import { LevelService } from '../../../services/level.service';
import { GroupService } from '../../../services/group.service';
import { SubjectService } from '../../../services/subject.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html'
})
export class AdminManagementComponent implements OnInit {
  entityTypes = ['cycle', 'field', 'specialization', 'level', 'group', 'subject'];
  selectedEntityType: string = 'cycle';
  items: any[] = [];
  relatedData: any = {};
  isLoading: boolean = false;
  errorMessage: string = '';
  showForm: boolean = false;
  selectedItem: any = null;

  constructor(
    private cycleService: CycleService,
    private fieldService: FieldService,
    private specializationService: SpecializationService,
    private levelService: LevelService,
    private groupService: GroupService,
    private subjectService: SubjectService,
    private authService: AuthService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.role.toLowerCase() !== 'admin') {
      this.authService.logout();
      return;
    }
    this.loadRelatedData();
    this.loadItems();
  }

  loadRelatedData(): void {
    this.cycleService.getAllCycles().subscribe(cycles => this.relatedData.cycles = cycles);
    this.fieldService.getAllFields().subscribe(fields => this.relatedData.fields = fields);
    this.specializationService.getAllSpecializations().subscribe(specializations => this.relatedData.specializations = specializations);
    this.levelService.getAllLevels().subscribe(levels => this.relatedData.levels = levels);
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const serviceMethod = this.getServiceMethod();
    serviceMethod.subscribe({
      next: (data: any[]) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message || `Failed to load ${this.selectedEntityType}s`;
        this.isLoading = false;
      }
    });
  }

  getServiceMethod(): Observable<any[]> {
    switch (this.selectedEntityType) {
      case 'cycle': return this.cycleService.getAllCycles();
      case 'field': return this.fieldService.getAllFields();
      case 'specialization': return this.specializationService.getAllSpecializations();
      case 'level': return this.levelService.getAllLevels();
      case 'group': return this.groupService.getAllGroups();
      case 'subject': return this.subjectService.getAllSubjects();
      default: throw new Error('Invalid entity type');
    }
  }

  onEntityTypeChange(): void {
    this.loadItems();
    this.showForm = false;
    this.selectedItem = null;
  }

  addItem(): void {
    this.selectedItem = null;
    this.showForm = true;
  }

  editItem(item: any): void {
    this.selectedItem = item;
    this.showForm = true;
  }

  deleteItem(id: number): void {
    // Open the ConfirmDialogComponent
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete this ${this.selectedEntityType}?` } // Optional: pass data if your dialog needs it
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { // User clicked Confirm
        this.isLoading = true;
        const deleteMethod = this.getDeleteMethod(id);
        deleteMethod.subscribe({
          next: () => {
            this.loadItems();
          },
          error: (err: any) => {
            this.errorMessage = err.message || `Failed to delete ${this.selectedEntityType}`;
            this.isLoading = false;
          }
        });
      }
    });
  }

  getDeleteMethod(id: number): Observable<any> {
    switch (this.selectedEntityType) {
      case 'cycle': return this.cycleService.deleteCycle(id);
      case 'field': return this.fieldService.deleteField(id);
      case 'specialization': return this.specializationService.deleteSpecialization(id);
      case 'level': return this.levelService.deleteLevel(id);
      case 'group': return this.groupService.deleteGroup(id);
      case 'subject': return this.subjectService.deleteSubject(id);
      default: throw new Error('Invalid entity type');
    }
  }

  onFormSubmit(response: any): void {
    this.showForm = false;
    this.selectedItem = null;
    this.loadItems();
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedItem = null;
  }
}