export interface IRegisterUser {
  name: string;
  email: string;
  phone: string;
  pin: string;
  nid: string;
}

export interface ILoginUser {
  phone: string;
  pin: string;
}
