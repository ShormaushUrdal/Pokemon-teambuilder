export interface AllauthUser {
  pk: number;
  username: string;
  email: string;
  display: string;
}

export interface AuthState {
  user: AllauthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AllauthResponse {
  data: {
    user: AllauthUser;
  };
  meta: {
    is_authenticated: boolean;
  };
}