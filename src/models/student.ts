import { User } from "./user";

export interface StudentListResponse {
  success: boolean;
  students: Student[];
  message?: string;
}

export interface StudentResponse {
  success: boolean;
  student: Student;
  message?: string;
}

export interface Student {
  id: number;
  user_id: number;
  admission_no: string;
  group_id: number;
  parent_id?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  user: User;
  group?: Group;
  parent?: Parent;
}

export interface Group {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;

}

export interface Parent {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}
