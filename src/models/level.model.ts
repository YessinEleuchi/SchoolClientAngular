import { Specialization } from './specialization.model';
import { Group } from './group.model';
import { Subject } from './subject.model';

export interface Level {
  id?: number;
  name: string;
  specialization_id: number;

  specialization?: Specialization;
  groups?: Group[];
  subjects?: Subject[];
}
