import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CycleService } from '../../../services/cycle.service';
import { FieldService } from '../../../services/field.service';
import { SpecializationService } from '../../../services/specialization.service';
import { LevelService } from '../../../services/level.service';
import { GroupService } from '../../../services/group.service';
import { SubjectService } from '../../../services/subject.service';
import { Observable } from 'rxjs'
@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html'
})
export class EntityFormComponent implements OnInit {
  @Input() entityType!: string; // e.g., 'cycle', 'field', etc.
  @Input() entityData: any = null; // Data for editing
  @Input() relatedData: any = {}; // Related data (e.g., cycles for fields)
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isLoading: boolean = false;

  constructor(
    private cycleService: CycleService,
    private fieldService: FieldService,
    private specializationService: SpecializationService,
    private levelService: LevelService,
    private groupService: GroupService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.entityData) {
      this.form.patchValue(this.entityData);
    }
  }

  initializeForm(): void {
    switch (this.entityType) {
      case 'cycle':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)])
        });
        break;
      case 'field':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          cycle_id: new FormControl('', [Validators.required])
        });
        break;
      case 'specialization':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          field_id: new FormControl('', [Validators.required])
        });
        break;
      case 'level':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          specialization_id: new FormControl('', [Validators.required])
        });
        break;
      case 'group':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          level_id: new FormControl('', [Validators.required])
        });
        break;
      case 'subject':
        this.form = new FormGroup({
          name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          level_id: new FormControl('', [Validators.required])
        });
        break;
      default:
        throw new Error('Invalid entity type');
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const data = this.form.value;
    const serviceMethod = this.entityData
      ? this.getUpdateMethod()
      : this.getAddMethod();

    serviceMethod.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.formSubmit.emit(response);
      },
      error: (err: any) => {
        this.errorMessage = err.message || `Failed to ${this.entityData ? 'update' : 'add'} ${this.entityType}`;
        if (err.error?.errors) {
          this.fieldErrors = err.error.errors;
        }
        this.isLoading = false;
      }
    });
  }

  getAddMethod(): Observable<any> {
    switch (this.entityType) {
      case 'cycle': return this.cycleService.addCycle(this.form.value);
      case 'field': return this.fieldService.addField(this.form.value);
      case 'specialization': return this.specializationService.addSpecialization(this.form.value);
      case 'level': return this.levelService.addLevel(this.form.value);
      case 'group': return this.groupService.addGroup(this.form.value);
      case 'subject': return this.subjectService.addSubject(this.form.value);
      default: throw new Error('Invalid entity type');
    }
  }

  getUpdateMethod(): Observable<any> {
    switch (this.entityType) {
      case 'cycle': return this.cycleService.updateCycle(this.entityData.id, this.form.value);
      case 'field': return this.fieldService.updateField(this.entityData.id, this.form.value);
      case 'specialization': return this.specializationService.updateSpecialization(this.entityData.id, this.form.value);
      case 'level': return this.levelService.updateLevel(this.entityData.id, this.form.value);
      case 'group': return this.groupService.updateGroup(this.entityData.id, this.form.value);
      case 'subject': return this.subjectService.updateSubject(this.entityData.id, this.form.value);
      default: throw new Error('Invalid entity type');
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}