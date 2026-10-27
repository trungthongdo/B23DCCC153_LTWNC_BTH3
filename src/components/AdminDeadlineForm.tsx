'use client';

import React, { useState, useTransition } from 'react';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createDeadlineAction } from '@/lib/actions';
import { Subject, Priority, DeadlineType } from '@/types';

interface AdminDeadlineFormProps {
  subjects: Subject[];
}

export default function AdminDeadlineForm({ subjects }: AdminDeadlineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [title, setTitle] = useState('');
  const [subjectSlug, setSubjectSlug] = useState(subjects[0]?.slug || '');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [type, setType] = useState<DeadlineType>('assignment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Tiêu đề phải có tối thiểu 3 ký tự.');
      return;
    }

    if (!dueDate) {
      setErrorMsg('Vui lòng chọn hạn nộp.');
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setErrorMsg('Mô tả phải có tối thiểu 5 ký tự.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('subjectSlug', subjectSlug);
    formData.append('dueDate', dueDate);
    formData.append('description', description.trim());
    formData.append('priority', priority);
    formData.append('type', type);

    startTransition(async () => {
      const res = await createDeadlineAction(formData);
      if (res.success) {
        setSuccessMsg(`Đã tạo thành công deadline: "${title}"! Dữ liệu đã được làm mới tức thì.`);
        setTitle('');
        setDueDate('');
        setDescription('');
      } else {
        setErrorMsg(res.error || 'Có lỗi xảy ra khi tạo deadline.');
      }
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '28px',
        borderLeft: '4px solid var(--ptit-red)',
        marginBottom: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PlusCircle size={20} style={{ color: 'var(--ptit-red)' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Thêm Deadline Mới Cho Lớp (Chỉ Lớp Trưởng)
        </h2>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#a7f3d0',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Title */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="new-deadline-title">
              Tiêu đề Deadline *
            </label>
            <input
              id="new-deadline-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bài tập lớn 3: Xây dựng Class Deadline Hub"
              className="form-input"
            />
          </div>

          {/* Subject */}
          <div className="form-group">
            <label className="form-label" htmlFor="new-deadline-subject">
              Môn học *
            </label>
            <select
              id="new-deadline-subject"
              required
              value={subjectSlug}
              onChange={(e) => setSubjectSlug(e.target.value)}
              className="form-select"
            >
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div className="form-group">
            <label className="form-label" htmlFor="new-deadline-date">
              Hạn nộp chính xác *
            </label>
            <input
              id="new-deadline-date"
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Type */}
          <div className="form-group">
            <label className="form-label" htmlFor="new-deadline-type">
              Phân loại bài tập *
            </label>
            <select
              id="new-deadline-type"
              value={type}
              onChange={(e) => setType(e.target.value as DeadlineType)}
              className="form-select"
            >
              <option value="assignment">Bài tập tuần</option>
              <option value="project">Đồ án lớn</option>
              <option value="quiz">Trắc nghiệm online</option>
              <option value="exam">Thi / Kiểm tra</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label" htmlFor="new-deadline-priority">
              Mức độ ưu tiên *
            </label>
            <select
              id="new-deadline-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="form-select"
            >
              <option value="high">Cao (Gấp)</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="new-deadline-desc">
              Yêu cầu và mô tả chi tiết *
            </label>
            <textarea
              id="new-deadline-desc"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu rõ hình thức nộp (PDF/Git), các yêu cầu cần đạt..."
              className="form-textarea"
            />
          </div>
        </div>

        <button
          type="submit"
          id="admin-create-submit-btn"
          disabled={isPending}
          className="btn btn-ptit"
          style={{ marginTop: '12px', minWidth: '180px' }}
        >
          {isPending ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Đang lưu deadline...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Tạo & Đăng Deadline</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
