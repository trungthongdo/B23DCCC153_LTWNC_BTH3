export type Role = 'admin' | 'user' | 'guest';

export type Action =
  | 'view_deadline'
  | 'toggle_complete'
  | 'create_deadline'
  | 'delete_deadline';

export type Priority = 'high' | 'medium' | 'low';
export type DeadlineType = 'assignment' | 'project' | 'quiz' | 'exam';

export interface Subject {
  slug: string;
  name: string;
  code: string;
  credits: number;
  lecturer: string;
  email: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export interface Deadline {
  id: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  description: string;
  dueDate: string;
  priority: Priority;
  type: DeadlineType;
  completedBy: string[];
  createdAt: string;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
}
