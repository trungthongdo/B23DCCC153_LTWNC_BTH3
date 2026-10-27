'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Loader2, Check, AlertCircle } from 'lucide-react';
import { createDeadlineAction } from '@/lib/actions';
import { Subject, Priority, DeadlineType } from '@/types';

interface AdminDeadlineFormProps {
  subjects: Subject[];
}

export default function AdminDeadlineForm({ subjects }: AdminDeadlineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
        setSuccessMsg(`Đã tạo thành công deadline: "${title}"`);
        setTitle('');
        setDueDate('');
        setDescription('');
      } else {
        setErrorMsg(res.error || 'Có lỗi xảy ra khi tạo deadline.');
      }
    });
  };

  return (
    <div className="saas-card" style={{ padding: '20px', marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isOpen ? '16px' : '0',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
            Thêm Deadline Mới
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Tạo bài tập lớn, bài tập tuần hoặc kỳ thi cho lớp
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`btn ${isOpen ? 'btn-secondary' : 'btn-primary'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <Plus size={14} style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.15s ease' }} />
          <span>{isOpen ? 'Thu gọn' : 'Tạo deadline'}</span>
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          {successMsg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--success-surface)',
                border: '1px solid var(--success-border)',
                color: 'var(--success-text)',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '14px',
              }}
            >
              <Check size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-surface)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '14px',
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* Title */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="new-deadline-title">
                Tiêu đề deadline *
              </label>
              <input
                id="new-deadline-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Bài tập lớn 3: Xây dựng Class Deadline Hub"
                className="form-input"
                style={{ fontSize: '0.8125rem' }}
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
                style={{ fontSize: '0.8125rem' }}
              >
                {subjects.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="new-deadline-date">
                Hạn nộp *
              </label>
              <input
                id="new-deadline-date"
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="new-deadline-type">
                Phân loại *
              </label>
              <select
                id="new-deadline-type"
                value={type}
                onChange={(e) => setType(e.target.value as DeadlineType)}
                className="form-select"
                style={{ fontSize: '0.8125rem' }}
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
                Ưu tiên *
              </label>
              <select
                id="new-deadline-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="form-select"
                style={{ fontSize: '0.8125rem' }}
              >
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="new-deadline-desc">
                Mô tả chi tiết *
              </label>
              <textarea
                id="new-deadline-desc"
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Yêu cầu cần đạt, hình thức nộp..."
                className="form-textarea"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              id="admin-create-submit-btn"
              disabled={isPending}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', padding: '7px 16px' }}
            >
              {isPending ? (
                <>
                  <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Tạo & Đăng deadline</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
