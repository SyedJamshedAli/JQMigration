'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const GRID_COLS = [
  'Matter ID / Prospect #',
  'Matter Type',
  'Business Name',
  'Surname',
  'Given Names',
  'Pref Name',
  'Country of Birth',
  'Visa Applying For',
];

const STATIC_ROWS = [
  { id: 'SMITJO 26.0001', type: 'Migrant', business: '', surname: 'Smith',  given: 'John',  pref: '',      country: 'Australia',     visa: 'Partner' },
  { id: 'NGULNH 26.0002', type: 'Sponsor', business: '', surname: 'Nguyen', given: 'Linh',  pref: 'Linda', country: 'Vietnam',       visa: 'Skilled' },
  { id: 'WILSAR 26.0003', type: 'Migrant', business: '', surname: 'Wilson', given: 'Sarah', pref: '',      country: 'United Kingdom', visa: 'Student' },
];

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
      <span className="text-sm text-muted-foreground text-right">{label}</span>
      {children}
    </div>
  );
}

export function NewClient({ onCancel, onCreate }: { onCancel?: () => void; onCreate?: () => void }) {
  const [matterCategory, setMatterCategory] = useState<'new-client' | 'duplicate' | 'new-prospect'>('new-client');
  const [matterType, setMatterType]         = useState<'migrant' | 'sponsor'>('migrant');
  const [subType, setSubType]               = useState<'business' | 'family'>('family');
  const [surname, setSurname]               = useState('Smith');
  const [givenNames, setGivenNames]         = useState('John');
  const [prefName, setPrefName]             = useState('');
  const [matterId]                          = useState('SMITJO 26.0001');
  const [engDate, setEngDate]               = useState<Date | undefined>(new Date(2026, 2, 10));
  const [responsible, setResponsible]       = useState('Rasheed Qasim');
  const [manager, setManager]               = useState('');
  const [clerk, setClerk]                   = useState('');
  const [office, setOffice]                 = useState('main');
  const [filter, setFilter]                 = useState('');
  const defaultDate                         = new Date(2026, 2, 10);

  return (
    <div className="flex flex-col gap-4">

      {/* ── 3 panels form (top) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

        {/* LEFT — Matter Type */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-accent/60 px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Matter Type</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              { value: 'new-client',   label: 'New Client'                },
              { value: 'duplicate',    label: 'Duplicate Selected Matter'  },
              { value: 'new-prospect', label: 'New Prospect'               },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="matter-category"
                  value={value}
                  checked={matterCategory === value}
                  onChange={() => setMatterCategory(value as typeof matterCategory)}
                  className="accent-primary"
                />
                <span className="text-sm">{label}</span>
                {value === 'new-prospect' && (
                  <span className="ml-1 inline-flex items-center justify-center size-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold leading-none">?</span>
                )}
              </label>
            ))}
            <div className="pt-2 border-t border-border">
              <Input
                className="h-8 text-sm"
                placeholder="Filter..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CENTER — Matter Detail */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-accent/60 px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Matter Detail</span>
          </div>
          <div className="p-3 flex flex-col gap-2.5">

            <FormRow label="Matter Type">
              <div className="flex items-center gap-4">
                {(['migrant', 'sponsor'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="matter-type"
                      value={v}
                      checked={matterType === v}
                      onChange={() => setMatterType(v)}
                      className="accent-primary"
                    />
                    <span className="text-sm capitalize">{v}</span>
                  </label>
                ))}
              </div>
            </FormRow>

            <FormRow label="">
              <div className="flex items-center gap-4">
                {(['business', 'family'] as const).map((v) => (
                  <label key={v} className={cn('flex items-center gap-1.5', matterType !== 'sponsor' && 'opacity-40 cursor-not-allowed')}>
                    <input
                      type="radio"
                      name="sub-type"
                      value={v}
                      checked={subType === v}
                      disabled={matterType !== 'sponsor'}
                      onChange={() => setSubType(v)}
                      className="accent-primary"
                    />
                    <span className="text-sm capitalize">{v}</span>
                  </label>
                ))}
              </div>
            </FormRow>

            <FormRow label="Surname">
              <Input className="h-8 text-sm" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </FormRow>

            <FormRow label="Given Names">
              <Input className="h-8 text-sm" value={givenNames} onChange={(e) => setGivenNames(e.target.value)} />
            </FormRow>

            <FormRow label="Preferred Name">
              <Input className="h-8 text-sm" value={prefName} onChange={(e) => setPrefName(e.target.value)} />
            </FormRow>

            <FormRow label="Matter ID">
              <Input className="h-8 text-sm bg-muted" value={matterId} readOnly />
            </FormRow>

            <FormRow label="Engagement Date">
              <div className="flex items-center gap-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 px-2.5 flex-1">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {engDate ? format(engDate, 'dd/MM/yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={engDate} onSelect={setEngDate} />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs gap-1"
                  onClick={() => setEngDate(defaultDate)}
                >
                  <RotateCcw className="size-3" />
                  Reset
                </Button>
              </div>
            </FormRow>

          </div>
        </div>

        {/* RIGHT — Responsible Staff / Office */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-accent/60 px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Responsible Staff / Office</span>
          </div>
          <div className="p-3 flex flex-col gap-2.5">

            <FormRow label="Responsible">
              <div className="flex items-center gap-1.5">
                <Input
                  className="h-8 text-sm flex-1 bg-yellow-50 dark:bg-yellow-950/20"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                />
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
                  <User className="size-3.5" />
                </Button>
              </div>
            </FormRow>

            <FormRow label="Manager">
              <div className="flex items-center gap-1.5">
                <Input
                  className="h-8 text-sm flex-1"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                />
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
                  <User className="size-3.5" />
                </Button>
              </div>
            </FormRow>

            <FormRow label="Clerk">
              <div className="flex items-center gap-1.5">
                <Input
                  className="h-8 text-sm flex-1"
                  value={clerk}
                  onChange={(e) => setClerk(e.target.value)}
                />
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
                  <User className="size-3.5" />
                </Button>
              </div>
            </FormRow>

            <FormRow label="Office">
              <Select value={office} onValueChange={setOffice}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="branch-1">Branch 1</SelectItem>
                  <SelectItem value="branch-2">Branch 2</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>

          </div>
        </div>

      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onCreate}>
          Create
        </Button>
      </div>

      {/* ── Grid (bottom) ── */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="grid border-b border-border bg-accent/60 text-xs font-semibold text-mono"
            style={{ gridTemplateColumns: 'repeat(8, minmax(110px, 1fr))' }}
          >
            {GRID_COLS.map((col) => (
              <span key={col} className="px-3 py-2 border-r border-border last:border-r-0 truncate">{col}</span>
            ))}
          </div>
          {STATIC_ROWS.map((row, i) => (
            <div
              key={i}
              className="grid border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors cursor-pointer"
              style={{ gridTemplateColumns: 'repeat(8, minmax(110px, 1fr))' }}
            >
              <span className="px-3 py-2 border-r border-border text-sm text-primary">{row.id}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.type}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.business}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.surname}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.given}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.pref}</span>
              <span className="px-3 py-2 border-r border-border text-sm">{row.country}</span>
              <span className="px-3 py-2 text-sm">{row.visa}</span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 5 - STATIC_ROWS.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="grid border-b border-border last:border-b-0"
              style={{ gridTemplateColumns: 'repeat(8, minmax(110px, 1fr))' }}
            >
              {GRID_COLS.map((_, ci) => (
                <span key={ci} className="px-3 py-2 border-r border-border last:border-r-0 text-sm">&nbsp;</span>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}