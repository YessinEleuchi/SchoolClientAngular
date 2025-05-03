import { Level } from './level.model';
import { Teacher } from './teacher.model';
import { CourseFile } from './course-file.model';

export interface Subject {
  id: number;
  name: string;
  level_id?: number;
  group_id?: number;
  created_at: string;
  updated_at: string;

  level?: Level;
  teachers?: Teacher[];
  courseFiles?: CourseFile[];
}
