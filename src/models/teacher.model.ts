export interface Teacher {
    id: number;
    user_id: number;
    admission_no: string;
    status: string;
    user: {
      id: number;
      name: string;
      email: string;
      gender: string;
      phone: string;
      address: string;
      date_of_birth: string;
    };
  }