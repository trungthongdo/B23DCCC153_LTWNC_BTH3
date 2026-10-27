import fs from 'fs/promises';
import path from 'path';
import { Subject, Deadline, User } from '@/types';

const SUBJECTS_FILE = path.join(process.cwd(), 'src', 'data', 'subjects.json');
const DEADLINES_FILE = path.join(process.cwd(), 'src', 'data', 'deadlines.json');
const USERS_FILE = path.join(process.cwd(), 'src', 'data', 'users.json');

// --- SUBJECTS ---
export async function getSubjects(): Promise<Subject[]> {
  try {
    const data = await fs.readFile(SUBJECTS_FILE, 'utf-8');
    return JSON.parse(data) as Subject[];
  } catch (error) {
    console.error('Error reading subjects:', error);
    return [];
  }
}

export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug);
}

// --- DEADLINES ---
export async function getDeadlines(): Promise<Deadline[]> {
  try {
    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    return JSON.parse(data) as Deadline[];
  } catch (error) {
    console.error('Error reading deadlines:', error);
    return [];
  }
}

export async function getDeadlineById(id: string): Promise<Deadline | undefined> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id);
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function saveDeadlines(deadlines: Deadline[]): Promise<void> {
  await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');
}

export async function addDeadline(
  payload: Omit<Deadline, 'id' | 'createdAt' | 'completedBy'>
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  
  // Tạo ID mới (max id + 1)
  const maxId = deadlines.reduce((max, d) => Math.max(max, parseInt(d.id, 10) || 0), 0);
  const newId = (maxId + 1).toString();

  const newDeadline: Deadline = {
    ...payload,
    id: newId,
    completedBy: [],
    createdAt: new Date().toISOString(),
  };

  deadlines.unshift(newDeadline);
  await saveDeadlines(deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const initialLength = deadlines.length;
  const filtered = deadlines.filter((d) => d.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await saveDeadlines(filtered);
  return true;
}

export async function toggleCompleteDeadline(
  id: string,
  userId: string
): Promise<{ success: boolean; completed: boolean }> {
  const deadlines = await getDeadlines();
  const deadline = deadlines.find((d) => d.id === id);

  if (!deadline) {
    return { success: false, completed: false };
  }

  const isCompleted = deadline.completedBy.includes(userId);
  if (isCompleted) {
    deadline.completedBy = deadline.completedBy.filter((uid) => uid !== userId);
  } else {
    deadline.completedBy.push(userId);
  }

  await saveDeadlines(deadlines);
  return { success: true, completed: !isCompleted };
}

// --- USERS ---
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
