export const UserRole = {
  ADMIN: 'ADMIN',
  NORMAL: 'NORMAL',
} as const;

export type UserRoleType = keyof typeof UserRole;

export interface UserSession {
  userId: string;
  userRole: UserRoleType;
}
