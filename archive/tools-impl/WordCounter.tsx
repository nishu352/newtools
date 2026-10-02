'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { Check, Copy, Trash2, Clock, Volume2 } from 'lucide-react';

export function WordCounter() {
  const [text, setText] = React.useState<string>(
    'OmniTools is designed around a zero-retention privacy architecture. Any tool that can execute inside your web browser runs 100% on your device, guaranteeing total privacy and instant speed.'
  );
  const [copied, setCopied] = React.useState<boolean>(false);

  const stats = React.useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    // Characters
    const charsTotal = raw.length;
    const charsNoSpaces = raw.replace(/\s+/g, '').length;

    // Words
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

    // Sentences
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;

    // Paragraphs
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;

    // Reading time (average 200 words/min)
    const readingMinutes = words / 200;
    const readingTimeSec = Math.ceil(readingMinutes * 60);
    const readingTimeFormatted =
      readingTimeSec < 60
        ? `${readingTimeSec}s`
        : `${Math.floor(readingTimeSec / 60)}m ${readingTimeSec % 60}s`;

    // Speaking time (average 130 words/min)
    const speakingMinutes = words / 130;
    const speakingTimeSec = Math.ceil(speakingMinutes * 60);
    const speakingTimeFormatted =
      speakingTimeSec < 60
        ? `${speakingTimeSec}s`
        : `${Math.floor(speakingTimeSec / 60)}m ${speakingTimeSec % 60}s`;

    return {
      charsTotal,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeFormatted,
      speakingTimeFormatted,
    };
  }, [text]);

  const transformCase = (type: 'upper' | 'lower' | 'title' | 'trim') => {
    if (!text) return;
    if (type === 'upper') {
      setText(text.toUpperCase());
    } else if (type === 'lower') {
      setText(text.toLowerCase());
    } else if (type === 'title') {
      setText(
        text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        )
      );
    } else if (type === 'trim') {
      setText(text.replace(/\s+/g, ' ').trim());
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.words}</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Words</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.charsTotal}</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Characters</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.charsNoSpaces}</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">No Spaces</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.sentences}</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Sentences</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-lg">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            <span>{stats.readingTimeFormatted}</span>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Reading Time</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-lg">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span>{stats.speakingTimeFormatted}</span>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Speaking Time</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Case:</span>
          <Button variant="outline" size="sm" onClick={() => transformCase('upper')} className="text-xs">
            UPPERCASE
          </Button>
          <Button variant="outline" size="sm" onClick={() => transformCase('lower')} className="text-xs">
            lowercase
          </Button>
          <Button variant="outline" size="sm" onClick={() => transformCase('title')} className="text-xs">
            Title Case
          </Button>
          <Button variant="outline" size="sm" onClick={() => transformCase('trim')} className="text-xs">
            Trim Spaces
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {text && (
            <Button variant="ghost" size="sm" onClick={() => setText('')} className="text-xs text-rose-500 hover:text-rose-600">
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleCopy} disabled={!text} className="text-xs">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Text
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex flex-col">
        <label htmlFor="word-counter-input" className="sr-only">
          Text Content
        </label>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your text to see real-time statistics..."
          className="w-full h-80 p-4 font-sans text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed resize-y"
        />
      </div>
    </div>
  );
}
