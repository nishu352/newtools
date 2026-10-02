'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Users, Check, Copy } from 'lucide-react';
import {
  pickRandomItems,
  shuffleList,
  splitIntoGroups,
} from '@/lib/tools/engines/productivity/productivity-engines';

export function PomodoroTimerTool() {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const modeTimes = useMemo(
    () => ({
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    }),
    []
  );

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(modeTimes[newMode]);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            if (mode === 'work') {
              setSessionsCompleted((s) => s + 1);
              return 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = ((modeTimes[mode] - timeLeft) / modeTimes[mode]) * 100;

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="flex justify-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60">
        {[
          { key: 'work', label: 'Pomodoro (25m)' },
          { key: 'shortBreak', label: 'Short Break (5m)' },
          { key: 'longBreak', label: 'Long Break (15m)' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchMode(tab.key as 'work' | 'shortBreak' | 'longBreak')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative py-8 flex flex-col items-center justify-center">
        <div className="w-56 h-56 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-500/10 dark:bg-cyan-500/10 transition-all duration-1000"
            style={{ height: `${progressPercent}%` }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {timeFormatted}
            </span>
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 mt-2">
              {mode === 'work' ? 'Focus Session' : 'Rest Break'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-95"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center px-4">
        <span>Completed Sessions: <strong className="text-slate-800 dark:text-slate-200 font-bold">{sessionsCompleted}</strong></span>
        <span>Standard interval: 4 pomodoros = 1 long break</span>
      </div>
    </div>
  );
}

export function RandomPickerTool() {
  const [rawText, setRawText] = useState('Alice\nBob\nCharlie\nDiana\nEthan\nFiona\nGeorge\nHannah');
  const [pickCount, setPickCount] = useState(1);
  const [groupCount, setGroupCount] = useState(2);
  const [results, setResults] = useState<string[]>([]);
  const [groupResults, setGroupResults] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => {
    return rawText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rawText]);

  const handlePick = () => {
    setGroupResults([]);
    const picked = pickRandomItems(items, pickCount, true);
    setResults(picked);
  };

  const handleShuffle = () => {
    setGroupResults([]);
    const shuffled = shuffleList(items);
    setResults(shuffled);
  };

  const handleGroup = () => {
    setResults([]);
    const groups = splitIntoGroups(items, groupCount);
    setGroupResults(groups);
  };

  const handleCopy = () => {
    let text = '';
    if (results.length > 0) {
      text = results.join('\n');
    } else if (groupResults.length > 0) {
      text = groupResults
        .map((g, idx) => `Group ${idx + 1}:\n${g.map((item) => ` - ${item}`).join('\n')}`)
        .join('\n\n');
    }
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            List Items (one per line, {items.length} items detected)
          </label>
        </div>
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Enter choices or names, one per line..."
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pick N Items</span>
            <input
              type="number"
              min="1"
              max={Math.max(1, items.length)}
              value={pickCount}
              onChange={(e) => setPickCount(Number(e.target.value))}
              className="w-14 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-mono"
            />
          </div>
          <button
            onClick={handlePick}
            disabled={items.length === 0}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            Pick Random Winner(s)
          </button>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shuffle Whole List</span>
          <button
            onClick={handleShuffle}
            disabled={items.length === 0}
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" /> Randomize Order
          </button>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Split Teams</span>
            <input
              type="number"
              min="2"
              max="20"
              value={groupCount}
              onChange={(e) => setGroupCount(Number(e.target.value))}
              className="w-14 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-mono"
            />
          </div>
          <button
            onClick={handleGroup}
            disabled={items.length === 0}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" /> Split into {groupCount} Groups
          </button>
        </div>
      </div>

      {(results.length > 0 || groupResults.length > 0) && (
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Generated Results
            </h4>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {results.map((res, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm"
                >
                  {i + 1}. {res}
                </span>
              ))}
            </div>
          )}

          {groupResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {groupResults.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-sm"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 text-blue-600 dark:text-cyan-400">
                    Group {gIdx + 1} ({group.length})
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {group.map((member, mIdx) => (
                      <li key={mIdx}>• {member}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
