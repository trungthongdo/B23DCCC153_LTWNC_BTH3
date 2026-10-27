import fs from 'fs/promises';
import path from 'path';
import { Subject, Deadline, User } from '@/types';
// Import tĩnh để JSON được bundle vào build (Vercel không có sẵn file src/ lúc runtime)
import subjectsSeed from '@/data/subjects.json';
import deadlinesSeed from '@/data/deadlines.json';
import usersSeed from '@/data/users.json';

const IS_VERCEL = !!process.env.VERCEL;
// Trên Vercel filesystem là read-only, chỉ /tmp ghi được (không bền vững giữa các instance)
const DEADLINES_FILE = IS_VERCEL
  ? path.join('/tmp', 'deadlines.json')
  : path.join(process.cwd(), 'src', 'data', 'deadlines.json');

let deadlinesCache: Deadline[] | null = null;

export async function getSubjects(): Promise<Subject[]> {
  return structuredClone(subjectsSeed) as Subject[];
}

export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug);
}

export async function getDeadlines(): Promise<Deadline[]> {
  try {
    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    deadlinesCache = JSON.parse(data) as Deadline[];
  } catch {
    // Chưa có file ghi (lần đầu trên Vercel) hoặc lỗi đọc -> dùng cache / dữ liệu gốc đã bundle
    if (!deadlinesCache) deadlinesCache = structuredClone(deadlinesSeed) as Deadline[];
  }
  return structuredClone(deadlinesCache);
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
  deadlinesCache = structuredClone(deadlines);
  try {
    await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing deadlines (kept in memory):', error);
  }
}

export async function addDeadline(
  payload: Omit<Deadline, 'id' | 'createdAt' | 'completedBy'>
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  
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

export async function getUsers(): Promise<User[]> {
  return structuredClone(usersSeed) as User[];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
