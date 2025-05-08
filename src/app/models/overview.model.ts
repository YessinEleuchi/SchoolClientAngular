//overview.model.ts

export interface FieldData {
  field_name: string;
  student_count: number;
}

export interface CycleData {
  cycle_name: string;
  fields: FieldData[];
}

export interface StudentsByCycleAndFieldResponse {
  success: boolean;
  data: CycleData[];
}
