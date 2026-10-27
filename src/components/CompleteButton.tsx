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

    // Optimistic UI
    const nextState = !completed;
    setCompleted(nextState);

    startTransition(async () => {
      const res = await toggleCompleteAction(deadlineId);
      if (!res.success) {
        // Rollback
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
        gap: '6px',
        padding: isSmall ? '4px 10px' : '7px 14px',
        fontSize: isSmall ? '0.785rem' : '0.875rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        transition: 'all 0.2s ease',
        cursor: isPending ? 'wait' : 'pointer',
        background: completed
          ? 'rgba(16, 185, 129, 0.18)'
          : 'rgba(255, 255, 255, 0.06)',
        color: completed ? '#6ee7b7' : 'var(--text-secondary)',
        border: `1px solid ${
          completed ? 'rgba(16, 185, 129, 0.45)' : 'var(--border-subtle)'
        }`,
      }}
    >
      {isPending ? (
        <Loader2 size={isSmall ? 13 : 15} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <Check
          size={isSmall ? 13 : 15}
          style={{
            strokeWidth: completed ? 3 : 2,
            color: completed ? '#10b981' : 'var(--text-muted)',
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
