import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className="breadcrumbs"
      aria-label="Breadcrumb navigation"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const position = idx + 1;

        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            <span
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className="breadcrumb-current"
                  itemProp="name"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(position)} />
            </span>

            {!isLast && (
              <span className="breadcrumb-sep" aria-hidden="true">
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
