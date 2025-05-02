import { Cycle } from './cycle.model';
import { Specialization } from './specialization.model';

export interface Field {
  id?: number;
  name: string;
  cycle_id: number;

  cycle?: Cycle;
  specializations?: Specialization[];
}
