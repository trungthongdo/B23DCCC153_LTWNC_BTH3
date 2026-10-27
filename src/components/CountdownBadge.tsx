'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
  isCompleted?: boolean;
}

export default function CountdownBadge({ dueDate, isCompleted = false }: CountdownBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const [timeText, setTimeText] = useState<string>('');
  const [status, setStatus] = useState<'completed' | 'urgent' | 'warning' | 'normal' | 'overdue'>('normal');

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      if (isCompleted) {
        setTimeText('Đã xong');
        setStatus('completed');
        return;
      }

      const due = new Date(dueDate).getTime();
      const now = Date.now();
      const diff = due - now;

      if (diff <= 0) {
        const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        const overdueHours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (overdueDays === 0) {
          setTimeText(`Quá hạn ${overdueHours}h`);
        } else {
          setTimeText(`Quá hạn ${overdueDays} ngày`);
        }
        setStatus('overdue');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days === 0) {
          setTimeText(`Còn ${hours} giờ`);
          setStatus('urgent');
        } else if (days <= 2) {
          setTimeText(`Còn ${days}d ${hours}h`);
          setStatus('urgent');
        } else if (days <= 6) {
          setTimeText(`Còn ${days} ngày`);
          setStatus('warning');
        } else {
          setTimeText(`Còn ${days} ngày`);
          setStatus('normal');
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  if (!mounted) {
    return (
      <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
        <Clock size={11} />
        <span>Đang tính...</span>
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span className="badge badge-success">
        <Check size={11} />
        <span>Đã xong</span>
      </span>
    );
  }

  if (status === 'overdue') {
    return (
      <span className="badge badge-danger">
        <Clock size={11} />
        <span>{timeText}</span>
      </span>
    );
  }

  if (status === 'urgent') {
    return (
      <span className="badge badge-danger">
        <Clock size={11} />
        <span>{timeText}</span>
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span className="badge badge-warning">
        <Clock size={11} />
        <span>{timeText}</span>
      </span>
    );
  }

  return (
    <span className="badge badge-neutral">
      <Clock size={11} />
      <span>{timeText}</span>
    </span>
  );
}
