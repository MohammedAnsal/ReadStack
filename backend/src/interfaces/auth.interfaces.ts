export interface SignUpResponse {
  message: string;
  status: boolean;
  email?: string;
}

export interface SignInResponse extends SignUpResponse {
  userName?: string;
  accessToken?: string;
  refreshToken?: string;
}
