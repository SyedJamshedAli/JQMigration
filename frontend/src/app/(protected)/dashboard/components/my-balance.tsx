'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const transactions = [
  { label: 'Available Balance', amount: '$4,250.00', color: 'bg-success' },
  { label: 'Pending Charges', amount: '$320.00', color: 'bg-warning' },
  { label: 'Last Payment', amount: '$1,100.00', color: 'bg-primary' },
  { label: 'Credit Limit', amount: '$10,000.00', color: 'bg-info' },
];

export function MyBalance() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>My Balance</CardTitle>
        <Button mode="link" asChild>
          <Link href="#">Details</Link>
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-secondary-foreground">
            Available Balance
          </span>
          <span className="text-3xl font-semibold text-mono">$4,250.00</span>
        </div>

        <div className="flex gap-1.5 h-2 rounded-full overflow-hidden">
          {transactions.map((t, i) => (
            <div
              key={i}
              className={`${t.color} rounded-full flex-1`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between flex-wrap bg-accent/50 p-2.5 rounded-md gap-2"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${row.color}`} />
                <span className="text-sm text-mono">{row.label}</span>
              </div>
              <span className="text-sm font-medium text-mono">{row.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
