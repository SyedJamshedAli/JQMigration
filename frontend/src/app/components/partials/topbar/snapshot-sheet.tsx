'use client';

import { ReactNode, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, ChevronRight, FileText, ListChecks, StickyNote, AlertCircle, Globe, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SNAPSHOT_ITEMS = [
  { label: 'Documents', count: 5,  icon: FileText,    href: '/documents'  },
  { label: 'Tasks',     count: 8,  icon: CheckSquare, href: '/tasks'       },
  { label: 'File Notes',count: 4,  icon: StickyNote,  href: '/file-notes'  },
  { label: 'Expires',   count: 2,  icon: AlertCircle, href: '/expires'     },
  { label: 'Webleads',  count: 6,  icon: Globe,       href: '/webleads'    },
];

function DatePicker({ label, value, onChange }: { label: string; value: Date | undefined; onChange: (d: Date | undefined) => void }) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('h-8 text-xs justify-start gap-1.5 px-2.5', !value && 'text-muted-foreground')}
          >
            <CalendarDays className="size-3.5 shrink-0" />
            {value ? format(value, 'dd/MM/yyyy') : 'Select'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SnapshotSheet({ trigger }: { trigger: ReactNode }) {
  const [user, setUser] = useState('my');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[360px] sm:max-w-none inset-5 start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4 [&_[data-slot=sheet-close]]:end-4">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border mb-0">
          <SheetTitle className="text-base font-semibold">Snapshot</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-4 flex flex-col gap-4">

          {/* Filters row */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">User</span>
              <Select value={user} onValueChange={setUser}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my">My</SelectItem>
                  <SelectItem value="john">John</SelectItem>
                  <SelectItem value="demo-user">Demo User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DatePicker label="From" value={fromDate} onChange={setFromDate} />
            <DatePicker label="To"   value={toDate}   onChange={setToDate}   />
          </div>

          {/* Today You Have */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Today You Have</p>
            <div className="rounded-lg border border-border overflow-hidden">
              {SNAPSHOT_ITEMS.map(({ label, count, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-primary">{count}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
