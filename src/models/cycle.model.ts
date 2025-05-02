import { Field } from './field.model';

export interface Cycle {
  id?: number;
  name: string;

  fields?: Field[];
}
