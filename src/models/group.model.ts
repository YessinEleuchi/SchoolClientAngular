import { Level } from './level.model';
import { Student } from './student.model';

export interface Group {
  id?: number;
  name: string;
  level_id: number;

  level?: Level;
  students?: Student[];
}
