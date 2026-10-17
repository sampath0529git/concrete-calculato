import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'UK SEO Growth Hub & Keyword Intelligence',
  description:
    'Internal SEMrush keyword tracker, Google SERP simulator, AI technical publisher, and real-time on-page SEO grader for ConcreteCalc.UK.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
