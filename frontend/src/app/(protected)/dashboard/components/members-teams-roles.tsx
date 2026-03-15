'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const rows = [
  { label: 'Total Members', count: 142, href: '/administration/users' },
  { label: 'Active Teams', count: 18, href: '/administration/roles' },
  { label: 'Roles Defined', count: 9, href: '/administration/roles' },
  { label: 'Pending Invites', count: 4, href: '/administration/users' },
];

export function MembersTeamsRoles() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Members, Teams &amp; Roles</CardTitle>
        <Button mode="link" asChild>
          <Link href="/administration/users">Manage</Link>
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-secondary-foreground">
            Organisation Overview
          </span>
          <span className="text-3xl font-semibold text-mono">
            {rows[0].count}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between flex-wrap bg-accent/50 p-2.5 rounded-md gap-2"
            >
              <span className="text-sm text-mono">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-mono">{row.count}</span>
                <span className="border-l border-input h-[12px]" />
                <Link
                  href={row.href}
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
