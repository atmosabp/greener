export interface UserEditValues{
    name?: string;
    email?: string;
    password?: string;
    isAdm?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_adm: boolean;
}

export interface UserWithPassword extends User {
  password: string;
}