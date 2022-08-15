export const UserRole = {
  ADMIN: 'ADMIN',
  NORMAL: 'NORMAL',
} as const;

export type UserRoleType = keyof typeof UserRole;

export interface UserSession {
  uid: string;
  email: string | undefined;
  phone_number?: string;
  picture?: any;
  userRole: UserRoleType;
}
