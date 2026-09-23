'use client';

import * as React from 'react';
import { Copy, Check, Trash2, Database, Sparkles, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatSql, minifySql } from '@/lib/tools/engines/sql-formatter';

const SAMPLE_SQL = `select u.id, u.full_name, count(o.id) as order_count, sum(o.total_amount) as total_spent
from users u
left join orders o on u.id = o.user_id
where u.status = 'active' and (o.created_at >= '2026-01-01' or o.created_at is null)
group by u.id, u.full_name
having count(o.id) > 0
order by total_spent desc
limit 50;`;

export function SqlQueryFormatter() {
  const [sqlInput, setSqlInput] = React.useState<string>(SAMPLE_SQL);
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleFormat = () => {
    if (!sqlInput.trim()) return;
    const formatted = formatSql(sqlInput);
    setSqlInput(formatted);
  };

  const handleMinify = () => {
    if (!sqlInput.trim()) return;
    const minified = minifySql(sqlInput);
    setSqlInput(minified);
  };

  const handleCopy = async () => {
    if (!sqlInput) return;
    try {
      await navigator.clipboard.writeText(sqlInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = sqlInput.split('\n').length;
  const chars = sqlInput.length;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleFormat} className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Format SQL
          </Button>
          <Button variant="secondary" size="sm" onClick={handleMinify} className="gap-1.5">
            <Minimize2 className="w-3.5 h-3.5" />
            Minify (Single Line)
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSqlInput(SAMPLE_SQL)}
            className="text-xs text-slate-500"
          >
            Load Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!sqlInput.trim()}
            className="text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--primary)] mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSqlInput('')}
            className="text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[var(--primary)]" />
            SQL Query (Inert Client-Side Processing)
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>{lines} lines</span>
            <span>•</span>
            <span>{chars.toLocaleString()} chars</span>
          </div>
        </div>

        <textarea
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          placeholder="Paste your SQL statement here (SELECT, INSERT, UPDATE, JOIN...)"
          spellCheck={false}
          className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none leading-relaxed"
        />
      </div>

      {/* Usage Tips */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
        <p>
          <strong>Privacy & Safety:</strong> Queries are formatted entirely within browser memory and are never executed
          or transmitted to any database or server.
        </p>
        <p>
          Supported dialects: Standard SQL, PostgreSQL, MySQL, SQLite, MariaDB, and BigQuery.
        </p>
      </div>
    </div>
  );
}
