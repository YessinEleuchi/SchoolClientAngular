import { Field } from './field.model';
import { Level } from './level.model';

export interface Specialization {
  id?: number;
  name: string;
  field_id: number;

  field?: Field;
  levels?: Level[];
}
