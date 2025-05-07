import { Field } from './field.model';

export interface Cycle {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  fields?: Field[];
}
