import { Cycle } from './cycle.model';

export interface Field {
  id: number;
  name: string;
  cycle_id?: number;
  cycle?: Cycle;
  created_at: string;
  updated_at: string;
}
