'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import {
  addDeadline,
  deleteDeadline,
  toggleCompleteDeadline,
  getSubjectBySlug,
  getDeadlineById,
} from '@/lib/data';
import { Priority, DeadlineType } from '@/types';

export async function toggleCompleteAction(deadlineId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: 'Bạn phải đăng nhập để thực hiện hành động này.' };
    }

    if (!can(session.user.role, 'toggle_complete')) {
      return { success: false, error: 'Bạn không có quyền đánh dấu deadline này.' };
    }

    const result = await toggleCompleteDeadline(deadlineId, session.user.id);

    if (!result.success) {
      return { success: false, error: 'Không tìm thấy deadline.' };
    }

    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${deadlineId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/completed');

    return { success: true, completed: result.completed };
  } catch (error) {
    console.error('Error in toggleCompleteAction:', error);
    return { success: false, error: 'Đã xảy ra lỗi máy chủ.' };
  }
}

export async function createDeadlineAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: 'Yêu cầu đăng nhập.' };
    }

    if (!can(session.user.role, 'create_deadline')) {
      return { success: false, error: 'Từ chối quyền: Chỉ Lớp trưởng (Admin) mới có quyền thêm deadline.' };
    }

    const title = formData.get('title')?.toString().trim();
    const subjectSlug = formData.get('subjectSlug')?.toString().trim();
    const dueDate = formData.get('dueDate')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const priority = formData.get('priority')?.toString().trim() as Priority;
    const type = formData.get('type')?.toString().trim() as DeadlineType;

    if (!title || title.length < 3) {
      return { success: false, error: 'Tiêu đề deadline phải có ít nhất 3 ký tự.' };
    }

    if (!subjectSlug) {
      return { success: false, error: 'Vui lòng chọn môn học hợp lệ.' };
    }

    const subject = await getSubjectBySlug(subjectSlug);
    if (!subject) {
      return { success: false, error: 'Môn học không tồn tại trên hệ thống.' };
    }

    if (!dueDate) {
      return { success: false, error: 'Vui lòng chọn hạn chót nộp bài.' };
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return { success: false, error: 'Định dạng ngày hạn chót không hợp lệ.' };
    }

    const validPriorities: Priority[] = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return { success: false, error: 'Mức độ ưu tiên không hợp lệ.' };
    }

    const validTypes: DeadlineType[] = ['assignment', 'quiz', 'project', 'exam'];
    if (!validTypes.includes(type)) {
      return { success: false, error: 'Loại bài tập không hợp lệ.' };
    }

    const newDeadline = await addDeadline({
      title,
      subjectSlug,
      subjectName: subject.name,
      description: description || 'Không có mô tả chi tiết.',
      dueDate: parsedDueDate.toISOString(),
      priority,
      type,
      createdBy: session.user.email || 'admin@ptit.edu.vn',
    });

    revalidatePath('/');
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath(`/subjects/${subjectSlug}`);
    revalidatePath('/admin');
    revalidatePath('/dashboard');

    return { success: true, deadline: newDeadline };
  } catch (error) {
    console.error('Error in createDeadlineAction:', error);
    return { success: false, error: 'Đã có lỗi xảy ra khi tạo deadline.' };
  }
}

export async function deleteDeadlineAction(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: 'Yêu cầu đăng nhập.' };
    }

    if (!can(session.user.role, 'delete_deadline')) {
      return { success: false, error: 'Từ chối quyền: Chỉ Lớp trưởng (Admin) mới có quyền xoá deadline.' };
    }

    const target = await getDeadlineById(id);
    if (!target) {
      return { success: false, error: 'Deadline không tồn tại hoặc đã bị xoá.' };
    }

    const deleted = await deleteDeadline(id);
    if (!deleted) {
      return { success: false, error: 'Không thể xoá deadline.' };
    }

    revalidatePath('/');
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${id}`);
    if (target.subjectSlug) {
      revalidatePath(`/subjects/${target.subjectSlug}`);
    }
    revalidatePath('/admin');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteDeadlineAction:', error);
    return { success: false, error: 'Đã có lỗi xảy ra khi xoá deadline.' };
  }
}
