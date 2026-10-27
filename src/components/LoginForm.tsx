'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Shield, User } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi kết nối, vui lòng thử lại.');
      setLoading(false);
    }
  };

  const fillQuickAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  return (
    <div
      className="saas-card"
      style={{
        maxWidth: '400px',
        width: '100%',
        padding: '28px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          Đăng nhập hệ thống
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Dành cho sinh viên và ban cán sự lớp PTIT
        </p>
      </div>

      {error && (
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
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">
            Email PTIT
          </label>
          <input
            id="email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sv@ptit.edu.vn"
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password-input">
            Mật khẩu
          </label>
          <input
            id="password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        <button
          type="submit"
          id="login-submit-btn"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '9px', marginTop: '6px' }}
        >
          {loading ? (
            <span>Đang xác thực...</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Đăng nhập</span>
              <ArrowRight size={14} />
            </div>
          )}
        </button>
      </form>

      {/* Quick Select Demo Accounts */}
      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'block',
            textAlign: 'center',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Tài khoản kiểm thử nhanh
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            id="fill-admin-btn"
            onClick={() => fillQuickAccount('admin@ptit.edu.vn', 'admin123')}
            className="btn btn-secondary"
            style={{ padding: '6px 8px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
          >
            <Shield size={12} style={{ color: 'var(--ptit-red)' }} />
            <span>Lớp trưởng</span>
          </button>

          <button
            type="button"
            id="fill-student-btn"
            onClick={() => fillQuickAccount('sv@ptit.edu.vn', 'sv123456')}
            className="btn btn-secondary"
            style={{ padding: '6px 8px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
          >
            <User size={12} style={{ color: 'var(--primary)' }} />
            <span>Sinh viên</span>
          </button>
        </div>
      </div>

      {/* GitHub OAuth Button */}
      <div style={{ marginTop: '12px' }}>
        <button
          type="button"
          id="github-login-btn"
          onClick={() => signIn('github', { callbackUrl })}
          className="btn btn-ghost"
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '0.8125rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>Đăng nhập GitHub (OAuth)</span>
        </button>
      </div>
    </div>
  );
}
