'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { supabase } from '../lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setMessage('');

    if (!email || !password) {
      setMessage('Inserisci email e password.');

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,

      password,
    });

    if (error) {
      setMessage('Errore login: ' + error.message);
    } else {
      setMessage('Login riuscito!');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setMessage('Logout effettuato.');
  };

  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>NTT Salerno prenotazione postazioni</h1>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              style={styles.passwordInput}
              type={showPassword ? 'text' : 'password'}
              placeholder="Inserisci la tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            ></button>
          </div>
        </div>

        <button style={styles.primaryButton} onClick={handleLogin}>
          Login
        </button>

        <Link href="/register" style={styles.secondaryButton}>
          Registrati
        </Link>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    padding: '20px',

    backgroundColor: '#f4f6f8',
  },

  card: {
    width: '100%',

    maxWidth: '420px',

    backgroundColor: '#ffffff',

    borderRadius: '16px',

    padding: '24px',

    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',

    display: 'flex',

    flexDirection: 'column',

    gap: '16px',
  },

  title: {
    margin: 0,

    textAlign: 'center',

    fontSize: '24px',

    lineHeight: 1.3,
  },

  subtitle: {
    margin: 0,

    textAlign: 'center',

    fontSize: '20px',
  },

  text: {
    margin: 0,

    textAlign: 'center',

    wordBreak: 'break-word',
  },

  formGroup: {
    display: 'flex',

    flexDirection: 'column',

    gap: '8px',
  },

  label: {
    fontSize: '14px',

    fontWeight: 600,
  },

  input: {
    width: '100%',

    padding: '12px',

    borderRadius: '10px',

    border: '1px solid #cfd6dd',

    fontSize: '16px',

    boxSizing: 'border-box',
  },

  passwordWrapper: {
    display: 'flex',

    alignItems: 'center',

    border: '1px solid #cfd6dd',

    borderRadius: '10px',

    overflow: 'hidden',

    backgroundColor: '#fff',
  },

  passwordInput: {
    flex: 1,

    padding: '12px',

    border: 'none',

    outline: 'none',

    fontSize: '16px',
  },

  eyeButton: {
    border: 'none',

    background: 'transparent',

    padding: '0 12px',

    cursor: 'pointer',

    fontSize: '18px',
  },

  primaryButton: {
    width: '100%',

    padding: '12px',

    borderRadius: '10px',

    border: 'none',

    backgroundColor: '#0070f3',

    color: '#fff',

    fontSize: '16px',

    cursor: 'pointer',
  },

  secondaryButton: {
    width: '100%',

    padding: '12px',

    borderRadius: '10px',

    border: '1px solid #0070f3',

    color: '#0070f3',

    fontSize: '16px',

    textAlign: 'center',

    textDecoration: 'none',

    boxSizing: 'border-box',
  },

  message: {
    margin: 0,

    textAlign: 'center',

    fontSize: '14px',

    color: '#c62828',
  },
};
