import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CycleService } from '../../../services/cycle.service';
import { FieldService } from '../../../services/field.service';
import { SpecializationService } from '../../../services/specialization.service';
import { LevelService } from '../../../services/level.service';
import { GroupService } from '../../../services/group.service';
import { SubjectService } from '../../../services/subject.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
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
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
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
  isMobile = window.innerWidth < 640; // Mobile breakpoint (sm)

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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 640;
    this.cdr.detectChanges();
  }

  loadRelatedData(): void {
    this.cycleService.getAllCycles().subscribe({
      next: cycles => {
        this.relatedData.cycles = cycles;
      },
      error: err => console.error('Error loading related cycles:', err)
    });
    this.fieldService.getAllFields().subscribe({
      next: fields => {
        this.relatedData.fields = fields;
      },
      error: err => console.error('Error loading related fields:', err)
    });
    this.specializationService.getAllSpecializations().subscribe({
      next: specializations => {
        this.relatedData.specializations = specializations;
      },
      error: err => console.error('Error loading related specializations:', err)
    });
    this.levelService.getAllLevels().subscribe({
      next: levels => {
        this.relatedData.levels = levels;
      },
      error: err => console.error('Error loading related levels:', err)
    });
    this.groupService.getAllGroups().subscribe({
      next: groups => {
        this.relatedData.groups = groups;
      },
      error: err => console.error('Error loading related groups:', err)
    });
    this.subjectService.getAllSubjects().subscribe({
      next: subjects => {
        this.relatedData.subjects = subjects;
      },
      error: err => console.error('Error loading related subjects:', err)
    });
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const serviceMethod = this.getServiceMethod();
    serviceMethod.pipe(first()).subscribe({
      next: (data: Entity[]) => {
        this.items = data;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
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
    this.cdr.detectChanges();
  }

  addItem(): void {
    this.selectedItem = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editItem(item: Entity): void {
    this.selectedItem = item;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.isMobile ? '90%' : '300px',
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
            this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedItem = null;
    this.cdr.detectChanges();
  }
}
