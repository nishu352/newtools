'use client';

import * as React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [type, setType] = React.useState('tool-request');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ name: 'Contact & Suggestions' }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Contact & Tool Suggestions
        </h1>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Need a tool built or have feedback? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-hover)]">
            <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold text-xs mb-1">
              <Mail className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Direct Support</span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              support@omnitools.dev
            </p>
          </div>

          <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-hover)]">
            <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold text-xs mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Tool Requests</span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              We prioritize privacy-first, client-side browser tools.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface-hover)] text-center flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-[var(--primary)] mb-2" />
              <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">
                Thank you for your feedback
              </h2>
              <p className="text-xs text-[var(--muted)] mb-4">
                Your message has been received.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface-hover)] flex flex-col gap-4"
            >
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Name (Optional)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label htmlFor="contact-type" className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Inquiry Type
                </label>
                <select
                  id="contact-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="tool-request">Request a New Tool</option>
                  <option value="bug-report">Report a Bug / Calculation Error</option>
                  <option value="privacy">Privacy Question</option>
                  <option value="general">General Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Message <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea
                  id="contact-msg"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your request or feedback..."
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-y"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="mt-1 text-xs self-start">
                <Send className="w-3.5 h-3.5" />
                Submit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
