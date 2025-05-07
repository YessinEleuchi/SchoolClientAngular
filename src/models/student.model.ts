import { User } from './user.model';
import { Group } from './group.model';
import { Parent } from './parent.model';
import {StudentStatusEnums} from "../enums/student-status.enums";

export interface Student {
  id?: number;
  user_id: number;
  admission_no?: string;
  group_id?: number;
  parent_id?: number;
  status: StudentStatusEnums;

  // Relations
  user?: User;
  group?: Group;
  parent?: Parent;
}
