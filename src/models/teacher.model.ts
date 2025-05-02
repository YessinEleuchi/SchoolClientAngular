import { User } from './user.model';
import { Subject } from './subject.model';
import { CourseFile } from './course-file.model';
import {TeacherStatutEnum} from "../enums/teacher-status.enums";

export interface Teacher {
  id?: number;
  user_id: number;
  class_id?: number;
  admission_no?: string;
  status:  TeacherStatutEnum

  // Relations
  user?: User;
  subjects?: Subject[];
  courseFiles?: CourseFile[];
}
