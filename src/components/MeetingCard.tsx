import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Icon } from '@app/components/Icon';
import { Chip } from '@app/components/Chip';
import { useAuth } from '@app/lib/auth';
import { useRole } from '@app/lib/useRole';
import { useMeetingAccess } from '@app/lib/useMeetingAccess';
import { nextOccurrence } from '@app/lib/nextOccurrence';
import { FAMILY_PRAYER } from '@app/data/meeting';

export function MeetingCard() {
  const { user, loading: authLoading } = useAuth();
  const { approved, loading: roleLoading } = useRole();
  const meeting = useMeetingAccess(FAMILY_PRAYER.slug);
  const [showPasscode, setShowPasscode] = useState(false);
  const [copied, setCopied] = useState(false);

  const { label: nextLabel, isLive } = nextOccurrence(FAMILY_PRAYER);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // State: loading
  if (authLoading || roleLoading || meeting.loading) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-6">
        <div className="flex items-center gap-3">
          <Icon name="videocam" className="text-gold" />
          <span className="font-chrome text-label-technical uppercase text-on-surface-variant">Loading meeting info...</span>
        </div>
      </div>
    );
  }

  // State: signed out
  if (!user) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="videocam" className="text-gold" />
          <h3 className="font-chrome text-headline-sm uppercase text-primary">{FAMILY_PRAYER.title}</h3>
        </div>
        <p className="font-narrative text-body-md text-on-surface-variant mb-4">
          Sign in to view meeting details and join the weekly prayer gathering.
        </p>
        <Link
          to={ROUTES.auth}
          className="inline-flex items-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-5 py-3 bg-secondary text-on-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
        >
          Sign In
          <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
    );
  }

  // State: not approved
  if (!approved) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="videocam" className="text-gold" />
          <h3 className="font-chrome text-headline-sm uppercase text-primary">{FAMILY_PRAYER.title}</h3>
        </div>
        <p className="font-narrative text-body-md text-on-surface-variant">
          Your account is pending approval. Once approved, you will see the meeting details here.
        </p>
      </div>
    );
  }

  // State: error
  if (meeting.error) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="videocam" className="text-gold" />
          <h3 className="font-chrome text-headline-sm uppercase text-primary">{FAMILY_PRAYER.title}</h3>
        </div>
        <p className="font-narrative text-body-md text-on-surface-variant">
          We could not load the meeting information. Please try again later.
        </p>
      </div>
    );
  }

  // State: approved but no meeting row configured
  if (!meeting.joinUrl) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="videocam" className="text-gold" />
          <h3 className="font-chrome text-headline-sm uppercase text-primary">{FAMILY_PRAYER.title}</h3>
        </div>
        <div className="flex items-center gap-3 mb-3">
          {isLive && <Chip>Live Now</Chip>}
          <span className="font-chrome text-label-technical uppercase text-on-surface-variant tabular-nums">{nextLabel}</span>
        </div>
        <p className="font-narrative text-body-md text-on-surface-variant">
          Meeting details have not been configured yet.
        </p>
      </div>
    );
  }

  // State: approved with full access
  return (
    <div className="border border-outline-variant bg-surface-container-low p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon name="videocam" className="text-gold" />
        <h3 className="font-chrome text-headline-sm uppercase text-primary">{FAMILY_PRAYER.title}</h3>
        {isLive && <Chip>Live Now</Chip>}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Icon name="schedule" size={18} className="text-on-surface-variant" />
        <span className="font-chrome text-label-technical uppercase text-on-surface-variant tabular-nums">{nextLabel}</span>
      </div>

      {meeting.meetingId && (
        <div className="flex items-center gap-3 mb-3">
          <span className="font-chrome text-[12px] uppercase tracking-[0.1em] text-on-surface-variant w-[80px]">Meeting ID</span>
          <span className="font-narrative text-body-md text-on-surface tabular-nums">{meeting.meetingId}</span>
        </div>
      )}

      {meeting.passcode && (
        <div className="flex items-center gap-3 mb-3">
          <span className="font-chrome text-[12px] uppercase tracking-[0.1em] text-on-surface-variant w-[80px]">Passcode</span>
          <span className="font-narrative text-body-md text-on-surface tabular-nums">
            {showPasscode ? meeting.passcode : '\u2022'.repeat(meeting.passcode.length)}
          </span>
          <button
            type="button"
            onClick={() => setShowPasscode(!showPasscode)}
            aria-pressed={showPasscode}
            className="text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
            aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
          >
            <Icon name={showPasscode ? 'visibility_off' : 'visibility'} size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleCopy(meeting.passcode!)}
            className="text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
            aria-label="Copy passcode"
          >
            <Icon name={copied ? 'check' : 'content_copy'} size={18} />
          </button>
          {copied && <span className="font-chrome text-[11px] text-secondary">Copied</span>}
        </div>
      )}

      {meeting.dialIn && (
        <div className="flex gap-3 mb-3">
          <span className="font-chrome text-[12px] uppercase tracking-[0.1em] text-on-surface-variant w-[80px] pt-0.5">Dial In</span>
          <div className="flex flex-col gap-1">
            {meeting.dialIn.split('\n').map((line, i) => (
              <span key={i} className="font-narrative text-body-md text-on-surface tabular-nums">{line}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <a
          href={meeting.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-5 py-3 bg-secondary text-on-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
        >
          Join Meeting
          <Icon name="open_in_new" size={18} />
        </a>
        {meeting.icsUrl && (
          <a
            href={meeting.icsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-5 py-3 border border-secondary text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            Add to Calendar
            <Icon name="calendar_add_on" size={18} />
          </a>
        )}
      </div>

      {meeting.note && (
        <p className="font-narrative text-body-md text-on-surface-variant mt-4 border-t border-outline-variant pt-4">{meeting.note}</p>
      )}
    </div>
  );
}
