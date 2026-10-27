import { describe, it, expect } from '@jest/globals';
import { can, PERMISSION_MATRIX } from '../src/lib/permissions';
import { Role, Action } from '../src/types';

describe('Permissions Matrix & can(role, action) Unit Tests', () => {
  describe('Guest permissions', () => {
    const role: Role = 'guest';

    it('should ALLOW viewing deadlines', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('should FORBID marking deadlines as complete', () => {
      expect(can(role, 'toggle_complete')).toBe(false);
    });

    it('should FORBID creating deadlines', () => {
      expect(can(role, 'create_deadline')).toBe(false);
    });

    it('should FORBID deleting deadlines', () => {
      expect(can(role, 'delete_deadline')).toBe(false);
    });
  });

  describe('User (Student) permissions', () => {
    const role: Role = 'user';

    it('should ALLOW viewing deadlines', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('should ALLOW marking deadlines as complete', () => {
      expect(can(role, 'toggle_complete')).toBe(true);
    });

    it('should FORBID creating deadlines', () => {
      expect(can(role, 'create_deadline')).toBe(false);
    });

    it('should FORBID deleting deadlines', () => {
      expect(can(role, 'delete_deadline')).toBe(false);
    });
  });

  describe('Admin (Class Monitor) permissions', () => {
    const role: Role = 'admin';

    it('should ALLOW viewing deadlines', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('should ALLOW marking deadlines as complete', () => {
      expect(can(role, 'toggle_complete')).toBe(true);
    });

    it('should ALLOW creating deadlines', () => {
      expect(can(role, 'create_deadline')).toBe(true);
    });

    it('should ALLOW deleting deadlines', () => {
      expect(can(role, 'delete_deadline')).toBe(true);
    });
  });

  describe('Edge cases and defensive authorization', () => {
    it('should treat null role as guest', () => {
      expect(can(null, 'view_deadline')).toBe(true);
      expect(can(null, 'create_deadline')).toBe(false);
      expect(can(null, 'delete_deadline')).toBe(false);
    });

    it('should treat undefined role as guest', () => {
      expect(can(undefined, 'view_deadline')).toBe(true);
      expect(can(undefined, 'create_deadline')).toBe(false);
      expect(can(undefined, 'toggle_complete')).toBe(false);
    });

    it('should treat invalid or unrecognized role as guest', () => {
      expect(can('hacker' as unknown as Role, 'create_deadline')).toBe(false);
      expect(can('' as unknown as Role, 'delete_deadline')).toBe(false);
    });

    it('should return false for unrecognized action', () => {
      expect(can('admin', 'unknown_action' as unknown as Action)).toBe(false);
      expect(can('user', 'unknown_action' as unknown as Action)).toBe(false);
      expect(can('guest', 'unknown_action' as unknown as Action)).toBe(false);
    });
  });
});
