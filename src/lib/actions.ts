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

/**
 * Server Action: Đánh dấu hoàn thành / chưa hoàn thành deadline
 * Yêu cầu quyền: 'toggle_complete' (user hoặc admin)
 */
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

    // Làm mới dữ liệu ở các trang liên quan
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

/**
 * Server Action: Thêm deadline mới (chỉ admin)
 * Yêu cầu quyền: 'create_deadline' (chỉ admin)
 * Tự động revalidate on-demand để /deadlines và /deadlines/[id] cập nhật ngay lập tức
 */
export async function createDeadlineAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: 'Yêu cầu đăng nhập.' };
    }

    // Kiểm tra quyền chặt chẽ thông qua can()
    if (!can(session.user.role, 'create_deadline')) {
      return { success: false, error: 'Từ chối quyền: Chỉ Lớp trưởng (Admin) mới có quyền thêm deadline.' };
    }

    // Lấy dữ liệu và validate đầu vào
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
      return { success: false, error: 'Môn học không tồn tại trong hệ thống.' };
    }

    if (!dueDate) {
      return { success: false, error: 'Vui lòng chọn hạn chót.' };
    }

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return { success: false, error: 'Hạn chót không hợp lệ.' };
    }

    if (!description || description.length < 5) {
      return { success: false, error: 'Mô tả chi tiết phải có ít nhất 5 ký tự.' };
    }

    const validPriorities: Priority[] = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
      return { success: false, error: 'Mức độ ưu tiên không hợp lệ.' };
    }

    const validTypes: DeadlineType[] = ['assignment', 'project', 'quiz', 'exam'];
    if (!validTypes.includes(type)) {
      return { success: false, error: 'Phân loại bài tập không hợp lệ.' };
    }

    const newDeadline = await addDeadline({
      title,
      subjectSlug,
      subjectName: subject.name,
      description,
      dueDate: parsedDate.toISOString(),
      priority,
      type,
      createdBy: session.user.email || 'admin@ptit.edu.vn',
    });

    // Revalidate ngay lập tức toàn bộ các trang (ISR on-demand revalidation)
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

/**
 * Server Action: Xoá deadline (chỉ admin)
 * Yêu cầu quyền: 'delete_deadline' (chỉ admin)
 * Revalidate on-demand ngay lập tức
 */
export async function deleteDeadlineAction(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: 'Yêu cầu đăng nhập.' };
    }

    // Kiểm tra quyền chặt chẽ thông qua can()
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

    // Revalidate on-demand ngay lập tức
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
