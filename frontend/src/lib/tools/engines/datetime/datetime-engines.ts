/**
 * OmniTools - Pure Date & Time Engine
 * Unix timestamps, date difference, business days, and timezone conversions.
 */

// -------------------------------------------------------------
// UNIX TIMESTAMPS
// -------------------------------------------------------------

export interface TimestampInfo {
  timestampSeconds: number;
  timestampMs: number;
  isoUtc: string;
  localString: string;
  relative: string;
}

export function parseUnixTimestamp(val: number | string): TimestampInfo {
  const num = typeof val === 'string' ? parseFloat(val.trim()) : val;
  if (!Number.isFinite(num)) throw new Error('Invalid timestamp number.');

  // If 10 digits or less, assume seconds; otherwise milliseconds
  let ms = num;
  let sec = Math.floor(num / 1000);
  if (num < 10000000000) {
    sec = Math.floor(num);
    ms = num * 1000;
  }

  const d = new Date(ms);
  if (isNaN(d.getTime())) throw new Error('Timestamp resolves to an invalid date.');

  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  let relative = 'just now';
  if (diffSec > 0) {
    if (diffSec < 60) relative = `${diffSec} seconds ago`;
    else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)} minutes ago`;
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)} hours ago`;
    else relative = `${Math.floor(diffSec / 86400)} days ago`;
  } else if (diffSec < 0) {
    const futureSec = Math.abs(diffSec);
    if (futureSec < 60) relative = `in ${futureSec} seconds`;
    else if (futureSec < 3600) relative = `in ${Math.floor(futureSec / 60)} minutes`;
    else if (futureSec < 86400) relative = `in ${Math.floor(futureSec / 3600)} hours`;
    else relative = `in ${Math.floor(futureSec / 86400)} days`;
  }

  return {
    timestampSeconds: sec,
    timestampMs: ms,
    isoUtc: d.toISOString(),
    localString: d.toLocaleString(),
    relative,
  };
}

// -------------------------------------------------------------
// DATE DIFFERENCE & BUSINESS DAYS
// -------------------------------------------------------------

export interface DateDiffResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
  hours: number;
}

export function calculateDateDifference(startDate: Date, endDate: Date): DateDiffResult {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  const isReversed = end < start;
  const d1 = isReversed ? end : start;
  const d2 = isReversed ? start : end;

  const diffMs = d2.getTime() - d1.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const hours = totalDays * 24;

  let businessDays = 0;
  let weekendDays = 0;
  const cur = new Date(d1);

  while (cur < d2) {
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return {
    totalDays,
    weeks,
    remainingDays,
    businessDays,
    weekendDays,
    hours,
  };
}

// -------------------------------------------------------------
// TIMEZONE CONVERTER
// -------------------------------------------------------------

export const MAJOR_TIMEZONES = [
  { label: 'UTC (Coordinated Universal Time)', zone: 'UTC' },
  { label: 'New York (EDT / EST)', zone: 'America/New_York' },
  { label: 'Los Angeles (PDT / PST)', zone: 'America/Los_Angeles' },
  { label: 'London (BST / GMT)', zone: 'Europe/London' },
  { label: 'Paris / Berlin (CEST / CET)', zone: 'Europe/Paris' },
  { label: 'Dubai (GST)', zone: 'Asia/Dubai' },
  { label: 'Mumbai / New Delhi (IST)', zone: 'Asia/Kolkata' },
  { label: 'Singapore (SGT)', zone: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', zone: 'Asia/Tokyo' },
  { label: 'Sydney (AEST / AEDT)', zone: 'Australia/Sydney' },
];

export function convertTimeZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
