import { Subject } from './subject.model';
import { Teacher } from './teacher.model';

export interface CourseFile {
  id?: number;
  subject_id: number;
  teacher_id: number;
  file_name: string;
  file_path: string;

  subject?: Subject;
  teacher?: Teacher;
}
