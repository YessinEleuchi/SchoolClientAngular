import { Level } from './level.model';
import { Teacher } from './teacher.model';
import { CourseFile } from './course-file.model';

export interface Subject {
  id?: number;
  name: string;
  level_id: number;

  level?: Level;
  teachers?: Teacher[];
  courseFiles?: CourseFile[];
}
