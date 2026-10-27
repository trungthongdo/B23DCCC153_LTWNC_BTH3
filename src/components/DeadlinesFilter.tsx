'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, ChevronRight, LayoutGrid, List, Calendar } from 'lucide-react';
import { Deadline, Subject } from '@/types';
import DeadlineCard from './DeadlineCard';
import CompleteButton from './CompleteButton';
import CountdownBadge from './CountdownBadge';

interface DeadlinesFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  currentUserId?: string;
  defaultSubjectSlug?: string;
}

const TYPE_LABELS: Record<string, string> = {
  assignment: 'Bài tập',
  project: 'Đồ án',
  quiz: 'Trắc nghiệm',
  exam: 'Thi',
};

export default function DeadlinesFilter({
  initialDeadlines,
  subjects,
  currentUserId: propUserId,
  defaultSubjectSlug,
}: DeadlinesFilterProps) {
  const { data: session } = useSession();
  const currentUserId = propUserId || session?.user?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectSlug || 'all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'due-asc' | 'due-desc' | 'priority-high'>('due-asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredDeadlines = useMemo(() => {
    const now = Date.now();

    return initialDeadlines
      .filter((d) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(term);
          const matchDesc = d.description.toLowerCase().includes(term);
          const matchSub = d.subjectName.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc && !matchSub) return false;
        }

        if (selectedSubject !== 'all' && d.subjectSlug !== selectedSubject) {
          return false;
        }

        const isDone = currentUserId ? d.completedBy.includes(currentUserId) : false;
        const isPast = new Date(d.dueDate).getTime() < now;

        if (selectedStatus === 'completed') return isDone;
        if (selectedStatus === 'overdue') return isPast && !isDone;
        if (selectedStatus === 'pending') return !isDone && !isPast;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-asc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'due-desc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === 'priority-high') {
          const pRank = { high: 3, medium: 2, low: 1 };
          return pRank[b.priority] - pRank[a.priority];
        }
        return 0;
      });
  }, [initialDeadlines, searchTerm, selectedSubject, selectedStatus, sortBy, currentUserId]);

  return (
    <div>
      {/* Compact SaaS Filter Bar */}
      <div
        className="saas-card"
        style={{
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Controls row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)',
              }}
            />
            <input
              type="text"
              id="search-deadline-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm deadline, môn học..."
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Subject Dropdown */}
          <div style={{ flex: '0 1 220px' }}>
            <select
              id="filter-subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8125rem' }}
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ flex: '0 1 170px' }}>
            <select
              id="sort-deadline-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-select"
              style={{ fontSize: '0.8125rem' }}
            >
              <option value="due-asc">Hạn chót: Gần nhất</option>
              <option value="due-desc">Hạn chót: Xa nhất</option>
              <option value="priority-high">Độ ưu tiên cao</option>
            </select>
          </div>

          {/* View mode toggle (List / Grid) */}
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              marginLeft: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 9px',
                backgroundColor: viewMode === 'list' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                color: viewMode === 'list' ? 'var(--text-main)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Xem dạng danh sách"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 9px',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                borderLeft: '1px solid var(--border-color)',
              }}
              title="Xem dạng thẻ"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Status filter tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            Trạng thái:
          </span>

          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            style={{
              padding: '3px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500,
              backgroundColor: selectedStatus === 'all' ? 'var(--btn-dark-bg)' : 'transparent',
              color: selectedStatus === 'all' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            Tất cả ({initialDeadlines.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('pending')}
            style={{
              padding: '3px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500,
              backgroundColor: selectedStatus === 'pending' ? 'var(--btn-dark-bg)' : 'transparent',
              color: selectedStatus === 'pending' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            Chưa hoàn thành
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('completed')}
            style={{
              padding: '3px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500,
              backgroundColor: selectedStatus === 'completed' ? 'var(--btn-dark-bg)' : 'transparent',
              color: selectedStatus === 'completed' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            Đã hoàn thành
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('overdue')}
            style={{
              padding: '3px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 500,
              backgroundColor: selectedStatus === 'overdue' ? 'var(--btn-dark-bg)' : 'transparent',
              color: selectedStatus === 'overdue' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            Quá hạn
          </button>

          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {filteredDeadlines.length} kết quả
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredDeadlines.length > 0 ? (
        viewMode === 'list' ? (
          /* SaaS Task List View (Clean & Compact) */
          <div className="saas-card" style={{ overflowX: 'auto' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Trạng thái</th>
                  <th>Tiêu đề Deadline</th>
                  <th style={{ width: '190px' }}>Môn học</th>
                  <th style={{ width: '160px' }}>Hạn chót</th>
                  <th style={{ width: '140px' }}>Thời gian</th>
                  <th style={{ width: '80px', textAlign: 'right' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeadlines.map((deadline) => {
                  const isDone = currentUserId ? deadline.completedBy.includes(currentUserId) : false;
                  const dateObj = new Date(deadline.dueDate);
                  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(dateObj);

                  return (
                    <tr key={deadline.id}>
                      <td>
                        <CompleteButton
                          deadlineId={deadline.id}
                          initialCompleted={isDone}
                          size="sm"
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            href={`/deadlines/${deadline.id}`}
                            style={{
                              fontWeight: 600,
                              color: 'var(--text-main)',
                              textDecoration: isDone ? 'line-through' : 'none',
                              opacity: isDone ? 0.75 : 1,
                            }}
                          >
                            {deadline.title}
                          </Link>
                          {deadline.priority === 'high' && (
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                              Gấp
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {TYPE_LABELS[deadline.type] || 'Bài tập'}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/subjects/${deadline.subjectSlug}`}
                          className="badge badge-blue"
                          style={{ textDecoration: 'none' }}
                        >
                          {deadline.subjectName}
                        </Link>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {formattedDate}
                        </span>
                      </td>
                      <td>
                        <CountdownBadge dueDate={deadline.dueDate} isCompleted={isDone} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/deadlines/${deadline.id}`}
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div
          className="saas-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
            Không tìm thấy deadline phù hợp
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', maxWidth: '360px' }}>
            Không có kết quả nào cho bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setSelectedStatus('all');
            }}
            className="btn btn-secondary"
            style={{ marginTop: '10px', fontSize: '0.8125rem' }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
