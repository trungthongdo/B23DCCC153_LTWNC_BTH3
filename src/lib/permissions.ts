import { Role, Action } from '@/types';

/**
 * Permission Matrix
 * Định nghĩa tập trung quyền hạn theo vai trò (guest, user, admin)
 */
export const PERMISSION_MATRIX: Record<Role, Record<Action, boolean>> = {
  guest: {
    view_deadline: true,
    toggle_complete: false,
    create_deadline: false,
    delete_deadline: false,
  },
  user: {
    view_deadline: true,
    toggle_complete: true,
    create_deadline: false,
    delete_deadline: false,
  },
  admin: {
    view_deadline: true,
    toggle_complete: true,
    create_deadline: true,
    delete_deadline: true,
  },
};

/**
 * Kiểm tra xem một vai trò có quyền thực hiện hành động hay không.
 * @param role Vai trò người dùng ('admin' | 'user' | 'guest')
 * @param action Hành động cần thực hiện ('view_deadline' | 'toggle_complete' | 'create_deadline' | 'delete_deadline')
 * @returns boolean true nếu có quyền, false nếu không
 */
export function can(role: Role | string | undefined | null, action: Action): boolean {
  if (!role || (role !== 'admin' && role !== 'user' && role !== 'guest')) {
    role = 'guest';
  }
  return PERMISSION_MATRIX[role as Role]?.[action] ?? false;
}
