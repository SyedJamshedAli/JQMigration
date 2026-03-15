'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const rows = [
  { label: 'Open', count: 24, color: 'bg-primary' },
  { label: 'In Progress', count: 18, color: 'bg-warning' },
  { label: 'Awaiting Review', count: 7, color: 'bg-info' },
  { label: 'Closed Today', count: 5, color: 'bg-success' },
];

export function ActiveCases() {
  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Active Cases</CardTitle>
        <Button mode="link" asChild>
          <Link href="#">See All</Link>
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-secondary-foreground">
            Total Active Cases
          </span>
          <span className="text-3xl font-semibold text-mono">{total}</span>
        </div>

        <div className="flex gap-1.5 h-2 rounded-full overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`${r.color} rounded-full`}
              style={{ flex: r.count }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between flex-wrap bg-accent/50 p-2.5 rounded-md gap-2"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${row.color}`} />
                <span className="text-sm text-mono">{row.label}</span>
              </div>
              <span className="text-sm font-medium text-mono">{row.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
