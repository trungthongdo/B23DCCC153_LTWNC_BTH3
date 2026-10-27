'use client';

import React, { useState, useTransition } from 'react';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import { deleteDeadlineAction } from '@/lib/actions';

interface DeleteDeadlineButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function DeleteDeadlineButton({
  deadlineId,
  deadlineTitle,
}: DeleteDeadlineButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteDeadlineAction(deadlineId);
      if (!res.success) {
        alert(res.error || 'Có lỗi xảy ra khi xoá deadline.');
      }
      setShowConfirm(false);
    });
  };

  return (
    <>
      <button
        type="button"
        id={`delete-btn-${deadlineId}`}
        onClick={() => setShowConfirm(true)}
        className="btn btn-ghost"
        style={{
          padding: '4px 8px',
          fontSize: '0.75rem',
          color: 'var(--danger-text)',
        }}
        title="Xoá deadline"
      >
        <Trash2 size={13} />
        <span>Xoá</span>
      </button>

      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="saas-card"
            style={{
              maxWidth: '400px',
              width: '100%',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
              <AlertCircle size={20} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Xác nhận xoá deadline
              </h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xoá deadline <strong>"{deadlineTitle}"</strong>? Thao tác này sẽ xoá vĩnh viễn khỏi hệ thống lớp.
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem' }}
              >
                Huỷ
              </button>
              <button
                type="button"
                id={`confirm-delete-${deadlineId}`}
                onClick={handleDelete}
                disabled={isPending}
                className="btn btn-danger"
                style={{ fontSize: '0.8125rem' }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Đang xoá...</span>
                  </>
                ) : (
                  <span>Xoá vĩnh viễn</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
