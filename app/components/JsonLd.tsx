import React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqJsonLdProps {
  items: FaqItem[];
}

export const FaqJsonLd: React.FC<FaqJsonLdProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToJsonLdProps {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration e.g. "PT30M"
  supply?: string[];
  tools?: string[];
  steps: HowToStep[];
}

export const HowToJsonLd: React.FC<HowToJsonLdProps> = ({
  name,
  description,
  totalTime = 'PT15M',
  supply = [],
  tools = [],
  steps,
}) => {
  if (!steps || steps.length === 0) return null;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
      ...(s.image ? { image: s.image } : {}),
    })),
  };

  if (supply.length > 0) {
    schema.supply = supply.map((sup) => ({
      '@type': 'HowToSupply',
      name: sup,
    }));
  }

  if (tools.length > 0) {
    schema.tool = tools.map((t) => ({
      '@type': 'HowToTool',
      name: t,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export interface BreadcrumbItemSchema {
  name: string;
  item: string;
}

export interface BreadcrumbJsonLdProps {
  items: BreadcrumbItemSchema[];
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `https://concretecalc.co.uk${crumb.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
