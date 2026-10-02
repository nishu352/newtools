'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, RefreshCw } from 'lucide-react';
import {
  parseUnixTimestamp,
  calculateDateDifference,
  convertTimeZone,
  MAJOR_TIMEZONES,
  TimestampInfo,
} from '@/lib/tools/engines/datetime/datetime-engines';

// -------------------------------------------------------------
// UNIX TIMESTAMP TOOL
// -------------------------------------------------------------
export function UnixTimestampTool() {
  const [currentSec, setCurrentSec] = React.useState<number>(() => Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = React.useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Live ticker
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const info: TimestampInfo | null = React.useMemo(() => {
    try {
      return parseUnixTimestamp(inputTs);
    } catch {
      return null;
    }
  }, [inputTs]);

  const handleCopy = async (val: string, k: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(k);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Current Epoch Banner */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs text-[var(--foreground-muted)] block">Current Unix Epoch Time:</span>
          <span className="font-mono text-2xl font-bold text-[var(--primary)]">{currentSec}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setInputTs(String(currentSec))} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Set Current Time
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleCopy(String(currentSec), 'now')} className="text-xs">
            {copiedKey === 'now' ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copiedKey === 'now' ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--foreground)]">Enter Timestamp (Seconds or Milliseconds):</label>
        <input
          type="text"
          value={inputTs}
          onChange={(e) => setInputTs(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-sm focus:outline-none focus:border-[var(--primary)]"
          placeholder="e.g. 1700000000"
        />
      </div>

      {info ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">ISO 8601 (UTC)</span>
            <span className="font-mono text-xs font-bold text-[var(--foreground)] block">{info.isoUtc}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Your Local Time</span>
            <span className="font-mono text-xs font-bold text-[var(--foreground)] block">{info.localString}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Relative Age</span>
            <span className="font-mono text-xs font-bold text-[var(--primary)] block">{info.relative}</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <span className="text-[11px] text-[var(--foreground-muted)] block">Milliseconds (Epoch)</span>
            <span className="font-mono text-xs font-bold text-[var(--foreground)] block">{info.timestampMs}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-red-500 font-semibold">Please enter a valid numeric Unix timestamp.</p>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// DATE DIFFERENCE TOOL
// -------------------------------------------------------------
export function DateDifferenceTool() {
  const [d1, setD1] = React.useState('2026-01-01');
  const [d2, setD2] = React.useState('2026-12-31');

  const diff = React.useMemo(() => {
    return calculateDateDifference(new Date(d1), new Date(d2));
  }, [d1, d2]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">Start Date:</label>
          <input
            type="date"
            value={d1}
            onChange={(e) => setD1(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">End Date:</label>
          <input
            type="date"
            value={d2}
            onChange={(e) => setD2(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Total Calendar Days</span>
          <span className="text-2xl font-bold text-[var(--primary)]">{diff.totalDays}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Business Working Days</span>
          <span className="text-2xl font-bold text-emerald-500">{diff.businessDays}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Weekend Days</span>
          <span className="text-2xl font-bold text-amber-500">{diff.weekendDays}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
          <span className="text-[11px] text-[var(--foreground-muted)] block">Duration in Weeks</span>
          <span className="text-2xl font-bold text-[var(--foreground)]">{diff.weeks}w {diff.remainingDays}d</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TIMEZONE CONVERTER TOOL
// -------------------------------------------------------------
export function TimezoneConverterTool() {
  const [selectedDate, setSelectedDate] = React.useState(() => new Date().toISOString().slice(0, 16));

  const targetDate = React.useMemo(() => new Date(selectedDate), [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--foreground)]">Select Date & Local Time:</label>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MAJOR_TIMEZONES.map((tz) => (
          <div key={tz.zone} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <span className="text-xs font-semibold text-[var(--foreground-muted)] block">{tz.label}</span>
            <span className="font-mono text-sm font-bold text-[var(--primary)] block">
              {convertTimeZone(targetDate, tz.zone)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
