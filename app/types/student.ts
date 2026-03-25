// types/student.ts

export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  number: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentForm {
  name: string;
  email: string;
  age: number | '';
  number : string
}