import {RoleEnum} from "../enums/role.enums";
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  profile_picture?: string;
  role:  RoleEnum
  gender?: 'male' | 'female' ;
  date_of_birth?: string;
  phone?: string;
  address?: string;

}
