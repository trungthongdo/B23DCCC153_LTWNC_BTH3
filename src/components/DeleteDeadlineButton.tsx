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
        className="btn btn-danger"
        style={{ padding: '6px 10px', fontSize: '0.785rem' }}
        title="Xoá deadline này"
      >
        <Trash2 size={13} />
        <span>Xoá</span>
      </button>

      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Xác Nhận Xoá Deadline</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xoá deadline <strong>"{deadlineTitle}"</strong> (ID: #{deadlineId})? Hành động này sẽ xoá vĩnh viễn khỏi hệ thống lớp và không thể hoàn tác.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="btn btn-secondary"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                id={`confirm-delete-${deadlineId}`}
                onClick={handleDelete}
                disabled={isPending}
                className="btn btn-ptit"
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Đang xoá...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Xoá Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
