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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ name: 'Contact & Suggestions' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Get in Touch & Suggest Tools
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Need a specific tool built? Found an edge-case bug? Have feedback on our privacy architecture? We build tools
          directly based on community demand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-semibold text-sm mb-1">
              <Mail className="w-4 h-4 text-emerald-500" />
              <span>Direct Support</span>
            </div>
            <p className="text-xs text-slate-500">
              support@omnitools.dev
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-semibold text-sm mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Tool Requests</span>
            </div>
            <p className="text-xs text-slate-500">
              We prioritize client-side tools that can run safely without server uploads.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Thank you for your feedback!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mb-6">
                Your tool suggestion has been noted and added to our roadmap review queue.
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
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col gap-4"
            >
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name (Optional)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="contact-type" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Type
                </label>
                <select
                  id="contact-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="tool-request">Request a New Tool</option>
                  <option value="bug-report">Report a Bug / Calculation Error</option>
                  <option value="privacy">Privacy Architecture Question</option>
                  <option value="general">General Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message / Tool Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-msg"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the tool you'd like to see or your feedback..."
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="mt-2 text-xs">
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
