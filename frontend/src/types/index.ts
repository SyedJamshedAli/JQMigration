export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  roleId: string;
  country: string | null;
  timezone: string | null;
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string | null;
  emailVerifiedAt: string | null;
  isTrashed: boolean;
  isProtected: boolean;
  invitedByUserId: string | null;
  role: UserRole;
}

export interface UserRole {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isTrashed: boolean;
  isProtected: boolean;
  isDefault: boolean;
  createdAt: string;
  permissions?: UserRolePermission[];
}

export interface UserPermission {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface UserRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  assignedAt: string;
  role?: UserRole;
  permission?: UserPermission;
}

export interface SystemSetting {
  id: string;
  name: string;
  logo: string | null;
  active: boolean;
  address: string | null;
  websiteURL: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  language: string;
  timezone: string;
  currency: string;
  currencyFormat: string;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  socialLinkedIn: string | null;
  socialPinterest: string | null;
  socialYoutube: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    status: string;
    roleId: string;
    roleName: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  roleId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
