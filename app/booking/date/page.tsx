'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import CardLogo from '../../../components/CardLogo';

const MAX_DESKS = 25;
const MAX_GUESTS = 10;

export default function BookingDatePage() {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [guestCount, setGuestCount] = useState('1');
  const [isOfficeFull, setIsOfficeFull] = useState(false);
  const [availableDesksCount, setAvailableDesksCount] = useState<number | null>(
    null
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push('/');
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const maxSelectableGuests = useMemo(() => {
    if (availableDesksCount === null) return MAX_GUESTS;
    return Math.max(0, Math.min(MAX_GUESTS, availableDesksCount));
  }, [availableDesksCount]);

  useEffect(() => {
    if (maxSelectableGuests <= 0) {
      setGuestCount('1');
      return;
    }

    setGuestCount((prev) => {
      const current = Number(prev);
      if (current > maxSelectableGuests) {
        return String(maxSelectableGuests);
      }
      return prev;
    });
  }, [maxSelectableGuests]);

  const updateMessages = (hasBooking: boolean, availableCount: number) => {
    setAvailabilityMessage(`Postazioni disponibili ${availableCount}/${MAX_DESKS}`);
    setStatusMessage(
      availableCount === 0
        ? 'Sede al completo'
        : hasBooking
        ? 'Hai già una prenotazione'
        : ''
    );
  };

  const checkOfficeCapacity = async (date: string, currentHasBooking = false) => {
    if (!date) {
      setIsOfficeFull(false);
      setAvailableDesksCount(null);
      setAvailabilityMessage('');
      setStatusMessage('');
      return;
    }

    const { count: bookedDesks, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('booking_date', date);

    if (bookingsError) {
      setAvailabilityMessage('');
      setStatusMessage('Errore nel controllo della disponibilità della sede.');
      setIsOfficeFull(false);
      setAvailableDesksCount(null);
      return;
    }

    const bookedCount = typeof bookedDesks === 'number' ? bookedDesks : 0;
    const availableCount = Math.max(MAX_DESKS - bookedCount, 0);
    const officeFull = availableCount === 0;

    setAvailableDesksCount(availableCount);
    setIsOfficeFull(officeFull);
    updateMessages(currentHasBooking, availableCount);
  };

  const checkExistingBooking = async (date: string, currentUserId: string) => {
    if (!date || !currentUserId) return;

    setAvailabilityMessage('');
    setStatusMessage('');
    setHasExistingBooking(false);
    setShowGuestOptions(false);
    setIsOfficeFull(false);
    setAvailableDesksCount(null);

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('booking_date', date)
      .eq('is_guest', false)
      .limit(1);

    if (error) {
      setStatusMessage('Errore nel controllo delle prenotazioni.');
      return;
    }

    const hasBooking = !!(data && data.length > 0);
    setHasExistingBooking(hasBooking);

    await checkOfficeCapacity(date, hasBooking);
  };

  const handleDateChange = async (value: string) => {
    setSelectedDate(value);
    setGuestCount('1');
    setShowGuestOptions(false);
    await checkExistingBooking(value, userId);
  };

  const handleContinue = () => {
    if (!selectedDate) {
      setStatusMessage('Seleziona un giorno per continuare.');
      return;
    }

    if (isOfficeFull) {
      setStatusMessage('Sede al completo');
      return;
    }

    if (hasExistingBooking) {
      setStatusMessage('Hai già una prenotazione');
      return;
    }

    router.push(`/booking/desk?date=${selectedDate}`);
  };

  const handleGuestContinue = () => {
    if (!selectedDate) {
      setStatusMessage('Seleziona un giorno per continuare.');
      return;
    }

    if (isOfficeFull) {
      setStatusMessage('Sede al completo');
      return;
    }

    if (maxSelectableGuests <= 0) {
      setStatusMessage('Sede al completo');
      return;
    }

    if (Number(guestCount) > maxSelectableGuests) {
      setStatusMessage(
        `Puoi selezionare al massimo ${maxSelectableGuests} ospiti per il giorno scelto.`
      );
      return;
    }

    router.push(`/booking/desk?date=${selectedDate}&guestCount=${guestCount}`);
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.text}>Caricamento...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <img src="/logo.png" alt="Logo" style={styles.smallLogo} />
        </div>

        <h1 style={styles.title}>Seleziona il giorno</h1>

        <div style={styles.formGroup}>
          <label style={styles.label}>Giorno</label>
          <input
            style={styles.input}
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        {statusMessage === 'Hai già una prenotazione' && (
          <p style={styles.message}>{statusMessage}</p>
        )}

        {availabilityMessage && (
          <p style={styles.availabilityMessage}>{availabilityMessage}</p>
        )}

        {statusMessage === 'Sede al completo' && (
          <p style={styles.fullMessage}>{statusMessage}</p>
        )}

        {statusMessage &&
          statusMessage !== 'Hai già una prenotazione' &&
          statusMessage !== 'Sede al completo' && (
            <p style={styles.message}>{statusMessage}</p>
          )}

        {!hasExistingBooking && (
          <button
            style={
              isOfficeFull
                ? { ...styles.primaryButton, ...styles.disabledButton }
                : styles.primaryButton
            }
            onClick={handleContinue}
            disabled={isOfficeFull}
          >
            Continua
          </button>
        )}

        {hasExistingBooking && !isOfficeFull && (
          <>
            {!showGuestOptions && (
              <button
                style={styles.guestButton}
                onClick={() => setShowGuestOptions(true)}
              >
                Aggiungi ospite
              </button>
            )}

            {showGuestOptions && (
              <div style={styles.guestBox}>
                <label style={styles.label}>Numero ospiti</label>
                <select
                  style={styles.input}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                >
                  {Array.from({ length: maxSelectableGuests }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <button
                  style={styles.primaryButton}
                  onClick={handleGuestContinue}
                  disabled={maxSelectableGuests === 0}
                >
                  Continua con ospiti
                </button>
              </div>
            )}
          </>
        )}

        <button
          style={styles.secondaryButton}
          onClick={() => router.push('/dashboard')}
        >
          Torna alla dashboard
        </button>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'clamp(12px, 4vw, 24px)',
    backgroundColor: '#f4f6f8',
    boxSizing: 'border-box',
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: 'clamp(14px, 4vw, 16px)',
    padding: 'clamp(16px, 4.5vw, 24px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 3.5vw, 16px)',
    boxSizing: 'border-box',
  },

  title: {
    margin: 0,
    textAlign: 'center',
    fontSize: 'clamp(20px, 5.5vw, 24px)',
    lineHeight: 1.3,
    wordBreak: 'break-word',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },

  label: {
    fontSize: 'clamp(13px, 3.6vw, 14px)',
    fontWeight: 600,
    lineHeight: 1.3,
  },

  input: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #cfd6dd',
    fontSize: '16px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
  },

  primaryButton: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },

  disabledButton: {
    backgroundColor: '#9e9e9e',
    cursor: 'not-allowed',
  },

  guestButton: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f4b400',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },

  secondaryButton: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #0070f3',
    backgroundColor: '#fff',
    color: '#0070f3',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },

  guestBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: 'clamp(12px, 3.5vw, 14px)',
    borderRadius: '12px',
    backgroundColor: '#fff8e1',
    border: '1px solid #f4d06f',
    width: '100%',
    boxSizing: 'border-box',
  },

  text: {
    margin: 0,
    textAlign: 'center',
    fontSize: 'clamp(14px, 4vw, 16px)',
    lineHeight: 1.4,
  },

  smallLogo: {
    width: '200px',
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },

  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  availabilityMessage: {
    margin: 0,
    textAlign: 'center',
    fontSize: 'clamp(13px, 3.8vw, 14px)',
    color: '#000000',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },

  message: {
    margin: 0,
    textAlign: 'center',
    fontSize: 'clamp(13px, 3.8vw, 14px)',
    color: '#000000',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },

  fullMessage: {
    margin: 0,
    textAlign: 'center',
    fontSize: 'clamp(13px, 3.8vw, 14px)',
    color: '#ff0000',
    fontWeight: 700,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
};
