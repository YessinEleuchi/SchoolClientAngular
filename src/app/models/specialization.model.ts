import { Field } from './field.model';
import { Level } from './level.model';

export interface Specialization {
  id: number;
  name: string;
  field_id: number;

  created_at: string;
  updated_at: string;
  field?: Field;
  levels?: Level[];
}
