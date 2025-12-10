export interface SignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  confirmPassword: string;
  preferences?: string[] 
}

export interface SignInDTO {
  email: string;
  password: string;
}
