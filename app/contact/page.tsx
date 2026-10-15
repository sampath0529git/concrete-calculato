'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="wrap">
      <div className="post">
        <h1>Contact</h1>
        <p>
          Questions, corrections or suggestions? Email us at{' '}
          <strong>hello@concretecalc.uk</strong> or use the message form below.
        </p>

        {submitted ? (
          <div className="panel" style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--ok)' }}>✓ Thank you for getting in touch!</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              We have received your message and will respond as soon as possible.
            </p>
          </div>
        ) : (
          <form className="panel" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
            <div className="f">
              <label htmlFor="c-name">Your Name</label>
              <input
                id="c-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
              />
            </div>
            <div className="f">
              <label htmlFor="c-email">Email Address</label>
              <input
                id="c-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.co.uk"
              />
            </div>
            <div className="f">
              <label htmlFor="c-msg">Message or Inquiry</label>
              <textarea
                id="c-msg"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help with your concrete project?"
              />
            </div>
            <button className="cta" type="submit">
              Send Message
            </button>
          </form>
        )}

        <div style={{ marginTop: '32px' }}>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
          >
            ← Back to Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
