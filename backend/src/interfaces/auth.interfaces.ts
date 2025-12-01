export interface SignUpResponse {
  message: string;
  status: boolean;
  email?: string;
}

export interface SignInResponse extends SignUpResponse {
  accessToken?: string;
  refreshToken?: string;
}