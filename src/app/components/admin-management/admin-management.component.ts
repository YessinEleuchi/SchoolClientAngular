import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CycleService } from '../../../services/cycle.service';
import { FieldService } from '../../../services/field.service';
import { SpecializationService } from '../../../services/specialization.service';
import { LevelService } from '../../../services/level.service';
import { GroupService } from '../../../services/group.service';
import { SubjectService } from '../../../services/subject.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Cycle } from '../../../models/cycle.model';
import { Level } from '../../../models/level.model';
import { Field } from '../../../models/field.model';
import { Specialization } from '../../../models/specialization.model';
import { Group } from '../../../models/group.model';
import { Subject } from '../../../models/subject.model';

interface Entity {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  cycle?: Cycle;
  field?: Field;
  specialization?: Specialization;
  level?: Level;
  group?: Group;
  [key: string]: any;
}

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html'
})
export class AdminManagementComponent implements OnInit {
  entityTypes = ['cycle', 'field', 'specialization', 'level', 'group', 'subject'] as const;
  selectedEntityType: typeof this.entityTypes[number] = 'cycle';
  items: Entity[] = [];
  relatedData: {
    cycles?: Cycle[];
    fields?: Field[];
    specializations?: Specialization[];
    levels?: Level[];
    groups?: Group[];
    subjects?: Subject[];
  } = {};
  isLoading = false;
  errorMessage = '';
  showForm = false;
  selectedItem: Entity | null = null;

  constructor(
    private cycleService: CycleService,
    private fieldService: FieldService,
    private specializationService: SpecializationService,
    private levelService: LevelService,
    private groupService: GroupService,
    private subjectService: SubjectService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
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
    this.cycleService.getAllCycles().subscribe({
      next: cycles => {
        this.relatedData.cycles = cycles;
        console.log('Related cycles:', cycles);
      },
      error: err => console.error('Error loading related cycles:', err)
    });
    // ... (other service calls)
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const serviceMethod = this.getServiceMethod();
    serviceMethod.pipe(first()).subscribe({
      next: (data: Entity[]) => {
        console.log('Received items in loadItems:', data);
        this.items = data;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error in loadItems:', err);
        this.errorMessage = err.message || `Failed to load ${this.selectedEntityType}s`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getServiceMethod(): Observable<Entity[]> {
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

  editItem(item: Entity): void {
    this.selectedItem = item;
    this.showForm = true;
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete this ${this.selectedEntityType}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isLoading = true;
        this.errorMessage = '';
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
