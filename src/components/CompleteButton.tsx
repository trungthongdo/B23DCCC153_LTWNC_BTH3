'use client';

import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { toggleCompleteAction } from '@/lib/actions';
import { can } from '@/lib/permissions';

interface CompleteButtonProps {
  deadlineId: string;
  initialCompleted?: boolean;
  completedBy?: string[];
  size?: 'sm' | 'md';
}

export default function CompleteButton({
  deadlineId,
  initialCompleted = false,
  completedBy,
  size = 'md',
}: CompleteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const userCompleted = session?.user?.id && completedBy
    ? completedBy.includes(session.user.id)
    : initialCompleted;

  const [completed, setCompleted] = useState(userCompleted);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (session?.user?.id && completedBy) {
      setCompleted(completedBy.includes(session.user.id));
    }
  }, [session, completedBy]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session || !session.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!can(session.user.role, 'toggle_complete')) {
      alert('Chỉ sinh viên hoặc lớp trưởng đã đăng nhập mới có quyền đánh dấu hoàn thành.');
      return;
    }

    const nextState = !completed;
    setCompleted(nextState);

    startTransition(async () => {
      const res = await toggleCompleteAction(deadlineId);
      if (!res.success) {
        setCompleted(!nextState);
        alert(res.error || 'Có lỗi xảy ra khi cập nhật.');
      }
    });
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      type="button"
      title={
        !session
          ? 'Đăng nhập để đánh dấu hoàn thành'
          : completed
          ? 'Đánh dấu chưa xong'
          : 'Đánh dấu đã hoàn thành'
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: isSmall ? '3px 8px' : '5px 12px',
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.15s ease',
        cursor: isPending ? 'wait' : 'pointer',
        backgroundColor: completed ? 'var(--success-surface)' : 'var(--bg-surface)',
        color: completed ? 'var(--success-text)' : 'var(--text-secondary)',
        border: `1px solid ${completed ? 'var(--success-border)' : 'var(--border-color)'}`,
      }}
    >
      {isPending ? (
        <Loader2 size={isSmall ? 12 : 14} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <Check
          size={isSmall ? 12 : 14}
          style={{
            color: completed ? 'var(--success)' : 'var(--text-subtle)',
            strokeWidth: completed ? 2.5 : 2,
          }}
        />
      )}
      <span>{completed ? 'Đã xong' : 'Chưa xong'}</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
