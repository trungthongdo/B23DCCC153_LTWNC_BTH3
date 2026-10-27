'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Filter, ArrowUpDown, Calendar, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { Deadline, Subject } from '@/types';
import DeadlineCard from './DeadlineCard';

interface DeadlinesFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  currentUserId?: string;
  defaultSubjectSlug?: string;
}

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

  const filteredDeadlines = useMemo(() => {
    const now = Date.now();

    return initialDeadlines
      .filter((d) => {
        // 1. Search keyword
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(term);
          const matchDesc = d.description.toLowerCase().includes(term);
          const matchSub = d.subjectName.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc && !matchSub) return false;
        }

        // 2. Subject filter
        if (selectedSubject !== 'all' && d.subjectSlug !== selectedSubject) {
          return false;
        }

        // 3. Status filter
        const isDone = currentUserId ? d.completedBy.includes(currentUserId) : false;
        const isPast = new Date(d.dueDate).getTime() < now;

        if (selectedStatus === 'completed') {
          return isDone;
        }
        if (selectedStatus === 'overdue') {
          return isPast && !isDone;
        }
        if (selectedStatus === 'pending') {
          return !isDone && !isPast;
        }

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
      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              flex: '1 1 260px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              id="search-deadline-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm deadline, môn học..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Subject Dropdown */}
          <div style={{ flex: '1 1 200px' }}>
            <select
              id="filter-subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-select"
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
          <div style={{ flex: '0 1 180px' }}>
            <select
              id="sort-deadline-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-select"
            >
              <option value="due-asc">Hạn chót: Gần nhất</option>
              <option value="due-desc">Hạn chót: Xa nhất</option>
              <option value="priority-high">Độ ưu tiên cao nhất</option>
            </select>
          </div>
        </div>

        {/* Quick Status Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '14px',
          }}
        >
          <span
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginRight: '6px',
            }}
          >
            <Filter size={14} /> Bộ lọc:
          </span>

          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`btn ${selectedStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            Tất cả ({initialDeadlines.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('pending')}
            className={`btn ${selectedStatus === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            Chưa hoàn thành
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('completed')}
            className={`btn ${selectedStatus === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            Đã hoàn thành
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('overdue')}
            className={`btn ${selectedStatus === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            Quá hạn
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Hiển thị <strong>{filteredDeadlines.length}</strong> deadline phù hợp
        </span>
      </div>

      {/* Deadlines Grid */}
      {filteredDeadlines.length > 0 ? (
        <div className="grid-cards">
          {filteredDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Layers size={40} style={{ color: 'var(--text-muted)' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Không tìm thấy deadline nào</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px' }}>
            Không có deadline nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setSelectedStatus('all');
            }}
            className="btn btn-secondary"
            style={{ marginTop: '8px' }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
