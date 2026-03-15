'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarIcon, RotateCcw, Plus, Minus, Mail, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CountrySelect, COUNTRIES } from './country-select';

/* ── Searchable country combobox (name-based) ── */
function CountryCombobox({
  value,
  onChange,
  placeholder = 'Select country…',
  className,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = COUNTRIES.find((c) => c.code === value);
  const filtered = search
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('h-7 w-full justify-between px-2 text-xs font-normal', className)}
        >
          <span className="truncate">{selected ? selected.name : placeholder}</span>
          <ChevronsUpDown className="size-3 shrink-0 text-muted-foreground ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex items-center border-b border-border px-2">
          <input
            className="h-8 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            placeholder="Search country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-3 text-center text-xs text-muted-foreground">No country found</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 px-2 py-1.5 text-xs hover:bg-accent cursor-pointer',
                  value === c.code && 'bg-accent font-medium',
                )}
                onClick={() => { onChange?.(c.code); setOpen(false); setSearch(''); }}
              >
                {value === c.code && <Check className="size-3 shrink-0 text-primary" />}
                {value !== c.code && <span className="size-3 shrink-0" />}
                {c.name}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="bg-accent/60 px-3 py-1.5 border-b border-border">
        <span className="text-xs font-semibold text-mono uppercase tracking-wide">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  labelWidth = 'w-36',
  children,
}: {
  label: string;
  labelWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      <span className={`text-sm text-secondary-foreground text-right shrink-0 ${labelWidth}`}>
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function DatePicker({
  value,
  onChange,
  placeholder = 'No Date Set',
}: {
  value?: Date;
  onChange: (d: Date | undefined) => void;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-7 flex-1 justify-start text-left text-sm font-normal px-2 gap-1.5',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          {value ? format(value, 'dd/MM/yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}

function AddressFields() {
  return (
    <div className="flex flex-col gap-2">
      <FieldRow label="Street">
        <Input className="h-7 text-sm" placeholder="Street line 1" />
      </FieldRow>
      <FieldRow label="">
        <Input className="h-7 text-sm" placeholder="Street line 2" />
      </FieldRow>
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Suburb</span>
        <Input className="h-7 text-sm flex-1" placeholder="Suburb" />
        <span className="text-sm text-secondary-foreground shrink-0">City/Town</span>
        <Input className="h-7 text-sm flex-1" placeholder="City/Town" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">State/Province</span>
        <Input className="h-7 text-sm flex-1" placeholder="State/Province" />
        <span className="text-sm text-secondary-foreground shrink-0">Postcode</span>
        <Input className="h-7 text-sm w-24" placeholder="Postcode" />
      </div>
      <FieldRow label="Country">
        <Input className="h-7 text-sm" placeholder="Country" />
      </FieldRow>
    </div>
  );
}

/* ─────────────────────────── Particulars tab ─────────────────────────── */

function ParticularsTab() {
  const [dob, setDob]         = useState<Date | undefined>();
  const [otherDob1, setOtherDob1] = useState<Date | undefined>();
  const [otherDob2, setOtherDob2] = useState<Date | undefined>();
  const [includeNonApp, setIncludeNonApp] = useState(false);
  const [sameAsPrimary, setSameAsPrimary] = useState(false);
  const [lodgementType, setLodgementType] = useState<'australia' | 'overseas'>('australia');
  const [decisionType, setDecisionType]   = useState<'australia' | 'overseas'>('australia');
  const [prefEmail, setPrefEmail]         = useState('');
  const [altEmail, setAltEmail]           = useState('');
  const [phoneCodes, setPhoneCodes]       = useState<Record<string, string>>({
    home: 'au', work: 'au', fax: 'au',
  });

  const [otherNames, setOtherNames] = useState([
    { surname: '', givenNames: '', reasonForChange: '' },
  ]);
  const [newOtherName, setNewOtherName] = useState({ surname: '', givenNames: '', reasonForChange: '' });

  const isValidEmail = (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const addOtherName = () => {
    if (newOtherName.surname.trim()) {
      setOtherNames((prev) => [...prev, newOtherName]);
      setNewOtherName({ surname: '', givenNames: '', reasonForChange: '' });
    }
  };

  const removeOtherName = (idx: number) => {
    setOtherNames((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ── Personal Particulars ── */}
      <SectionBox title="Personal Particulars">
        <div className="flex flex-col gap-2">
          <FieldRow label="Surname">
            <Input className="h-7 text-sm" placeholder="Surname" />
          </FieldRow>
          <FieldRow label="Given Names">
            <Input className="h-7 text-sm" placeholder="Given names" />
          </FieldRow>
          <FieldRow label="Preferred Name">
            <Input className="h-7 text-sm" placeholder="Preferred name" />
          </FieldRow>
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Prefix</span>
            <Input className="h-7 text-sm w-28" placeholder="Prefix" />
            <span className="text-sm text-secondary-foreground shrink-0 ml-4">Gender</span>
            <Select>
              <SelectTrigger className="h-7 text-sm flex-1">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other / Not Stated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FieldRow label="Marital Status">
            <Select>
              <SelectTrigger className="h-7 text-sm">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="defacto">De Facto</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Dept Client ID">
            <Input className="h-7 text-sm" placeholder="Department client ID" />
          </FieldRow>
        </div>
      </SectionBox>

      {/* ── Birth Details ── */}
      <SectionBox title="Birth Details">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Date of Birth</span>
            <DatePicker value={dob} onChange={setDob} />
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2.5 shrink-0"
              onClick={() => setDob(undefined)}
            >
              <RotateCcw className="size-3 mr-1" />
              Reset
            </Button>
          </div>
          <FieldRow label="Suburb">
            <Input className="h-7 text-sm" placeholder="Birth suburb" />
          </FieldRow>
          <FieldRow label="City/Town">
            <Input className="h-7 text-sm" placeholder="Birth city / town" />
          </FieldRow>
          <FieldRow label="State/Province">
            <Input className="h-7 text-sm" placeholder="Birth state / province" />
          </FieldRow>
          <FieldRow label="Country">
            <Input className="h-7 text-sm" placeholder="Birth country" />
          </FieldRow>
        </div>
      </SectionBox>

      {/* ── Other Dates of Birth ── */}
      <SectionBox title="Other Dates of Birth">
        <div className="flex flex-col gap-2">
          {[
            { label: 'Date 1', value: otherDob1, onChange: setOtherDob1 },
            { label: 'Date 2', value: otherDob2, onChange: setOtherDob2 },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">{row.label}</span>
              <DatePicker value={row.value} onChange={row.onChange} />
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5 shrink-0"
                onClick={() => row.onChange(undefined)}
              >
                <RotateCcw className="size-3 mr-1" />
                Reset
              </Button>
            </div>
          ))}
        </div>
      </SectionBox>

      {/* ── Addresses ── */}
      <SectionBox title="Addresses">
        <Tabs defaultValue="contact">
          <TabsList variant="button" size="xs" className="mb-3">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="residential">Residential</TabsTrigger>
            <TabsTrigger value="correspondence">Correspondence</TabsTrigger>
            <TabsTrigger value="overseas">Overseas</TabsTrigger>
          </TabsList>

          {/* Contact tab */}
          <TabsContent value="contact">
            <div className="flex flex-col gap-1.5">
              {/* column headers */}
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                <span className="w-36 shrink-0" />
                <span className="w-28">Country</span>
                <span className="w-20">Area</span>
                <span className="flex-1">Number</span>
              </div>
              {[
                { label: 'Home Telephone', key: 'home' },
                { label: 'Work Telephone', key: 'work' },
                { label: 'Fax',            key: 'fax'  },
              ].map((row) => (
                <div key={row.key} className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                    {row.label}
                  </span>
                  <CountrySelect
                    value={phoneCodes[row.key]}
                    onChange={(v) => setPhoneCodes((prev) => ({ ...prev, [row.key]: v }))}
                  />
                  <Input className="h-7 text-sm w-20" placeholder="Area" />
                  <Input className="h-7 text-sm flex-1" placeholder="Number" />
                </div>
              ))}
              {/* Mobile/Cell — no area code */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Mobile/Cell</span>
                <Input className="h-7 text-sm flex-1" placeholder="Mobile number" />
              </div>
              {/* Emails */}
              {[
                { label: 'Preferred E-mail', value: prefEmail, onChange: setPrefEmail },
                { label: 'Alternative E-mail', value: altEmail, onChange: setAltEmail },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                      {row.label}
                    </span>
                    <Input
                      className={cn(
                        'h-7 text-sm flex-1',
                        !isValidEmail(row.value) && 'border-destructive focus-visible:ring-destructive',
                      )}
                      type="email"
                      value={row.value}
                      onChange={(e) => row.onChange(e.target.value)}
                      placeholder="email@example.com"
                    />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                      <Mail className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  {!isValidEmail(row.value) && (
                    <p className="text-xs text-destructive pl-[9.5rem]">Enter a valid email address</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Address tabs */}
          {(['residential', 'correspondence', 'overseas'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <AddressFields />
            </TabsContent>
          ))}
        </Tabs>
      </SectionBox>

      {/* ── Intended Location ── */}
      <SectionBox title="Intended Location">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Migrating To</span>
            <div className="flex-1">
              <CountryCombobox placeholder="Select country…" />
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <Checkbox
                id="same-as-primary"
                checked={sameAsPrimary}
                onCheckedChange={(v) => setSameAsPrimary(!!v)}
              />
              <label htmlFor="same-as-primary" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">
                Same as Primary Applicant
              </label>
            </div>
          </div>

          {/* At Lodgement */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">At Lodgement</span>
            {(['australia', 'overseas'] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="lodgement"
                  value={opt}
                  checked={lodgementType === opt}
                  onChange={() => setLodgementType(opt)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{opt === 'australia' ? 'Australia' : 'Overseas'}</span>
              </label>
            ))}
            {lodgementType === 'overseas' && (
              <div className="flex-1">
                <CountryCombobox placeholder="Select country…" />
              </div>
            )}
          </div>

          {/* At Decision */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">At Decision</span>
            {(['australia', 'overseas'] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="decision"
                  value={opt}
                  checked={decisionType === opt}
                  onChange={() => setDecisionType(opt)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{opt === 'australia' ? 'Australia' : 'Overseas'}</span>
              </label>
            ))}
            {decisionType === 'overseas' && (
              <div className="flex-1">
                <CountryCombobox placeholder="Select country…" />
              </div>
            )}
          </div>
        </div>
      </SectionBox>

      {/* ── Other Names Known By ── */}
      <SectionBox title="Other Names Known By">
        <div className="flex flex-col gap-2">
          {/* Table header */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-accent/60 px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border">
              <span>Surname</span>
              <span>Given Names</span>
              <span>Reason For Change</span>
            </div>
            <div className="min-h-[60px]">
              {otherNames.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 px-2 py-1 text-sm border-b border-border last:border-0 hover:bg-accent/30"
                >
                  <span>{row.surname}</span>
                  <span>{row.givenNames}</span>
                  <span>{row.reasonForChange}</span>
                </div>
              ))}
              {otherNames.length === 0 && (
                <div className="px-2 py-2 text-xs text-muted-foreground italic">No entries</div>
              )}
            </div>
          </div>

          {/* Add row inputs */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-border">
            <FieldRow label="Surname">
              <Input
                className="h-7 text-sm"
                value={newOtherName.surname}
                onChange={(e) => setNewOtherName((p) => ({ ...p, surname: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Given Names">
              <Input
                className="h-7 text-sm"
                value={newOtherName.givenNames}
                onChange={(e) => setNewOtherName((p) => ({ ...p, givenNames: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Reason for Change">
              <Select
                value={newOtherName.reasonForChange}
                onValueChange={(v) => setNewOtherName((p) => ({ ...p, reasonForChange: v }))}
              >
                <SelectTrigger className="h-7 text-sm">
                  <SelectValue placeholder="Select reason…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage">Marriage</SelectItem>
                  <SelectItem value="divorce">Divorce</SelectItem>
                  <SelectItem value="deed-poll">Deed Poll</SelectItem>
                  <SelectItem value="naturalisation">Naturalisation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={addOtherName} title="Add">
              <Plus className="size-3.5 text-green-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => removeOtherName(otherNames.length - 1)}
              disabled={otherNames.length === 0}
              title="Remove last"
            >
              <Minus className="size-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </SectionBox>

      {/* ── Descent ── */}
      <SectionBox title="Descent">
        <div className="flex flex-col gap-3">
          {/* Arabic */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-24">
              <Checkbox id="arabic" />
              <label htmlFor="arabic" className="text-sm cursor-pointer">Arabic</label>
            </div>
            <span className="text-sm text-secondary-foreground shrink-0">Name of Father's Father</span>
            <Input className="h-7 text-sm flex-1" placeholder="Father's father name" />
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 shrink-0">Select</Button>
          </div>

          {/* Russian */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-24">
              <Checkbox id="russian" />
              <label htmlFor="russian" className="text-sm cursor-pointer">Russian</label>
            </div>
            <span className="text-sm text-secondary-foreground shrink-0">Patronymic Name</span>
            <Input className="h-7 text-sm flex-1" placeholder="Patronymic name" />
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 shrink-0">Add</Button>
          </div>

          {/* Chinese */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-24">
              <Checkbox id="chinese" />
              <label htmlFor="chinese" className="text-sm cursor-pointer">Chinese</label>
            </div>
            <span className="text-sm text-secondary-foreground shrink-0">Commercial Code</span>
            <Input className="h-7 text-sm flex-1" placeholder="Commercial code" />
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

/* ─────────────────────────── Identity tab ─────────────────────────── */

type TravelDoc = {
  docNumber: string;
  country: string;
  issueDate: string;
  expiryDate: string;
  issuingAuth: string;
  primaryDoc: boolean;
  status: string;
};

type Citizenship = {
  country: string;
  obtainedRefused: string;
  dateObtained: string;
  reason: string;
  ceased: boolean;
  dateCeased: string;
  reasonCeased: string;
};

type IdentityDoc = {
  type: string;
  country: string;
  number: string;
  givenNames: string;
  surname: string;
  issueDate: string;
  expiryDate: string;
};

type ResidencyRight = {
  country: string;
  status: string;
  dateObtained: string;
};

function TableShell({
  cols,
  rows,
  emptyHeight = 'h-20',
}: {
  cols: string[];
  rows: React.ReactNode[];
  emptyHeight?: string;
}) {
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div
        className="grid bg-accent/60 border-b border-border"
        style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
      >
        {cols.map((c) => (
          <span key={c} className="px-2 py-1 text-xs font-medium text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className={`${emptyHeight} bg-muted/30`} />
      ) : (
        rows.map((row, i) => (
          <div
            key={i}
            className="grid border-b border-border last:border-0 hover:bg-accent/30"
            style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
          >
            {row}
          </div>
        ))
      )}
    </div>
  );
}

function TableCell({ children }: { children?: React.ReactNode }) {
  return <span className="px-2 py-1 text-xs">{children}</span>;
}

function ActionButtons({
  onAdd,
  onRemove,
  canRemove,
}: {
  onAdd: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1 mt-1.5">
      <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove" onClick={onRemove} disabled={!canRemove}>
        <Minus className="size-3 text-destructive" />
      </Button>
      <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={onAdd}>
        <Plus className="size-3 text-green-600" />
      </Button>
    </div>
  );
}

function IdentityTab() {
  type TDocForm = {
    docType: string; docNumber: string; country: string;
    nameOnDoc: string; nationality: string; genderShown: string;
    status: string; issuingAuth: string;
    issueDate: Date | undefined; origDate: Date | undefined; expiryDate: Date | undefined;
  };

  /* ── Travel Documents ── */
  const [travelDocs, setTravelDocs]   = useState<TravelDoc[]>([]);
  const [tDoc, setTDoc] = useState<TDocForm>({
    docType: '', docNumber: '', country: '', nameOnDoc: '', nationality: '', genderShown: '',
    status: '', issuingAuth: '', issueDate: undefined, origDate: undefined, expiryDate: undefined,
  });
  const [tDocToAustralia, setTDocToAustralia] = useState(false);

  /* ── Citizenships ── */
  const [citizenships, setCitizenships] = useState<Citizenship[]>([]);
  const [cit, setCit] = useState<{
    country: string; type: string;
    dateObtained: Date | undefined; howAcquired: string;
    ceased: boolean; dateCeased: Date | undefined; reason: string;
  }>({ country: '', type: '', dateObtained: undefined, howAcquired: '', ceased: false, dateCeased: undefined, reason: '' });

  /* ── Identity Documents ── */
  const [identityDocs, setIdentityDocs] = useState<IdentityDoc[]>([]);
  const [iDoc, setIDoc] = useState<{
    countryOfIssue: string; issueDate: Date | undefined;
    name: string; expiryDate: Date | undefined;
    type: string; number: string;
  }>({ countryOfIssue: '', issueDate: undefined, name: '', expiryDate: undefined, type: '', number: '' });

  /* ── Residency Rights ── */
  const [residencyRights, setResidencyRights] = useState<ResidencyRight[]>([]);
  const [res, setRes] = useState<{ country: string; dateObtained: Date | undefined; status: string }>({
    country: '', dateObtained: undefined, status: '',
  });

  return (
    <div className="flex flex-col gap-4">

      {/* ── 1. Travel Document Details ── */}
      <SectionBox title="Travel Document Details">
        <div className="flex flex-col gap-2">
          <TableShell
            cols={['Document Number', 'Country', 'Issue Date', 'Expiry Date', 'Issuing Authority', 'Primary Document', 'Status']}
            rows={travelDocs.map((d) => [
              <TableCell key="dn">{d.docNumber}</TableCell>,
              <TableCell key="co">{d.country}</TableCell>,
              <TableCell key="id">{d.issueDate}</TableCell>,
              <TableCell key="ed">{d.expiryDate}</TableCell>,
              <TableCell key="ia">{d.issuingAuth}</TableCell>,
              <TableCell key="pd">{d.primaryDoc ? 'Yes' : ''}</TableCell>,
              <TableCell key="st">{d.status}</TableCell>,
            ])}
          />
          <ActionButtons
            onAdd={() => {
              if (tDoc.docNumber) {
                setTravelDocs((p) => [...p, {
                  docNumber: tDoc.docNumber ?? '',
                  country: tDoc.country ?? '',
                  issueDate: tDoc.issueDate ? format(tDoc.issueDate, 'dd/MM/yyyy') : '',
                  expiryDate: tDoc.expiryDate ? format(tDoc.expiryDate, 'dd/MM/yyyy') : '',
                  issuingAuth: tDoc.issuingAuth ?? '',
                  primaryDoc: false,
                  status: tDoc.status ?? '',
                }]);
                setTDoc({ docType: '', docNumber: '', country: '', nameOnDoc: '', nationality: '', genderShown: '', status: '', issuingAuth: '', issueDate: undefined, origDate: undefined, expiryDate: undefined });
              }
            }}
            onRemove={() => setTravelDocs((p) => p.slice(0, -1))}
            canRemove={travelDocs.length > 0}
          />

          {/* form fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 pt-1 border-t border-border">
            {/* left col */}
            <div className="flex flex-col gap-2">
              <FieldRow label="Document Type">
                <Select onValueChange={(v) => setTDoc((p) => ({ ...p, docType: v }))}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="id-card">National ID Card</SelectItem>
                    <SelectItem value="travel-doc">Travel Document</SelectItem>
                    <SelectItem value="refugee">Refugee Travel Document</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Document Number">
                <Input className="h-7 text-sm" value={tDoc.docNumber ?? ''} onChange={(e) => setTDoc((p) => ({ ...p, docNumber: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Country of Document">
                <CountryCombobox value={tDoc.country} onChange={(v) => setTDoc((p) => ({ ...p, country: v }))} />
              </FieldRow>
              <FieldRow label="Name on Document">
                <Input className="h-7 text-sm" />
              </FieldRow>
              <FieldRow label="Nationality">
                <CountryCombobox
                  value={tDoc.nationality}
                  onChange={(v) => setTDoc((p) => ({ ...p, nationality: v }))}
                  placeholder="Select nationality…"
                />
              </FieldRow>
              <FieldRow label="Gender Shown">
                <Select>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="x">X</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>

            {/* right col */}
            <div className="flex flex-col gap-2">
              <FieldRow label="Status">
                <Select>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Issue Date</span>
                <DatePicker value={tDoc.issueDate} onChange={(d) => setTDoc((p) => ({ ...p, issueDate: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setTDoc((p) => ({ ...p, issueDate: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Orig Date</span>
                <DatePicker value={tDoc.origDate} onChange={(d) => setTDoc((p) => ({ ...p, origDate: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setTDoc((p) => ({ ...p, origDate: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Expiry Date</span>
                <DatePicker value={tDoc.expiryDate} onChange={(d) => setTDoc((p) => ({ ...p, expiryDate: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setTDoc((p) => ({ ...p, expiryDate: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <FieldRow label="Issuing Auth.">
                <Input className="h-7 text-sm" onChange={(e) => setTDoc((p) => ({ ...p, issuingAuth: e.target.value }))} />
              </FieldRow>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Document to Enter Australia</span>
                <Checkbox checked={tDocToAustralia} onCheckedChange={(v) => setTDocToAustralia(!!v)} />
              </div>
            </div>
          </div>
        </div>
      </SectionBox>

      {/* ── 2. Citizenships - Obtained & Refused ── */}
      <SectionBox title="Citizenships — Obtained &amp; Refused">
        <div className="flex flex-col gap-2">
          <TableShell
            cols={['Country', 'Obtained/Refu.', 'Date Obtained', 'Reason', 'Ceased', 'Date Ceased', 'Reason Ceased']}
            rows={citizenships.map((c) => [
              <TableCell key="co">{c.country}</TableCell>,
              <TableCell key="or">{c.obtainedRefused}</TableCell>,
              <TableCell key="do">{c.dateObtained}</TableCell>,
              <TableCell key="re">{c.reason}</TableCell>,
              <TableCell key="ce">{c.ceased ? 'Yes' : ''}</TableCell>,
              <TableCell key="dc">{c.dateCeased}</TableCell>,
              <TableCell key="rc">{c.reasonCeased}</TableCell>,
            ])}
          />
          <ActionButtons
            onAdd={() => {
              if (cit.country) {
                setCitizenships((p) => [...p, {
                  country: cit.country,
                  obtainedRefused: cit.type,
                  dateObtained: cit.dateObtained ? format(cit.dateObtained, 'dd/MM/yyyy') : '',
                  reason: cit.reason,
                  ceased: cit.ceased,
                  dateCeased: cit.dateCeased ? format(cit.dateCeased, 'dd/MM/yyyy') : '',
                  reasonCeased: '',
                }]);
                setCit({ country: '', type: '', dateObtained: undefined, howAcquired: '', ceased: false, dateCeased: undefined, reason: '' });
              }
            }}
            onRemove={() => setCitizenships((p) => p.slice(0, -1))}
            canRemove={citizenships.length > 0}
          />

          {/* form fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 pt-1 border-t border-border">
            <div className="flex flex-col gap-2">
              <FieldRow label="Country">
                <CountryCombobox value={cit.country} onChange={(v) => setCit((p) => ({ ...p, country: v }))} />
              </FieldRow>
              <FieldRow label="Type">
                <Select value={cit.type} onValueChange={(v) => setCit((p) => ({ ...p, type: v }))}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obtained">Obtained</SelectItem>
                    <SelectItem value="refused">Refused</SelectItem>
                    <SelectItem value="renounced">Renounced</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Ceased</span>
                <Checkbox checked={cit.ceased} onCheckedChange={(v) => setCit((p) => ({ ...p, ceased: !!v }))} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Date Obtained</span>
                <DatePicker value={cit.dateObtained} onChange={(d) => setCit((p) => ({ ...p, dateObtained: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setCit((p) => ({ ...p, dateObtained: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <FieldRow label="How Acquired">
                <Input className="h-7 text-sm" value={cit.howAcquired} onChange={(e) => setCit((p) => ({ ...p, howAcquired: e.target.value }))} />
              </FieldRow>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Date Ceased</span>
                <DatePicker value={cit.dateCeased} onChange={(d) => setCit((p) => ({ ...p, dateCeased: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setCit((p) => ({ ...p, dateCeased: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <FieldRow label="Reason">
                <Input className="h-7 text-sm" value={cit.reason} onChange={(e) => setCit((p) => ({ ...p, reason: e.target.value }))} />
              </FieldRow>
            </div>
          </div>
        </div>
      </SectionBox>

      {/* ── 3. Identity Documents and Numbers ── */}
      <SectionBox title="Identity Documents and Numbers">
        <div className="flex flex-col gap-2">
          <TableShell
            cols={['Type', 'Country', 'Number', 'Given Names', 'Surname', 'Issue Date', 'Expiry Date']}
            rows={identityDocs.map((d) => [
              <TableCell key="ty">{d.type}</TableCell>,
              <TableCell key="co">{d.country}</TableCell>,
              <TableCell key="nu">{d.number}</TableCell>,
              <TableCell key="gn">{d.givenNames}</TableCell>,
              <TableCell key="su">{d.surname}</TableCell>,
              <TableCell key="id">{d.issueDate}</TableCell>,
              <TableCell key="ed">{d.expiryDate}</TableCell>,
            ])}
          />
          <ActionButtons
            onAdd={() => {
              if (iDoc.type || iDoc.number) {
                setIdentityDocs((p) => [...p, {
                  type: iDoc.type,
                  country: iDoc.countryOfIssue,
                  number: iDoc.number,
                  givenNames: '',
                  surname: '',
                  issueDate: iDoc.issueDate ? format(iDoc.issueDate, 'dd/MM/yyyy') : '',
                  expiryDate: iDoc.expiryDate ? format(iDoc.expiryDate, 'dd/MM/yyyy') : '',
                }]);
                setIDoc({ countryOfIssue: '', issueDate: undefined, name: '', expiryDate: undefined, type: '', number: '' });
              }
            }}
            onRemove={() => setIdentityDocs((p) => p.slice(0, -1))}
            canRemove={identityDocs.length > 0}
          />

          {/* form fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 pt-1 border-t border-border">
            <div className="flex flex-col gap-2">
              <FieldRow label="Country of Issue">
                <CountryCombobox value={iDoc.countryOfIssue} onChange={(v) => setIDoc((p) => ({ ...p, countryOfIssue: v }))} />
              </FieldRow>
              <FieldRow label="Name">
                <Input className="h-7 text-sm" value={iDoc.name} onChange={(e) => setIDoc((p) => ({ ...p, name: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Type">
                <Select value={iDoc.type} onValueChange={(v) => setIDoc((p) => ({ ...p, type: v }))}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birth-cert">Birth Certificate</SelectItem>
                    <SelectItem value="drivers-licence">Driver's Licence</SelectItem>
                    <SelectItem value="national-id">National ID</SelectItem>
                    <SelectItem value="medicare">Medicare Card</SelectItem>
                    <SelectItem value="tax-id">Tax ID</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Number">
                <Input className="h-7 text-sm" value={iDoc.number} onChange={(e) => setIDoc((p) => ({ ...p, number: e.target.value }))} />
              </FieldRow>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Issue Date</span>
                <DatePicker value={iDoc.issueDate} onChange={(d) => setIDoc((p) => ({ ...p, issueDate: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setIDoc((p) => ({ ...p, issueDate: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Expiry Date</span>
                <DatePicker value={iDoc.expiryDate} onChange={(d) => setIDoc((p) => ({ ...p, expiryDate: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setIDoc((p) => ({ ...p, expiryDate: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionBox>

      {/* ── 4. Residency Rights ── */}
      <SectionBox title="Residency Rights">
        <div className="flex flex-col gap-2">
          <TableShell
            cols={['Country', 'Status', 'Date Obtained']}
            rows={residencyRights.map((r) => [
              <TableCell key="co">{r.country}</TableCell>,
              <TableCell key="st">{r.status}</TableCell>,
              <TableCell key="do">{r.dateObtained}</TableCell>,
            ])}
          />
          <ActionButtons
            onAdd={() => {
              if (res.country) {
                setResidencyRights((p) => [...p, {
                  country: res.country,
                  status: res.status,
                  dateObtained: res.dateObtained ? format(res.dateObtained, 'dd/MM/yyyy') : '',
                }]);
                setRes({ country: '', dateObtained: undefined, status: '' });
              }
            }}
            onRemove={() => setResidencyRights((p) => p.slice(0, -1))}
            canRemove={residencyRights.length > 0}
          />

          {/* form fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 pt-1 border-t border-border">
            <div className="flex flex-col gap-2">
              <FieldRow label="Country">
                <CountryCombobox value={res.country} onChange={(v) => setRes((p) => ({ ...p, country: v }))} />
              </FieldRow>
              <FieldRow label="Status">
                <Select value={res.status} onValueChange={(v) => setRes((p) => ({ ...p, status: v }))}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent Resident</SelectItem>
                    <SelectItem value="temporary">Temporary Resident</SelectItem>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Date Obtained</span>
                <DatePicker value={res.dateObtained} onChange={(d) => setRes((p) => ({ ...p, dateObtained: d }))} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setRes((p) => ({ ...p, dateObtained: undefined }))}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

/* ─────────────────────────── Addresses tab ─────────────────────────── */

type AddressRow = {
  country: string;
  from: string;
  to: string;
  unitNo: string;
  street1: string;
  street2: string;
  suburb: string;
  town: string;
  state: string;
  postcode: string;
  legalStatus: string;
  notes: string;
};

type AddressForm = {
  unitNo: string;
  street: string;
  street2: string;
  suburb: string;
  town: string;
  state: string;
  postcode: string;
  country: string;
  from: Date | undefined;
  to: Date | undefined;
  status: string;
  notes: string;
  displayFor: string;
};

function AddressesTab() {
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [form, setForm] = useState<AddressForm>({
    unitNo: '', street: '', street2: '', suburb: '', town: '',
    state: '', postcode: '', country: '', from: undefined, to: undefined,
    status: '', notes: '', displayFor: '',
  });

  const set = (field: keyof AddressForm, value: string | Date | undefined) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleAdd = () => {
    setRows((p) => [
      ...p,
      {
        country: COUNTRIES.find((c) => c.code === form.country)?.name ?? form.country,
        from: form.from ? format(form.from, 'dd/MM/yyyy') : '',
        to: form.to ? format(form.to, 'dd/MM/yyyy') : '',
        unitNo: form.unitNo,
        street1: form.street,
        street2: form.street2,
        suburb: form.suburb,
        town: form.town,
        state: form.state,
        postcode: form.postcode,
        legalStatus: form.status,
        notes: form.notes,
      },
    ]);
    setForm({ unitNo: '', street: '', street2: '', suburb: '', town: '', state: '', postcode: '', country: '', from: undefined, to: undefined, status: '', notes: '', displayFor: '' });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Table ── */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="bg-accent/60 border-b border-border">
                {['Country','From','To','Unit No.','Street 1','Street 2','Suburb','Town','State','Postcode','Legal Status','Notes'].map((h) => (
                  <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={12} className="h-40 bg-muted/30" /></tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="px-2 py-1">{r.country}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{r.from}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{r.to}</td>
                    <td className="px-2 py-1">{r.unitNo}</td>
                    <td className="px-2 py-1">{r.street1}</td>
                    <td className="px-2 py-1">{r.street2}</td>
                    <td className="px-2 py-1">{r.suburb}</td>
                    <td className="px-2 py-1">{r.town}</td>
                    <td className="px-2 py-1">{r.state}</td>
                    <td className="px-2 py-1">{r.postcode}</td>
                    <td className="px-2 py-1">{r.legalStatus}</td>
                    <td className="px-2 py-1">{r.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center justify-end gap-1">
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove last" onClick={() => setRows((p) => p.slice(0, -1))} disabled={rows.length === 0}>
          <Minus className="size-3 text-destructive" />
        </Button>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={handleAdd}>
          <Plus className="size-3 text-green-600" />
        </Button>
      </div>

      {/* ── Form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0 pt-2 border-t border-border">

        {/* Left column */}
        <div className="flex flex-col gap-2">
          {/* Unit No + Street */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Unit No.</span>
            <Input
              className="h-7 text-sm w-24 shrink-0"
              placeholder="Unit"
              value={form.unitNo}
              onChange={(e) => set('unitNo', e.target.value)}
            />
            <span className="text-sm text-secondary-foreground shrink-0">Street</span>
            <Input
              className="h-7 text-sm flex-1"
              placeholder="Street"
              value={form.street}
              onChange={(e) => set('street', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Street 2</span>
            <Input
              className="h-7 text-sm flex-1"
              placeholder="Street 2"
              value={form.street2}
              onChange={(e) => set('street2', e.target.value)}
            />
          </div>

          {/* Suburb + Town/City */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Suburb</span>
            <Input
              className="h-7 text-sm flex-1"
              placeholder="Suburb"
              value={form.suburb}
              onChange={(e) => set('suburb', e.target.value)}
            />
            <span className="text-sm text-secondary-foreground shrink-0">Town/City</span>
            <Input
              className="h-7 text-sm flex-1"
              placeholder="Town/City"
              value={form.town}
              onChange={(e) => set('town', e.target.value)}
            />
          </div>

          {/* State + Postcode */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">State</span>
            <Input
              className="h-7 text-sm flex-1"
              placeholder="State"
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
            />
            <span className="text-sm text-secondary-foreground shrink-0">Postcode</span>
            <Input
              className="h-7 text-sm w-28"
              placeholder="Postcode"
              value={form.postcode}
              onChange={(e) => set('postcode', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Country</span>
            <div className="flex-1">
              <CountryCombobox
                value={form.country}
                onChange={(v) => set('country', v)}
                placeholder="Select country…"
              />
            </div>
          </div>

          {/* From */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">From</span>
            <DatePicker value={form.from} onChange={(d) => set('from', d)} />
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('from', undefined)}>
              <RotateCcw className="size-3 mr-1" />Reset
            </Button>
          </div>

          {/* To */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">To</span>
            <DatePicker value={form.to} onChange={(d) => set('to', d)} />
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('to', undefined)}>
              <RotateCcw className="size-3 mr-1" />Reset
            </Button>
          </div>

          <div className="flex items-center gap-2 min-h-[28px]">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Status</span>
            <div className="flex-1">
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="previous">Previous</SelectItem>
                  <SelectItem value="mailing">Mailing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2">
          <FieldRow label="Notes">
            <textarea
              className="w-full min-h-[120px] rounded-md border border-border bg-background px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Notes…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </FieldRow>

          {/* Display Addresses For */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-sm text-secondary-foreground">Display Addresses For…</span>
            <div className="flex items-center gap-2">
              <Select value={form.displayFor} onValueChange={(v) => set('displayFor', v)}>
                <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="mailing">Mailing</SelectItem>
                  <SelectItem value="overseas">Overseas</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-7 px-4 text-xs">Go</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Employment tab ─────────────────────────── */

type EmploymentRow = {
  status: string;
  employerName: string;
  current: boolean;
  startDate: string;
  endDate: string;
  businessType: string;
  position: string;
  country: string;
};

type EmploymentForm = {
  employmentStatus: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentEmployment: boolean;
  requiredStart: Date | undefined;
  mandatoryEnd: Date | undefined;
  trackDates: boolean;
  employerName: string;
  industry: string;
  employerStreet: string;
  street2: string;
  type: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  position: string;
  anzscoCode: string;
  anzscoDescription: string;
  duties: string;
  hoursPerWeek: string;
  wklyEarnings: string;
  contact: string;
  usualOccupation: string;
  occupationIndustry: string;
  currentSalary: string;
  salaryPer: string;
  currency: string;
};

function EmploymentTab() {
  const [rows, setRows] = useState<EmploymentRow[]>([]);
  const [form, setForm] = useState<EmploymentForm>({
    employmentStatus: '',
    startDate: undefined, endDate: undefined, currentEmployment: false,
    requiredStart: undefined, mandatoryEnd: undefined, trackDates: false,
    employerName: '', industry: '', employerStreet: '', street2: '', type: '',
    city: '', state: '', postcode: '', country: '',
    position: '', anzscoCode: '', anzscoDescription: '', duties: '',
    hoursPerWeek: '', wklyEarnings: '', contact: '',
    usualOccupation: '', occupationIndustry: '',
    currentSalary: '', salaryPer: '', currency: '',
  });

  const set = (field: keyof EmploymentForm, value: string | boolean | Date | undefined) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleAdd = () => {
    if (!form.employerName && !form.employmentStatus) return;
    setRows((p) => [
      ...p,
      {
        status: form.employmentStatus,
        employerName: form.employerName,
        current: form.currentEmployment,
        startDate: form.startDate ? format(form.startDate, 'dd/MM/yyyy') : '',
        endDate: form.endDate ? format(form.endDate, 'dd/MM/yyyy') : '',
        businessType: form.type,
        position: form.position,
        country: COUNTRIES.find((c) => c.code === form.country)?.name ?? form.country,
      },
    ]);
    setForm({
      employmentStatus: '', startDate: undefined, endDate: undefined, currentEmployment: false,
      requiredStart: undefined, mandatoryEnd: undefined, trackDates: false,
      employerName: '', industry: '', employerStreet: '', street2: '', type: '',
      city: '', state: '', postcode: '', country: '',
      position: '', anzscoCode: '', anzscoDescription: '', duties: '',
      hoursPerWeek: '', wklyEarnings: '', contact: '',
      usualOccupation: '', occupationIndustry: '',
      currentSalary: '', salaryPer: '', currency: '',
    });
  };

  const LBL = 'w-36';

  return (
    <div className="flex flex-col gap-4">

      {/* ── Table ── */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="bg-accent/60 border-b border-border">
                {['Status','Employer Name','Current','Start Date','End Date','Business Type','Position','Country'].map((h) => (
                  <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={8} className="h-28 bg-muted/30" /></tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="px-2 py-1">{r.status}</td>
                    <td className="px-2 py-1">{r.employerName}</td>
                    <td className="px-2 py-1">{r.current ? 'Yes' : ''}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{r.startDate}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{r.endDate}</td>
                    <td className="px-2 py-1">{r.businessType}</td>
                    <td className="px-2 py-1">{r.position}</td>
                    <td className="px-2 py-1">{r.country}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center justify-end gap-1">
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove last" onClick={() => setRows((p) => p.slice(0, -1))} disabled={rows.length === 0}>
          <Minus className="size-3 text-destructive" />
        </Button>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={handleAdd}>
          <Plus className="size-3 text-green-600" />
        </Button>
      </div>

      {/* ── Detail section ── */}
      <SectionBox title="Employment and Unemployment History Detail">
        <div className="flex flex-col gap-2">

          {/* Employment Status */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Employment Status</span>
            <div className="w-52">
              <Select value={form.employmentStatus} onValueChange={(v) => set('employmentStatus', v)}>
                <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="home-duties">Home Duties</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-border pt-2 mt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Employment Details</p>

            {/* Row: Start Date | End Date | Current Employment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Start Date</span>
                <DatePicker value={form.startDate} onChange={(d) => set('startDate', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('startDate', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>End Date</span>
                <DatePicker value={form.endDate} onChange={(d) => set('endDate', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('endDate', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.currentEmployment} onCheckedChange={(v) => set('currentEmployment', !!v)} id="current-emp" />
                <label htmlFor="current-emp" className="text-sm text-secondary-foreground cursor-pointer">Current Employment</label>
              </div>
            </div>

            {/* Row: Required Start | Mandatory End | Track Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Required Start</span>
                <DatePicker value={form.requiredStart} onChange={(d) => set('requiredStart', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('requiredStart', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Mandatory End</span>
                <DatePicker value={form.mandatoryEnd} onChange={(d) => set('mandatoryEnd', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => set('mandatoryEnd', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.trackDates} onCheckedChange={(v) => set('trackDates', !!v)} id="track-dates" />
                <label htmlFor="track-dates" className="text-sm text-secondary-foreground cursor-pointer">Track Dates in Snapshot</label>
              </div>
            </div>

            {/* Row: Employer Name | Industry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Employer Name</span>
                <Input className="h-7 text-sm flex-1" value={form.employerName} onChange={(e) => set('employerName', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Industry</span>
                <div className="flex-1">
                  <Select value={form.industry} onValueChange={(v) => set('industry', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="mining">Mining</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Row: Employer Street Address | Street 2 | Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Employer Street Address</span>
                <Input className="h-7 text-sm flex-1" value={form.employerStreet} onChange={(e) => set('employerStreet', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Street 2</span>
                <Input className="h-7 text-sm flex-1" value={form.street2} onChange={(e) => set('street2', e.target.value)} />
                <span className="text-sm text-secondary-foreground shrink-0 ml-2">Type</span>
                <div className="w-32">
                  <Select value={form.type} onValueChange={(v) => set('type', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Row: City | State | Postcode | Country */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>City</span>
              <Input className="h-7 text-sm w-32" value={form.city} onChange={(e) => set('city', e.target.value)} />
              <span className="text-sm text-secondary-foreground shrink-0">State</span>
              <Input className="h-7 text-sm w-32" value={form.state} onChange={(e) => set('state', e.target.value)} />
              <span className="text-sm text-secondary-foreground shrink-0">Postcode</span>
              <Input className="h-7 text-sm w-24" value={form.postcode} onChange={(e) => set('postcode', e.target.value)} />
              <span className="text-sm text-secondary-foreground shrink-0">Country</span>
              <div className="flex-1">
                <CountryCombobox value={form.country} onChange={(v) => set('country', v)} placeholder="Select…" />
              </div>
            </div>

            {/* Row: Position | ANZSCO Code + Lookup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Position</span>
                <Input className="h-7 text-sm flex-1" value={form.position} onChange={(e) => set('position', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">ANZSCO Code</span>
                <Input className="h-7 text-sm flex-1" value={form.anzscoCode} onChange={(e) => set('anzscoCode', e.target.value)} />
                <Button variant="ghost" size="sm" className="h-7 text-xs px-1 text-primary shrink-0 underline underline-offset-2">Lookup</Button>
              </div>
            </div>

            {/* Row: Duties | ANZSCO Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Duties</span>
                <Input className="h-7 text-sm flex-1" value={form.duties} onChange={(e) => set('duties', e.target.value)} />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-secondary-foreground shrink-0 pt-1">ANZSCO Description</span>
                <textarea
                  className="flex-1 min-h-[56px] rounded-md border border-border bg-background px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.anzscoDescription}
                  onChange={(e) => set('anzscoDescription', e.target.value)}
                />
              </div>
            </div>

            {/* Row: Hours per Week | Wkly Earnings Local Currency */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Hours per Week</span>
              <Input className="h-7 text-sm w-24" value={form.hoursPerWeek} onChange={(e) => set('hoursPerWeek', e.target.value)} />
              <span className="text-sm text-secondary-foreground shrink-0 ml-4">Wkly Earnings Local Currency</span>
              <Input className="h-7 text-sm w-36" value={form.wklyEarnings} onChange={(e) => set('wklyEarnings', e.target.value)} />
            </div>

            {/* Row: Contact */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Contact</span>
              <Input className="h-7 text-sm flex-1" value={form.contact} onChange={(e) => set('contact', e.target.value)} />
            </div>
          </div>

          {/* ── Bottom strip ── */}
          <div className="border-t border-border pt-2 mt-1 flex flex-col gap-2">
            {/* Usual Occupation | Industry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Usual Occupation</span>
                <div className="flex-1">
                  <Select value={form.usualOccupation} onValueChange={(v) => set('usualOccupation', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="clerical">Clerical</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="labourer">Labourer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Industry</span>
                <div className="flex-1">
                  <Select value={form.occupationIndustry} onValueChange={(v) => set('occupationIndustry', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Current Salary | per | Currency */}
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Current Salary</span>
              <Input className="h-7 text-sm w-36" value={form.currentSalary} onChange={(e) => set('currentSalary', e.target.value)} />
              <span className="text-sm text-secondary-foreground shrink-0">per</span>
              <div className="w-28">
                <Select value={form.salaryPer} onValueChange={(v) => set('salaryPer', v)}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="fortnight">Fortnight</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-secondary-foreground shrink-0">Currency</span>
              <div className="w-40">
                <Select value={form.currency} onValueChange={(v) => set('currency', v)}>
                  <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aud">AUD — Australian Dollar</SelectItem>
                    <SelectItem value="usd">USD — US Dollar</SelectItem>
                    <SelectItem value="gbp">GBP — British Pound</SelectItem>
                    <SelectItem value="eur">EUR — Euro</SelectItem>
                    <SelectItem value="nzd">NZD — New Zealand Dollar</SelectItem>
                    <SelectItem value="cad">CAD — Canadian Dollar</SelectItem>
                    <SelectItem value="inr">INR — Indian Rupee</SelectItem>
                    <SelectItem value="cny">CNY — Chinese Yuan</SelectItem>
                    <SelectItem value="jpy">JPY — Japanese Yen</SelectItem>
                    <SelectItem value="sgd">SGD — Singapore Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </div>
      </SectionBox>
    </div>
  );
}

/* ─────────────────────────── Education tab ─────────────────────────── */

type QualificationRow = {
  startDate: string; endDate: string; qualification: string; category: string;
  field: string; sciBusTech: string; courseName: string;
  studyMode: string; language: string; status: string;
};

type QualificationForm = {
  startDate: Date | undefined; endDate: Date | undefined;
  qualification: string; category: string; field: string;
  sciBusTech: string; courseName: string;
  studyMode: string; language: string; status: string;
};

type OccRegRow = {
  grantingAuthority: string; typeOfReg: string; occupation: string;
  country: string; state: string; licenceNumber: string;
  dateIssued: string; dateExpired: string;
  englishLanguage: boolean; englishLangReq: string; endBme: string;
};

type OccRegForm = {
  grantingAuthority: string; typeOfReg: string; occupation: string;
  country: string; state: string; licenceNumber: string;
  dateIssued: Date | undefined; dateExpired: Date | undefined;
  englishLanguage: boolean; englishLangReq: string; endBme: string;
};

function EducationTab() {
  const LBL = 'w-40';

  /* ── Qualifications ── */
  const [qualRows, setQualRows] = useState<QualificationRow[]>([]);
  const [qual, setQual] = useState<QualificationForm>({
    startDate: undefined, endDate: undefined,
    qualification: '', category: '', field: '', sciBusTech: '',
    courseName: '', studyMode: '', language: '', status: '',
  });
  const setQ = (f: keyof QualificationForm, v: string | boolean | Date | undefined) =>
    setQual((p) => ({ ...p, [f]: v }));

  const EMPTY_QUAL: QualificationForm = {
    startDate: undefined, endDate: undefined,
    qualification: '', category: '', field: '', sciBusTech: '',
    courseName: '', studyMode: '', language: '', status: '',
  };

  /* ── Occupational Registrations ── */
  const [occRows, setOccRows] = useState<OccRegRow[]>([]);
  const [occ, setOcc] = useState<OccRegForm>({
    grantingAuthority: '', typeOfReg: '', occupation: '',
    country: '', state: '', licenceNumber: '',
    dateIssued: undefined, dateExpired: undefined,
    englishLanguage: false, englishLangReq: '', endBme: '',
  });
  const setO = (f: keyof OccRegForm, v: string | boolean | Date | undefined) =>
    setOcc((p) => ({ ...p, [f]: v }));

  const EMPTY_OCC: OccRegForm = {
    grantingAuthority: '', typeOfReg: '', occupation: '',
    country: '', state: '', licenceNumber: '',
    dateIssued: undefined, dateExpired: undefined,
    englishLanguage: false, englishLangReq: '', endBme: '',
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ══ QUALIFICATIONS ══ */}
      <SectionBox title="Qualifications">
        <div className="flex flex-col gap-3">

          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[1000px]">
                <thead>
                  <tr className="bg-accent/60 border-b border-border">
                    {['Start Date','End Date','Qualification','Category','Field','Science, Business or Technology','Course Name','Study Mode','Language','Status'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qualRows.length === 0 ? (
                    <tr><td colSpan={10} className="h-28 bg-muted/30" /></tr>
                  ) : (
                    qualRows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-2 py-1 whitespace-nowrap">{r.startDate}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.endDate}</td>
                        <td className="px-2 py-1">{r.qualification}</td>
                        <td className="px-2 py-1">{r.category}</td>
                        <td className="px-2 py-1">{r.field}</td>
                        <td className="px-2 py-1">{r.sciBusTech}</td>
                        <td className="px-2 py-1">{r.courseName}</td>
                        <td className="px-2 py-1">{r.studyMode}</td>
                        <td className="px-2 py-1">{r.language}</td>
                        <td className="px-2 py-1">{r.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Remove */}
          <div className="flex items-center justify-end gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 gap-1"
              onClick={() => setQualRows((p) => p.slice(0, -1))} disabled={qualRows.length === 0}>
              <Minus className="size-3 text-destructive" />More
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 gap-1"
              onClick={() => {
                setQualRows((p) => [...p, {
                  startDate: qual.startDate ? format(qual.startDate, 'dd/MM/yyyy') : '',
                  endDate: qual.endDate ? format(qual.endDate, 'dd/MM/yyyy') : '',
                  qualification: qual.qualification, category: qual.category,
                  field: qual.field, sciBusTech: qual.sciBusTech,
                  courseName: qual.courseName, studyMode: qual.studyMode,
                  language: qual.language, status: qual.status,
                }]);
                setQual(EMPTY_QUAL);
              }}>
              <Plus className="size-3 text-green-600" />Add
            </Button>
          </div>

          {/* Form */}
          <div className="border-t border-border pt-3 flex flex-col gap-2">

            {/* Start Date | End Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Start Date</span>
                <DatePicker value={qual.startDate} onChange={(d) => setQ('startDate', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setQ('startDate', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>End Date</span>
                <DatePicker value={qual.endDate} onChange={(d) => setQ('endDate', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setQ('endDate', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
            </div>

            {/* Qualification | Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Qualification</span>
                <div className="flex-1">
                  <Select value={qual.qualification} onValueChange={(v) => setQ('qualification', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phd">PhD / Doctorate</SelectItem>
                      <SelectItem value="masters">Masters Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor Degree</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="cert">Certificate</SelectItem>
                      <SelectItem value="trade">Trade Qualification</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Category</span>
                <div className="flex-1">
                  <Select value={qual.category} onValueChange={(v) => setQ('category', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="vocational">Vocational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Field | Science, Business or Technology */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Field</span>
                <Input className="h-7 text-sm flex-1" value={qual.field} onChange={(e) => setQ('field', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Science, Business or Technology</span>
                <div className="flex-1">
                  <Select value={qual.sciBusTech} onValueChange={(v) => setQ('sciBusTech', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Course Name | Study Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Course Name</span>
                <Input className="h-7 text-sm flex-1" value={qual.courseName} onChange={(e) => setQ('courseName', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Study Mode</span>
                <div className="flex-1">
                  <Select value={qual.studyMode} onValueChange={(v) => setQ('studyMode', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="distance">Distance / Online</SelectItem>
                      <SelectItem value="block">Block Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Language | Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Language</span>
                <div className="flex-1">
                  <Select value={qual.language} onValueChange={(v) => setQ('language', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="mandarin">Mandarin</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Status</span>
                <div className="flex-1">
                  <Select value={qual.status} onValueChange={(v) => setQ('status', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="deferred">Deferred</SelectItem>
                      <SelectItem value="not-completed">Not Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionBox>

      {/* ══ OCCUPATIONAL REGISTRATIONS / LICENCES / MEMBERSHIPS ══ */}
      <SectionBox title="Occupational Registrations / Licences / Memberships">
        <div className="flex flex-col gap-3">

          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[1100px]">
                <thead>
                  <tr className="bg-accent/60 border-b border-border">
                    {['Granting Authority','Type Of Reg/Licence/Membership','Occupation','Country','State','Licence Number','Date Issued','Date Expired','English Language','English Language Requirements','End/Bme'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {occRows.length === 0 ? (
                    <tr><td colSpan={11} className="h-28 bg-muted/30" /></tr>
                  ) : (
                    occRows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-2 py-1">{r.grantingAuthority}</td>
                        <td className="px-2 py-1">{r.typeOfReg}</td>
                        <td className="px-2 py-1">{r.occupation}</td>
                        <td className="px-2 py-1">{r.country}</td>
                        <td className="px-2 py-1">{r.state}</td>
                        <td className="px-2 py-1">{r.licenceNumber}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.dateIssued}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.dateExpired}</td>
                        <td className="px-2 py-1">{r.englishLanguage ? 'Yes' : ''}</td>
                        <td className="px-2 py-1">{r.englishLangReq}</td>
                        <td className="px-2 py-1">{r.endBme}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Remove */}
          <div className="flex items-center justify-end gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 gap-1"
              onClick={() => setOccRows((p) => p.slice(0, -1))} disabled={occRows.length === 0}>
              <Minus className="size-3 text-destructive" />More
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-3 gap-1"
              onClick={() => {
                setOccRows((p) => [...p, {
                  grantingAuthority: occ.grantingAuthority,
                  typeOfReg: occ.typeOfReg,
                  occupation: occ.occupation,
                  country: COUNTRIES.find((c) => c.code === occ.country)?.name ?? occ.country,
                  state: occ.state,
                  licenceNumber: occ.licenceNumber,
                  dateIssued: occ.dateIssued ? format(occ.dateIssued, 'dd/MM/yyyy') : '',
                  dateExpired: occ.dateExpired ? format(occ.dateExpired, 'dd/MM/yyyy') : '',
                  englishLanguage: occ.englishLanguage,
                  englishLangReq: occ.englishLangReq,
                  endBme: occ.endBme,
                }]);
                setOcc(EMPTY_OCC);
              }}>
              <Plus className="size-3 text-green-600" />Add
            </Button>
          </div>

          {/* Form */}
          <div className="border-t border-border pt-3 flex flex-col gap-2">

            {/* Granting Authority | Type Of Reg/Licence/Membership */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Granting Authority</span>
                <Input className="h-7 text-sm flex-1" value={occ.grantingAuthority} onChange={(e) => setO('grantingAuthority', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Type Of Reg/Licence/Membership</span>
                <div className="flex-1">
                  <Select value={occ.typeOfReg} onValueChange={(v) => setO('typeOfReg', v)}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration">Registration</SelectItem>
                      <SelectItem value="licence">Licence</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Occupation | Country | State */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Occupation</span>
                <Input className="h-7 text-sm flex-1" value={occ.occupation} onChange={(e) => setO('occupation', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Country</span>
                <div className="flex-1">
                  <CountryCombobox value={occ.country} onChange={(v) => setO('country', v)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>State</span>
                <Input className="h-7 text-sm flex-1" value={occ.state} onChange={(e) => setO('state', e.target.value)} />
              </div>
            </div>

            {/* Licence Number | Date Issued | Date Expired */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Licence Number</span>
                <Input className="h-7 text-sm flex-1" value={occ.licenceNumber} onChange={(e) => setO('licenceNumber', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Date Issued</span>
                <DatePicker value={occ.dateIssued} onChange={(d) => setO('dateIssued', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setO('dateIssued', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>Date Expired</span>
                <DatePicker value={occ.dateExpired} onChange={(d) => setO('dateExpired', d)} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setO('dateExpired', undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
            </div>

            {/* English Language | English Language Requirements | End/Bme */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>English Language</span>
                <Checkbox checked={occ.englishLanguage} onCheckedChange={(v) => setO('englishLanguage', !!v)} id="eng-lang" />
                <label htmlFor="eng-lang" className="text-sm text-secondary-foreground cursor-pointer">Required</label>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>English Language Requirements</span>
                <Input className="h-7 text-sm flex-1" value={occ.englishLangReq} onChange={(e) => setO('englishLangReq', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm text-secondary-foreground text-right shrink-0 ${LBL}`}>End/Bme</span>
                <Input className="h-7 text-sm flex-1" value={occ.endBme} onChange={(e) => setO('endBme', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

/* ─────────────────────────── Language tab ─────────────────────────── */

type LangSkillRow = {
  language: string;
  proficiency: string;
  mainLanguage: boolean;
};

type LangTestRow = {
  testType: string;
  date: string;
  location: string;
  certificateNo: string;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  overall: string;
};

type LangTestForm = {
  testType: string;
  testDate: Date | undefined;
  testLocation: string;
  certificateNo: string;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  overall: string;
};

function LanguageTab() {
  /* ── Language Skills ── */
  const [langRows, setLangRows] = useState<LangSkillRow[]>([]);
  const [langLanguage, setLangLanguage] = useState('');
  const [langProficiency, setLangProficiency] = useState('');
  const [langMain, setLangMain] = useState(false);

  const resetLangForm = () => {
    setLangLanguage('');
    setLangProficiency('');
    setLangMain(false);
  };

  /* ── English Language Tests ── */
  const [testRows, setTestRows] = useState<LangTestRow[]>([]);
  const [test, setTest] = useState<LangTestForm>({
    testType: '', testDate: undefined, testLocation: '',
    certificateNo: '', listening: '', reading: '', writing: '', speaking: '', overall: '',
  });
  const setT = (f: keyof LangTestForm, v: string | Date | undefined) =>
    setTest((p) => ({ ...p, [f]: v }));

  const EMPTY_TEST: LangTestForm = {
    testType: '', testDate: undefined, testLocation: '',
    certificateNo: '', listening: '', reading: '', writing: '', speaking: '', overall: '',
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ══ LANGUAGE SKILLS ══ */}
      <SectionBox title="Language Skills">
        <div className="flex flex-col gap-3">

          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-accent/60 border-b border-border">
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Language</th>
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Proficiency</th>
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Main Language</th>
                  </tr>
                </thead>
                <tbody>
                  {langRows.length === 0 ? (
                    <tr><td colSpan={3} className="h-24 bg-muted/30" /></tr>
                  ) : (
                    langRows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-2 py-1">{r.language}</td>
                        <td className="px-2 py-1">{r.proficiency}</td>
                        <td className="px-2 py-1">{r.mainLanguage ? 'Yes' : ''}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inline form row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0">Language</span>
              <Input
                className="h-7 text-sm w-44"
                value={langLanguage}
                onChange={(e) => setLangLanguage(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0">Proficiency</span>
              <Select value={langProficiency} onValueChange={setLangProficiency}>
                <SelectTrigger className="h-7 text-sm w-44"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="upper-intermediate">Upper-Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="proficient">Proficient / Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="lang-main"
                checked={langMain}
                onCheckedChange={(v) => setLangMain(!!v)}
              />
              <label htmlFor="lang-main" className="text-sm text-secondary-foreground cursor-pointer">
                This language is this person&apos;s main language
              </label>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant="outline" size="sm" className="h-7 w-7 p-0"
                onClick={() => setLangRows((p) => p.slice(0, -1))}
                disabled={langRows.length === 0}
              >
                <Minus className="size-3 text-destructive" />
              </Button>
              <Button
                variant="outline" size="sm" className="h-7 w-7 p-0"
                onClick={() => {
                  if (!langLanguage) return;
                  setLangRows((p) => [...p, { language: langLanguage, proficiency: langProficiency, mainLanguage: langMain }]);
                  resetLangForm();
                }}
              >
                <Plus className="size-3 text-green-600" />
              </Button>
            </div>
          </div>
        </div>
      </SectionBox>

      {/* ══ ENGLISH LANGUAGE TESTS ══ */}
      <SectionBox title="English Language Tests">
        <div className="flex flex-col gap-3">

          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-accent/60 border-b border-border">
                    {['Test Type','Date','Location','Certificate No.','Listening','Reading','Writing','Speaking','Overall'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testRows.length === 0 ? (
                    <tr><td colSpan={9} className="h-24 bg-muted/30" /></tr>
                  ) : (
                    testRows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-2 py-1">{r.testType}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.date}</td>
                        <td className="px-2 py-1">{r.location}</td>
                        <td className="px-2 py-1">{r.certificateNo}</td>
                        <td className="px-2 py-1">{r.listening}</td>
                        <td className="px-2 py-1">{r.reading}</td>
                        <td className="px-2 py-1">{r.writing}</td>
                        <td className="px-2 py-1">{r.speaking}</td>
                        <td className="px-2 py-1">{r.overall}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form rows */}
          <div className="border-t border-border pt-3 flex flex-col gap-2">

            {/* Row 1: Type of Test | Test Date | Test Location */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0 w-28 text-right">Type of Test</span>
                <Select value={test.testType} onValueChange={(v) => setT('testType', v)}>
                  <SelectTrigger className="h-7 text-sm w-40"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ielts">IELTS</SelectItem>
                    <SelectItem value="toefl">TOEFL</SelectItem>
                    <SelectItem value="pte">PTE</SelectItem>
                    <SelectItem value="oet">OET</SelectItem>
                    <SelectItem value="cambridge">Cambridge</SelectItem>
                    <SelectItem value="toeic">TOEIC</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Test Date</span>
                <DatePicker value={test.testDate} onChange={(d) => setT('testDate', d)} />
                <Button
                  variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0"
                  onClick={() => setT('testDate', undefined)}
                >
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Test Location</span>
                <Input
                  className="h-7 text-sm w-40"
                  value={test.testLocation}
                  onChange={(e) => setT('testLocation', e.target.value)}
                />
              </div>

              {/* +/- buttons right-aligned */}
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant="outline" size="sm" className="h-7 w-7 p-0"
                  onClick={() => setTestRows((p) => p.slice(0, -1))}
                  disabled={testRows.length === 0}
                >
                  <Minus className="size-3 text-destructive" />
                </Button>
                <Button
                  variant="outline" size="sm" className="h-7 w-7 p-0"
                  onClick={() => {
                    setTestRows((p) => [...p, {
                      testType: test.testType,
                      date: test.testDate ? format(test.testDate, 'dd/MM/yyyy') : '',
                      location: test.testLocation,
                      certificateNo: test.certificateNo,
                      listening: test.listening, reading: test.reading,
                      writing: test.writing, speaking: test.speaking, overall: test.overall,
                    }]);
                    setTest(EMPTY_TEST);
                  }}
                >
                  <Plus className="size-3 text-green-600" />
                </Button>
              </div>
            </div>

            {/* Row 2: Certificate No | Test Results fields */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0 w-28 text-right">Certificate No.</span>
                <Input className="h-7 text-sm w-36" value={test.certificateNo} onChange={(e) => setT('certificateNo', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">Test Results:</span>
              </div>
              {[
                { label: 'Listening', key: 'listening' as const },
                { label: 'Reading',   key: 'reading'   as const },
                { label: 'Writing',   key: 'writing'   as const },
                { label: 'Speaking',  key: 'speaking'  as const },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center gap-1">
                  <span className="text-sm text-secondary-foreground shrink-0">{label}</span>
                  <Input className="h-7 text-sm w-16" value={test[key]} onChange={(e) => setT(key, e.target.value)} />
                </div>
              ))}
              <div className="flex items-center gap-1">
                <span className="text-sm text-secondary-foreground shrink-0">Overall/Average</span>
                <Input className="h-7 text-sm w-16" value={test.overall} onChange={(e) => setT('overall', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

/* ─────────────────────────────── Talent tab ─────────────────────────────── */

const TALENT_QUESTIONS = [
  'Is this person internationally recognised as being outstanding in their field?',
  "What is this person's field of distinguished talent?",
  'Is this person still prominent in their field?',
  "Will this person's settlement in Australia be an asset to the Australian community?",
  'Does this person believe that they will have no difficulty in obtaining employment, or in becoming established independently, in Australia in their field?',
  "Is this person's occupation associated with an Australian priority sector?",
  'Which Priority Sector?',
];

const EXPERIENCE_QUESTIONS = [
  'Does this person have Skills which are relevant to their proposed activity in Australia?',
  'Does this person have experience which is relevant to their proposed activity in Australia?',
];

type QARow = { answer: string; details: string };

function TalentTab() {
  const [talentAnswers, setTalentAnswers] = useState<QARow[]>(
    TALENT_QUESTIONS.map(() => ({ answer: '', details: '' }))
  );
  const [expAnswers, setExpAnswers] = useState<QARow[]>(
    EXPERIENCE_QUESTIONS.map(() => ({ answer: '', details: '' }))
  );

  const updateRow = (
    setter: React.Dispatch<React.SetStateAction<QARow[]>>,
    idx: number,
    field: keyof QARow,
    value: string
  ) =>
    setter((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );

  const renderQAList = (
    questions: string[],
    rows: QARow[],
    setter: React.Dispatch<React.SetStateAction<QARow[]>>
  ) => (
    <div className="flex flex-col divide-y divide-border border border-border rounded-sm overflow-hidden">
      {questions.map((q, i) => (
        <div
          key={i}
          className={`flex flex-col gap-2 px-3 py-3 ${i % 2 === 0 ? 'bg-background' : 'bg-accent/20'}`}
        >
          {/* Question */}
          <p className="text-sm text-secondary-foreground leading-snug font-medium">{q}</p>
          {/* Answer */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Answer</span>
            <textarea
              className="w-full min-h-[52px] rounded border border-input bg-background px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              value={rows[i].answer}
              onChange={(e) => updateRow(setter, i, 'answer', e.target.value)}
            />
          </div>
          {/* Details */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Details</span>
            <textarea
              className="w-full min-h-[52px] rounded border border-input bg-muted/40 px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              value={rows[i].details}
              onChange={(e) => updateRow(setter, i, 'details', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionBox title="Talent">
        {renderQAList(TALENT_QUESTIONS, talentAnswers, setTalentAnswers)}
      </SectionBox>

      <SectionBox title="Experience">
        {renderQAList(EXPERIENCE_QUESTIONS, expAnswers, setExpAnswers)}
      </SectionBox>
    </div>
  );
}

/* ────────────────────────────── Skills tab ────────────────────────────── */

const POINTS_ROWS = [
  'Age',
  'English Language Skills',
  'Overseas Work Experience',
  'Australian Work Experience',
  'Qualifications',
  'Australian Study Requirement',
  'Specialist Education Qualifications',
  'Accreditation in Community Language',
  'Study in Regional Australia',
  'Partner Skills',
  'Professional Year in Australia',
  'Nomination/Sponsorship',
];

const POINTS_OPTIONS = [
  { value: '0',  label: '0'  },
  { value: '5',  label: '5'  },
  { value: '10', label: '10' },
  { value: '15', label: '15' },
  { value: '20', label: '20' },
  { value: '25', label: '25' },
  { value: '30', label: '30' },
];

type SkillsPoints = { primary: string; spouse: string };

function SkillsTab() {
  const [primOccupation, setPrimOccupation] = useState('');
  const [primAnzsco, setPrimAnzsco]         = useState('');
  const [spouseOccupation, setSpouseOccupation] = useState('');
  const [spouseAnzsco, setSpouseAnzsco]         = useState('');
  const [activePointsTab, setActivePointsTab] = useState<'current' | 'pre2012' | 'pre2011'>('current');
  const [notes, setNotes] = useState('');

  const [points, setPoints] = useState<SkillsPoints[]>(
    POINTS_ROWS.map(() => ({ primary: '', spouse: '' }))
  );

  const setPoint = (idx: number, col: keyof SkillsPoints, val: string) =>
    setPoints((prev) => prev.map((r, i) => (i === idx ? { ...r, [col]: val } : r)));

  const totalPrimary = points.reduce((s, r) => s + (parseInt(r.primary) || 0), 0);
  const totalSpouse  = points.reduce((s, r) => s + (parseInt(r.spouse)  || 0), 0);

  return (
    <div className="flex flex-col gap-4">

      {/* ══ PRIMARY / SPOUSE header ══ */}
      <div className="grid grid-cols-2 gap-4">
        {/* Primary Applicant */}
        <SectionBox title="Primary Applicant">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0 w-44 text-right">Nominated Occupation</span>
              <Input className="h-7 text-sm flex-1" value={primOccupation} onChange={(e) => setPrimOccupation(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0 w-44 text-right">ANZSCO Code</span>
              <Input className="h-7 text-sm flex-1" value={primAnzsco} onChange={(e) => setPrimAnzsco(e.target.value)} />
            </div>
          </div>
        </SectionBox>
        {/* Spouse / Partner */}
        <SectionBox title="Spouse / Partner">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0 w-44 text-right">Nominated Occupation</span>
              <Input className="h-7 text-sm flex-1" value={spouseOccupation} onChange={(e) => setSpouseOccupation(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground shrink-0 w-44 text-right">ANZSCO Code</span>
              <Input className="h-7 text-sm flex-1" value={spouseAnzsco} onChange={(e) => setSpouseAnzsco(e.target.value)} />
            </div>
          </div>
        </SectionBox>
      </div>

      {/* ══ Points tabs + Notes side-by-side ══ */}
      <div className="flex gap-4 items-start">

        {/* Left: points section */}
        <div className="flex-1 border border-border rounded-md overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-border bg-accent/60">
            {([
              { key: 'current', label: 'Points' },
              { key: 'pre2012', label: 'Pre-1 July 2012 Points' },
              { key: 'pre2011', label: 'Pre-1 July 2011 Points' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActivePointsTab(key)}
                className={`px-3 py-1.5 text-xs font-medium border-r border-border last:border-r-0 transition-colors ${
                  activePointsTab === key
                    ? 'bg-background text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="bg-accent/20 px-4 py-2 text-sm font-semibold text-center border-b border-border text-foreground">
            Points Test for the subclass 189, 190 and 489 Visas
          </div>

          {/* Points rows */}
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-accent/60 border-b border-border">
                <th className="px-3 py-1.5 text-right font-medium text-muted-foreground w-[55%]"></th>
                <th className="px-3 py-1.5 text-center font-semibold text-muted-foreground w-[22%]">Primary Applicant</th>
                <th className="px-3 py-1.5 text-center font-semibold text-muted-foreground w-[23%]">Spouse/Partner</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_ROWS.map((label, i) => (
                <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-background' : 'bg-accent/20'}`}>
                  <td className="px-3 py-1 text-right text-sm text-secondary-foreground">{label}</td>
                  <td className="px-2 py-1 text-center">
                    <Select value={points[i].primary} onValueChange={(v) => setPoint(i, 'primary', v)}>
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {POINTS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-1 text-center">
                    <Select value={points[i].spouse} onValueChange={(v) => setPoint(i, 'spouse', v)}>
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {POINTS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-accent/40 border-t border-border">
                <td className="px-3 py-2 text-right text-sm font-bold text-foreground">TOTAL POINTS</td>
                <td className="px-2 py-1.5 text-center">
                  <div className="h-7 rounded border border-border bg-accent text-foreground text-sm font-bold flex items-center justify-center">
                    {totalPrimary}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="h-7 rounded border border-border bg-accent text-foreground text-sm font-bold flex items-center justify-center">
                    {totalSpouse}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Notes */}
        <div className="w-52 flex flex-col gap-0 border border-border rounded-md overflow-hidden">
          <div className="bg-accent/60 px-3 py-1.5 border-b border-border">
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Notes</span>
          </div>
          <textarea
            className="w-full h-[430px] bg-background px-2 py-1.5 text-xs resize-none focus:outline-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── Asmt tab ────────────────────────────── */

type SkillsAssessRow = {
  assessmentType: string; occupation: string; decision: string;
  decDate: string; use: boolean; authority: string;
};
type StateSponsorRow = {
  occupation: string; decision: string;
  decDate: string; use: boolean; state: string;
};

function AsmtTab() {
  const LBL = 'w-32';

  /* ─ Skills Assessment ─ */
  const [saRows, setSaRows] = useState<SkillsAssessRow[]>([]);
  const [saOfficeName, setSaOfficeName]     = useState('');
  const [saCOName, setSaCOName]             = useState('');
  const [saCOCountry, setSaCOCountry]       = useState('');
  const [saCOArea, setSaCOArea]             = useState('');
  const [saCONumber, setSaCONumber]         = useState('');
  const [saTelephone, setSaTelephone]       = useState('');
  const [saEmail, setSaEmail]               = useState('');
  const [saAssessType, setSaAssessType]     = useState('');
  const [saOccupation, setSaOccupation]     = useState('');
  const [saAnzsco, setSaAnzsco]             = useState('');
  const [saLodgeDate, setSaLodgeDate]       = useState<Date | undefined>(undefined);
  const [saReceiptRef, setSaReceiptRef]     = useState('');
  const [saDecision, setSaDecision]         = useState('');
  const [saUseInApp, setSaUseInApp]         = useState(false);
  const [saDecisionRef, setSaDecisionRef]   = useState('');
  const [saDecisionDate, setSaDecisionDate] = useState<Date | undefined>(undefined);

  /* ─ State/Territory Sponsorship ─ */
  const [stRows, setStRows] = useState<StateSponsorRow[]>([]);
  const [stOfficeName, setStOfficeName]     = useState('');
  const [stCOName, setStCOName]             = useState('');
  const [stCOCountry, setStCOCountry]       = useState('');
  const [stCOArea, setStCOArea]             = useState('');
  const [stCONumber, setStCONumber]         = useState('');
  const [stTelephone, setStTelephone]       = useState('');
  const [stFax, setStFax]                   = useState('');
  const [stEmail, setStEmail]               = useState('');
  const [stOccupation, setStOccupation]     = useState('');
  const [stAnzsco, setStAnzsco]             = useState('');
  const [stLodgeDate, setStLodgeDate]       = useState<Date | undefined>(undefined);
  const [stReceiptRef, setStReceiptRef]     = useState('');
  const [stDecision, setStDecision]         = useState('');
  const [stUseInApp, setStUseInApp]         = useState(false);
  const [stDecisionRef, setStDecisionRef]   = useState('');
  const [stDecisionDate, setStDecisionDate] = useState<Date | undefined>(undefined);

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* ═══════ LEFT: Skills Assessments Applications ═══════ */}
      <div className="flex flex-col gap-3">
        <SectionBox title="Skills Assessments Applications">
          <div className="flex flex-col gap-3">

            {/* Table */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[400px]">
                  <thead>
                    <tr className="bg-accent/60 border-b border-border">
                      {['Assessment Type','Occupation','Decision','Dec Date','Use','Authority'].map((h) => (
                        <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {saRows.length === 0 ? (
                      <tr><td colSpan={6} className="h-16 bg-muted/30" /></tr>
                    ) : (
                      saRows.map((r, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                          <td className="px-2 py-1">{r.assessmentType}</td>
                          <td className="px-2 py-1">{r.occupation}</td>
                          <td className="px-2 py-1">{r.decision}</td>
                          <td className="px-2 py-1 whitespace-nowrap">{r.decDate}</td>
                          <td className="px-2 py-1">{r.use ? 'Yes' : ''}</td>
                          <td className="px-2 py-1">{r.authority}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setSaRows((p) => p.slice(0,-1))} disabled={saRows.length===0}>
                <Minus className="size-3 text-destructive" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0"
                onClick={() => setSaRows((p) => [...p, { assessmentType: saAssessType, occupation: saOccupation, decision: saDecision, decDate: saDecisionDate ? format(saDecisionDate,'dd/MM/yyyy') : '', use: saUseInApp, authority: saOfficeName }])}>
                <Plus className="size-3 text-green-600" />
              </Button>
            </div>
          </div>
        </SectionBox>

        {/* Assessing Authority */}
        <SectionBox title="Assessing Authority">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Office</span>
              <Input className="h-7 text-sm flex-1" value={saOfficeName} onChange={(e) => setSaOfficeName(e.target.value)} />
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">...</Button>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary underline px-0">Show Addresses</Button>
            </div>
          </div>
        </SectionBox>

        {/* Case Officer */}
        <SectionBox title="Case Officer">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Name</span>
              <Input className="h-7 text-sm flex-1" value={saCOName} onChange={(e) => setSaCOName(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}></span>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Country</span>
                  <Input className="h-7 text-sm" value={saCOCountry} onChange={(e) => setSaCOCountry(e.target.value)} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Area</span>
                  <Input className="h-7 text-sm" value={saCOArea} onChange={(e) => setSaCOArea(e.target.value)} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Number</span>
                  <Input className="h-7 text-sm" value={saCONumber} onChange={(e) => setSaCONumber(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Telephone</span>
              <Input className="h-7 text-sm flex-1" value={saTelephone} onChange={(e) => setSaTelephone(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>E-mail address</span>
              <Input className="h-7 text-sm flex-1" value={saEmail} onChange={(e) => setSaEmail(e.target.value)} />
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">...</Button>
            </div>
          </div>
        </SectionBox>

        {/* Details */}
        <SectionBox title="Details">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Assessment Type</span>
              <Select value={saAssessType} onValueChange={setSaAssessType}>
                <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tra">TRA</SelectItem>
                  <SelectItem value="acs">ACS</SelectItem>
                  <SelectItem value="vetassess">VETASSESS</SelectItem>
                  <SelectItem value="engineers-australia">Engineers Australia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Occupation</span>
              <Select value={saOccupation} onValueChange={setSaOccupation}>
                <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="software-engineer">Software Engineer</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>ANZSCO Code</span>
              <Input className="h-7 text-sm flex-1" value={saAnzsco} onChange={(e) => setSaAnzsco(e.target.value)} />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary underline">Lookup</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Lodgement Date</span>
              <DatePicker value={saLodgeDate} onChange={setSaLodgeDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setSaLodgeDate(undefined)}>
                <RotateCcw className="size-3 mr-1" />Reset
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Receipt/Ref No</span>
              <Input className="h-7 text-sm flex-1" value={saReceiptRef} onChange={(e) => setSaReceiptRef(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision</span>
              <Select value={saDecision} onValueChange={setSaDecision}>
                <SelectTrigger className="h-7 text-sm w-32"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Checkbox id="sa-use" checked={saUseInApp} onCheckedChange={(v) => setSaUseInApp(!!v)} />
              <label htmlFor="sa-use" className="text-sm text-secondary-foreground cursor-pointer">Use in Application</label>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision Ref</span>
              <Input className="h-7 text-sm flex-1" value={saDecisionRef} onChange={(e) => setSaDecisionRef(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision Date</span>
              <DatePicker value={saDecisionDate} onChange={setSaDecisionDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setSaDecisionDate(undefined)}>
                <RotateCcw className="size-3 mr-1" />Reset
              </Button>
            </div>
          </div>
        </SectionBox>
      </div>

      {/* ═══════ RIGHT: State/Territory Sponsorship Applications ═══════ */}
      <div className="flex flex-col gap-3">
        <SectionBox title="State/Territory Sponsorship Applications">
          <div className="flex flex-col gap-3">

            {/* Table */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[360px]">
                  <thead>
                    <tr className="bg-accent/60 border-b border-border">
                      {['Occupation','Decision','Dec Date','Use','State'].map((h) => (
                        <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stRows.length === 0 ? (
                      <tr><td colSpan={5} className="h-16 bg-muted/30" /></tr>
                    ) : (
                      stRows.map((r, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                          <td className="px-2 py-1">{r.occupation}</td>
                          <td className="px-2 py-1">{r.decision}</td>
                          <td className="px-2 py-1 whitespace-nowrap">{r.decDate}</td>
                          <td className="px-2 py-1">{r.use ? 'Yes' : ''}</td>
                          <td className="px-2 py-1">{r.state}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setStRows((p) => p.slice(0,-1))} disabled={stRows.length===0}>
                <Minus className="size-3 text-destructive" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0"
                onClick={() => setStRows((p) => [...p, { occupation: stOccupation, decision: stDecision, decDate: stDecisionDate ? format(stDecisionDate,'dd/MM/yyyy') : '', use: stUseInApp, state: stOfficeName }])}>
                <Plus className="size-3 text-green-600" />
              </Button>
            </div>
          </div>
        </SectionBox>

        {/* State/Territory Office */}
        <SectionBox title="State/Territory Office">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Office</span>
              <Input className="h-7 text-sm flex-1" value={stOfficeName} onChange={(e) => setStOfficeName(e.target.value)} />
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">...</Button>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary underline px-0">Show Addresses</Button>
            </div>
          </div>
        </SectionBox>

        {/* Case Officer */}
        <SectionBox title="Case Officer">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Name</span>
              <Input className="h-7 text-sm flex-1" value={stCOName} onChange={(e) => setStCOName(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}></span>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Country</span>
                  <Input className="h-7 text-sm" value={stCOCountry} onChange={(e) => setStCOCountry(e.target.value)} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Area</span>
                  <Input className="h-7 text-sm" value={stCOArea} onChange={(e) => setStCOArea(e.target.value)} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Number</span>
                  <Input className="h-7 text-sm" value={stCONumber} onChange={(e) => setStCONumber(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Telephone</span>
              <Input className="h-7 text-sm flex-1" value={stTelephone} onChange={(e) => setStTelephone(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Fax</span>
              <Input className="h-7 text-sm flex-1" value={stFax} onChange={(e) => setStFax(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>E-mail address</span>
              <Input className="h-7 text-sm flex-1" value={stEmail} onChange={(e) => setStEmail(e.target.value)} />
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">...</Button>
            </div>
          </div>
        </SectionBox>

        {/* Details */}
        <SectionBox title="Details">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Occupation</span>
              <Select value={stOccupation} onValueChange={setStOccupation}>
                <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="software-engineer">Software Engineer</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>ANZSCO Code</span>
              <Input className="h-7 text-sm flex-1" value={stAnzsco} onChange={(e) => setStAnzsco(e.target.value)} />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary underline">Lookup</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Lodgement Date</span>
              <DatePicker value={stLodgeDate} onChange={setStLodgeDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setStLodgeDate(undefined)}>
                <RotateCcw className="size-3 mr-1" />Reset
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Receipt/Ref No</span>
              <Input className="h-7 text-sm flex-1" value={stReceiptRef} onChange={(e) => setStReceiptRef(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision</span>
              <Select value={stDecision} onValueChange={setStDecision}>
                <SelectTrigger className="h-7 text-sm w-32"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Checkbox id="st-use" checked={stUseInApp} onCheckedChange={(v) => setStUseInApp(!!v)} />
              <label htmlFor="st-use" className="text-sm text-secondary-foreground cursor-pointer">Use in Application</label>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision Ref</span>
              <Input className="h-7 text-sm flex-1" value={stDecisionRef} onChange={(e) => setStDecisionRef(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm text-secondary-foreground shrink-0 text-right ${LBL}`}>Decision Date</span>
              <DatePicker value={stDecisionDate} onChange={setStDecisionDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setStDecisionDate(undefined)}>
                <RotateCcw className="size-3 mr-1" />Reset
              </Button>
            </div>
          </div>
        </SectionBox>
      </div>
    </div>
  );
}

/* ──────────────────────────── Business tab ──────────────────────────── */

type BusinessRow = {
  businessName: string; startDate: string; endDate: string; typeOfBusiness: string;
  positionHeld: string; mainSecondary: string; ownershipType: string;
  tradingName: string; businessAustralian: string;
};

const BUSI_INNER_TABS = ['Businesses', 'Business and Investment Skills', 'Assets & Liabilities', 'Intentions'];

function BusinessTab() {
  const [busiInnerTab, setBusiInnerTab] = useState('businesses');
  const [rows, setRows] = useState<BusinessRow[]>([]);

  /* business form fields */
  const [bizName, setBizName]         = useState('');
  const [startDate, setStartDate]     = useState<Date | undefined>(undefined);
  const [endDate, setEndDate]         = useState<Date | undefined>(undefined);
  const [bizType, setBizType]         = useState('');
  const [position, setPosition]       = useState('');
  const [mainSec, setMainSec]         = useState('');
  const [ownership, setOwnership]     = useState('');
  const [tradingName, setTradingName] = useState('');
  const [isAustralian, setIsAustralian] = useState('');

  /* financial summary */
  const [netPersonal, setNetPersonal]     = useState('');
  const [netQualifying, setNetQualifying] = useState('');
  const [mainTurnover, setMainTurnover]   = useState('');
  const [showCurrency, setShowCurrency]   = useState('aud');

  /* history detail inner tab */
  const [histTab, setHistTab] = useState<'financial' | 'addresses'>('financial');

  return (
    <div className="flex flex-col gap-0">

      {/* ══ Business inner tab bar ══ */}
      <div className="flex border-b border-border bg-accent/30 mb-3">
        {BUSI_INNER_TABS.map((t) => {
          const val = t.toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-');
          return (
            <button
              key={t}
              onClick={() => setBusiInnerTab(val)}
              className={`px-3 py-1.5 text-xs font-medium border-r border-border last:border-r-0 transition-colors ${
                busiInnerTab === val
                  ? 'bg-background text-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* ══ BUSINESSES sub-tab ══ */}
      {busiInnerTab === 'businesses' && (
        <div className="flex flex-col gap-3">

          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-accent/60 border-b border-border">
                    {['Business/Co Name','Start Date','End Date','Type of Business','Position Held','Main/Secondary Main','Ownership/Interest Type','Trading Name','Business Australian'].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={9} className="h-20 bg-muted/30" /></tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-2 py-1">{r.businessName}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.startDate}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{r.endDate}</td>
                        <td className="px-2 py-1">{r.typeOfBusiness}</td>
                        <td className="px-2 py-1">{r.positionHeld}</td>
                        <td className="px-2 py-1">{r.mainSecondary}</td>
                        <td className="px-2 py-1">{r.ownershipType}</td>
                        <td className="px-2 py-1">{r.tradingName}</td>
                        <td className="px-2 py-1">{r.businessAustralian}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ± buttons */}
          <div className="flex justify-end gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setRows((p) => p.slice(0,-1))} disabled={rows.length===0}>
              <Minus className="size-3 text-destructive" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0"
              onClick={() => {
                setRows((p) => [...p, {
                  businessName: bizName,
                  startDate: startDate ? format(startDate,'dd/MM/yyyy') : '',
                  endDate: endDate ? format(endDate,'dd/MM/yyyy') : '',
                  typeOfBusiness: bizType, positionHeld: position,
                  mainSecondary: mainSec, ownershipType: ownership,
                  tradingName, businessAustralian: isAustralian,
                }]);
              }}>
              <Plus className="size-3 text-green-600" />
            </Button>
          </div>

          {/* Business History Detail */}
          <SectionBox title="Business History Detail">
            <div className="flex flex-col gap-3">

              {/* history inner tabs */}
              <div className="flex border-b border-border">
                {(['financial','addresses'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setHistTab(k)}
                    className={`px-3 py-1 text-xs font-medium border-r border-border last:border-r-0 transition-colors ${
                      histTab === k ? 'bg-background text-foreground font-semibold' : 'text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    {k === 'financial' ? 'Financial Details (Last 4 Years)' : 'Addresses'}
                  </button>
                ))}
              </div>

              {/* history table area */}
              <div className="border border-border rounded-sm h-40 bg-muted/30" />

              {/* show amounts + ± */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">Show Amounts in</span>
                <Select value={showCurrency} onValueChange={setShowCurrency}>
                  <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aud">AUD</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <Minus className="size-3 text-destructive" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <Plus className="size-3 text-green-600" />
                </Button>
              </div>
            </div>
          </SectionBox>

          {/* Financial Summary */}
          <SectionBox title="Financial Summary">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Net Personal and Business Assets</span>
                <Input className="h-7 text-sm" value={netPersonal} onChange={(e) => setNetPersonal(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Net Assets in Qualifying Businesses</span>
                <Input className="h-7 text-sm" value={netQualifying} onChange={(e) => setNetQualifying(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Main Business Turnover</span>
                <Input className="h-7 text-sm" value={mainTurnover} onChange={(e) => setMainTurnover(e.target.value)} />
              </div>
            </div>
          </SectionBox>
        </div>
      )}

      {/* ══ Other sub-tabs: coming soon ══ */}
      {busiInnerTab !== 'businesses' && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {BUSI_INNER_TABS.find((t) =>
            t.toLowerCase().replace(/[^a-z]/g,'-').replace(/-+/g,'-') === busiInnerTab
          )} — coming soon
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Main component ─────────────────────────── */

const PERSONS = [
  { value: 'smith-john', label: 'John Smith' },
  { value: 'nguyen-linh', label: 'Linh Nguyen' },
  { value: 'wilson-sarah', label: 'Sarah Wilson' },
];

/* ─────────────────────────── Visas tab ─────────────────────────── */

type VisaRow = {
  country: string;
  visaType: string;
  applicationDate: string;
  officeAppliedAt: string;
  outcome: string;
  startDate: string;
  endDate: string;
  visaStatus: string;
  refCancWithDate: string;
};

function VisasTab() {
  const [visaRows, setVisaRows] = useState<VisaRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Application Details
  const [visaFor, setVisaFor]             = useState('');
  const [visaType, setVisaType]           = useState('');
  const [dateApplied, setDateApplied]     = useState<Date | undefined>();
  const [officeApplied, setOfficeApplied] = useState('');
  const [passportNo, setPassportNo]       = useState('');
  const [outcome, setOutcome]             = useState('');
  const [nameOnPassport, setNameOnPassport] = useState('');
  const [refNo, setRefNo]                 = useState('');
  const [familySponsor, setFamilySponsor] = useState(false);

  // Grant Details
  const [issueDate, setIssueDate]         = useState<Date | undefined>();
  const [expiryDate, setExpiryDate]       = useState<Date | undefined>();
  const [grantStatus, setGrantStatus]     = useState('');
  const [trackSnapshot, setTrackSnapshot] = useState(false);
  const [visaNumber, setVisaNumber]       = useState('');
  const [grantNumber, setGrantNumber]     = useState('');
  const [placeOfIssue, setPlaceOfIssue]   = useState('');
  const [conditions, setConditions]       = useState('');
  const [grantedWorkRights, setGrantedWorkRights] = useState(false);
  const [purposeOfStay, setPurposeOfStay] = useState('');

  // Refused / Cancelled / Withdrawn
  const [statusDate, setStatusDate]       = useState<Date | undefined>();
  const [rcwDetails, setRcwDetails]       = useState('');

  // Notes
  const [notes, setNotes]                 = useState('');

  function addRow() {
    const row: VisaRow = {
      country: '',
      visaType,
      applicationDate: dateApplied ? format(dateApplied, 'dd/MM/yyyy') : '',
      officeAppliedAt: officeApplied,
      outcome,
      startDate: issueDate ? format(issueDate, 'dd/MM/yyyy') : '',
      endDate: expiryDate ? format(expiryDate, 'dd/MM/yyyy') : '',
      visaStatus: grantStatus,
      refCancWithDate: statusDate ? format(statusDate, 'dd/MM/yyyy') : '',
    };
    setVisaRows((p) => [...p, row]);
    setSelectedRow(visaRows.length);
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="visa-details" className="w-full">
        <div className="border-b border-border mb-3">
          <TabsList variant="line" size="sm" className="gap-0 bg-transparent p-0 h-auto">
            <TabsTrigger value="visa-details" className="px-4 py-2 rounded-none text-xs font-medium">Visa Details</TabsTrigger>
            <TabsTrigger value="support"      className="px-4 py-2 rounded-none text-xs font-medium">Support</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visa-details" className="mt-0 flex flex-col gap-4">

          {/* ── Top table ── */}
          <div className="border border-border rounded-sm overflow-auto">
            <div className="grid min-w-[800px] bg-accent/60 border-b border-border"
              style={{ gridTemplateColumns: '120px 160px 100px 120px 1fr 90px 90px 100px 110px' }}>
              {['Country','Visa Type','Application Date','Office Applied At','Outcome of Application','Start Date','End Date','Visa Status','Ref/Canc/With Date']
                .map((h) => <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>)}
            </div>
            <div className="min-h-[100px]">
              {visaRows.length === 0 ? (
                <div className="h-24 bg-muted/20" />
              ) : visaRows.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRow(i)}
                  className={cn(
                    'grid min-w-[800px] border-b border-border last:border-0 cursor-pointer hover:bg-accent/30 transition-colors',
                    selectedRow === i && 'bg-primary/10',
                  )}
                  style={{ gridTemplateColumns: '120px 160px 100px 120px 1fr 90px 90px 100px 110px' }}
                >
                  {[r.country,r.visaType,r.applicationDate,r.officeAppliedAt,r.outcome,r.startDate,r.endDate,r.visaStatus,r.refCancWithDate]
                    .map((v, ci) => <span key={ci} className="px-2 py-1 text-xs border-r border-border last:border-0 truncate">{v}</span>)}
                </div>
              ))}
            </div>
          </div>

          {/* Row action buttons */}
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove last" onClick={() => setVisaRows((p) => p.slice(0, -1))} disabled={visaRows.length === 0}>
              <Minus className="size-3 text-destructive" />
            </Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={addRow}>
              <Plus className="size-3 text-green-600" />
            </Button>
          </div>

          {/* ── Application Details ── */}
          <SectionBox title="Application Details">
            <div className="flex flex-col gap-2">
              {/* Row 1 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Visa for</span>
                  <Select value={visaFor} onValueChange={setVisaFor}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Applicant</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sponsor">Sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Visa Type</span>
                  <Select value={visaType} onValueChange={setVisaType}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="482">482 - Temporary Skill Shortage</SelectItem>
                      <SelectItem value="186">186 - Employer Nomination Scheme</SelectItem>
                      <SelectItem value="189">189 - Skilled Independent</SelectItem>
                      <SelectItem value="190">190 - Skilled Nominated</SelectItem>
                      <SelectItem value="820">820 - Partner (Temporary)</SelectItem>
                      <SelectItem value="801">801 - Partner (Permanent)</SelectItem>
                      <SelectItem value="600">600 - Visitor</SelectItem>
                      <SelectItem value="500">500 - Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground shrink-0">Date Applied</span>
                  <DatePicker value={dateApplied} onChange={setDateApplied} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDateApplied(undefined)}>
                    <RotateCcw className="size-3 mr-1" />Reset
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <Checkbox id="family-sponsor" checked={familySponsor} onCheckedChange={(v) => setFamilySponsor(!!v)} />
                  <label htmlFor="family-sponsor" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">Sponsored by Family Sponsor</label>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Office Applied At</span>
                  <Input className="h-7 text-sm flex-1" value={officeApplied} onChange={(e) => setOfficeApplied(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Passport No</span>
                  <Select value={passportNo} onValueChange={setPassportNo}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-fill from Identity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Outcome</span>
                  <Select value={outcome} onValueChange={setOutcome}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="refused">Refused</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">Name on Passport</span>
                  <Input className="h-7 text-sm flex-1" value={nameOnPassport} onChange={(e) => setNameOnPassport(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Ref No</span>
                  <Input className="h-7 text-sm flex-1" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
                </div>
              </div>
            </div>
          </SectionBox>

          {/* ── Grant Details ── */}
          <SectionBox title="Grant Details">
            <div className="flex flex-col gap-2">
              {/* Row 1 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Issue Date</span>
                  <DatePicker value={issueDate} onChange={setIssueDate} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setIssueDate(undefined)}>
                    <RotateCcw className="size-3 mr-1" />Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground shrink-0">Expiry Date</span>
                  <DatePicker value={expiryDate} onChange={setExpiryDate} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setExpiryDate(undefined)}>
                    <RotateCcw className="size-3 mr-1" />Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Status</span>
                  <Select value={grantStatus} onValueChange={setGrantStatus}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="ceased">Ceased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <Checkbox id="track-snapshot" checked={trackSnapshot} onCheckedChange={(v) => setTrackSnapshot(!!v)} />
                  <label htmlFor="track-snapshot" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">Track in Snapshot</label>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Visa Number</span>
                  <Input className="h-7 text-sm flex-1" placeholder="V…" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Grant Number</span>
                  <Input className="h-7 text-sm flex-1" value={grantNumber} onChange={(e) => setGrantNumber(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Place of Issue</span>
                  <Input className="h-7 text-sm flex-1" value={placeOfIssue} onChange={(e) => setPlaceOfIssue(e.target.value)} />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Conditions</span>
                  <Input className="h-7 text-sm flex-1" value={conditions} onChange={(e) => setConditions(e.target.value)} />
                  <div className="flex flex-col gap-0.5">
                    <Button variant="outline" size="sm" className="h-3.5 w-5 p-0 rounded-none rounded-t-sm">
                      <Plus className="size-2.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-3.5 w-5 p-0 rounded-none rounded-b-sm">
                      <Minus className="size-2.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Checkbox id="work-rights" checked={grantedWorkRights} onCheckedChange={(v) => setGrantedWorkRights(!!v)} />
                  <label htmlFor="work-rights" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">Granted Work Rights</label>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Purpose of stay</span>
                  <Input className="h-7 text-sm flex-1" value={purposeOfStay} onChange={(e) => setPurposeOfStay(e.target.value)} />
                </div>
              </div>
            </div>
          </SectionBox>

          {/* ── Refused / Cancelled / Withdrawn ── */}
          <SectionBox title="Refused / Cancelled / Withdrawn">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Status Date</span>
                <DatePicker value={statusDate} onChange={setStatusDate} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setStatusDate(undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-sm text-secondary-foreground shrink-0">Details</span>
                <Input className="h-7 text-sm flex-1" value={rcwDetails} onChange={(e) => setRcwDetails(e.target.value)} />
              </div>
            </div>
          </SectionBox>

          {/* ── Notes ── */}
          <div className="flex items-start gap-2">
            <span className="text-sm text-secondary-foreground text-right shrink-0 w-14 pt-1.5">Notes</span>
            <textarea
              className="flex-1 min-h-[64px] rounded-md border border-border bg-background px-3 py-2 text-sm resize-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        </TabsContent>

        <TabsContent value="support" className="mt-0">
          <div className="py-8 text-center text-sm text-muted-foreground">Support — coming soon</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─────────────────────────── Visits tab ─────────────────────────── */

type VisitAusRow = {
  from: string;
  to: string;
  requiredDeparture: string;
  arrivalCity: string;
  visaType: string;
  visaNumber: string;
  visaGrantNumber: string;
  fullNameUsed: string;
  purposeOfVisit: string;
  legalStatus: string;
};

type VisitOtherRow = {
  country: string;
  from: string;
  to: string;
  purposeOfVisit: string;
};

function VisitsTab() {
  // Visits to Australia state
  const [ausRows, setAusRows]               = useState<VisitAusRow[]>([]);
  const [selectedAus, setSelectedAus]       = useState<number | null>(null);
  const [dateFrom, setDateFrom]             = useState<Date | undefined>();
  const [dateTo, setDateTo]                 = useState<Date | undefined>();
  const [intendedDeparture, setIntendedDeparture] = useState<Date | undefined>();
  const [arrivalCity, setArrivalCity]       = useState('');
  const [reqDepartureDate, setReqDepartureDate] = useState<Date | undefined>();
  const [trackReqDeparture, setTrackReqDeparture] = useState(false);
  const [legalStatus, setLegalStatus]       = useState('');
  const [entryVisaType, setEntryVisaType]   = useState('');
  const [visaNumber, setVisaNumber]         = useState('');
  const [grantNo, setGrantNo]               = useState('');
  const [fullNameUsed, setFullNameUsed]     = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [summaryYears, setSummaryYears]     = useState('10');
  const [summaryDays, setSummaryDays]       = useState('');

  // Visits to Other Countries state
  const [otherRows, setOtherRows]           = useState<VisitOtherRow[]>([]);
  const [selectedOther, setSelectedOther]   = useState<number | null>(null);
  const [otherCountry, setOtherCountry]     = useState('');
  const [otherFrom, setOtherFrom]           = useState<Date | undefined>();
  const [otherTo, setOtherTo]               = useState<Date | undefined>();
  const [otherPurpose, setOtherPurpose]     = useState('');

  function addAusRow() {
    setAusRows((p) => [...p, {
      from: dateFrom ? format(dateFrom, 'dd/MM/yyyy') : '',
      to: dateTo ? format(dateTo, 'dd/MM/yyyy') : '',
      requiredDeparture: reqDepartureDate ? format(reqDepartureDate, 'dd/MM/yyyy') : '',
      arrivalCity,
      visaType: entryVisaType,
      visaNumber,
      visaGrantNumber: grantNo,
      fullNameUsed,
      purposeOfVisit,
      legalStatus,
    }]);
    setSelectedAus(ausRows.length);
  }

  function addOtherRow() {
    setOtherRows((p) => [...p, {
      country: otherCountry,
      from: otherFrom ? format(otherFrom, 'dd/MM/yyyy') : '',
      to: otherTo ? format(otherTo, 'dd/MM/yyyy') : '',
      purposeOfVisit: otherPurpose,
    }]);
    setSelectedOther(otherRows.length);
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="visits-australia" className="w-full">
        <div className="border-b border-border mb-3">
          <TabsList variant="line" size="sm" className="gap-0 bg-transparent p-0 h-auto">
            <TabsTrigger value="visits-australia"      className="px-4 py-2 rounded-none text-xs font-medium">Visits to Australia</TabsTrigger>
            <TabsTrigger value="visits-other-countries" className="px-4 py-2 rounded-none text-xs font-medium">Visits to Other Countries</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Visits to Australia ── */}
        <TabsContent value="visits-australia" className="mt-0 flex flex-col gap-4">
          <SectionBox title="Visits to Australia">
            <div className="flex flex-col gap-3">

              {/* Table */}
              <div className="border border-border rounded-sm overflow-auto">
                <div
                  className="grid min-w-[900px] bg-accent/60 border-b border-border"
                  style={{ gridTemplateColumns: '90px 90px 110px 110px 120px 100px 110px 110px 110px 90px' }}
                >
                  {['From','To','Required Departure','Arrival City','Visa Type','Visa Number','Visa Grant Number','Full Name Used','Purpose of Visit','Legal Status']
                    .map((h) => <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>)}
                </div>
                <div className="min-h-[120px]">
                  {ausRows.length === 0 ? (
                    <div className="h-28 bg-muted/20" />
                  ) : ausRows.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedAus(i)}
                      className={cn(
                        'grid min-w-[900px] border-b border-border last:border-0 cursor-pointer hover:bg-accent/30 transition-colors',
                        selectedAus === i && 'bg-primary/10',
                      )}
                      style={{ gridTemplateColumns: '90px 90px 110px 110px 120px 100px 110px 110px 110px 90px' }}
                    >
                      {[r.from,r.to,r.requiredDeparture,r.arrivalCity,r.visaType,r.visaNumber,r.visaGrantNumber,r.fullNameUsed,r.purposeOfVisit,r.legalStatus]
                        .map((v, ci) => <span key={ci} className="px-2 py-1 text-xs border-r border-border last:border-0 truncate">{v}</span>)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row actions */}
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove last" onClick={() => setAusRows((p) => p.slice(0,-1))} disabled={ausRows.length===0}>
                  <Minus className="size-3 text-destructive" />
                </Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={addAusRow}>
                  <Plus className="size-3 text-green-600" />
                </Button>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-2">
                {/* Row 1: dates */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Date From</span>
                    <DatePicker value={dateFrom} onChange={setDateFrom} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDateFrom(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground shrink-0">Date To</span>
                    <DatePicker value={dateTo} onChange={setDateTo} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDateTo(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground shrink-0">Intended Departure</span>
                    <DatePicker value={intendedDeparture} onChange={setIntendedDeparture} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setIntendedDeparture(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                </div>

                {/* Row 2: arrival city + req departure */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Arrival City</span>
                    <Input className="h-7 text-sm flex-1" value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground shrink-0">Required Departure Date</span>
                    <DatePicker value={reqDepartureDate} onChange={setReqDepartureDate} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setReqDepartureDate(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Checkbox id="track-req-dep" checked={trackReqDeparture} onCheckedChange={(v) => setTrackReqDeparture(!!v)} />
                    <label htmlFor="track-req-dep" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">Track Required Departure Date in Snapshot</label>
                  </div>
                </div>

                {/* Row 3: legal status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Legal Status</span>
                  <Select value={legalStatus} onValueChange={setLegalStatus}>
                    <SelectTrigger className="h-7 text-sm w-64"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lawful">Lawful Non-Citizen</SelectItem>
                      <SelectItem value="unlawful">Unlawful Non-Citizen</SelectItem>
                      <SelectItem value="citizen">Australian Citizen</SelectItem>
                      <SelectItem value="permanent">Permanent Resident</SelectItem>
                      <SelectItem value="temporary">Temporary Resident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Details of Visa used */}
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-accent/60 px-3 py-1.5 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-mono uppercase tracking-wide">Details of Visa used</span>
                  <Button variant="outline" size="sm" className="h-6 text-xs px-3">Choose Visa</Button>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">Type of Entry/Visa</span>
                      <Select value={entryVisaType} onValueChange={setEntryVisaType}>
                        <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="482">482 - Temporary Skill Shortage</SelectItem>
                          <SelectItem value="186">186 - Employer Nomination Scheme</SelectItem>
                          <SelectItem value="189">189 - Skilled Independent</SelectItem>
                          <SelectItem value="600">600 - Visitor</SelectItem>
                          <SelectItem value="500">500 - Student</SelectItem>
                          <SelectItem value="820">820 - Partner (Temporary)</SelectItem>
                          <SelectItem value="evisitor">eVisitor</SelectItem>
                          <SelectItem value="eta">Electronic Travel Authority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                      <span className="text-sm text-secondary-foreground shrink-0 whitespace-nowrap">Visa Number: V</span>
                      <Input className="h-7 text-sm flex-1" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                      <span className="text-sm text-secondary-foreground shrink-0">Grant No.</span>
                      <Input className="h-7 text-sm flex-1" value={grantNo} onChange={(e) => setGrantNo(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">Full Name Used</span>
                      <Input className="h-7 text-sm flex-1" value={fullNameUsed} onChange={(e) => setFullNameUsed(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-sm text-secondary-foreground shrink-0">Purpose of Visit</span>
                      <Input className="h-7 text-sm flex-1" value={purposeOfVisit} onChange={(e) => setPurposeOfVisit(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-accent/60 px-3 py-1.5 border-b border-border">
                  <span className="text-xs font-semibold text-mono uppercase tracking-wide">Summary</span>
                </div>
                <div className="p-3 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-secondary-foreground">Number of days spent in Australia during the last</span>
                  <Select value={summaryYears} onValueChange={setSummaryYears}>
                    <SelectTrigger className="h-7 text-sm w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['1','2','3','4','5','10','15','20'].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-secondary-foreground">years:</span>
                  <Input
                    className="h-7 text-sm w-20"
                    value={summaryDays}
                    onChange={(e) => setSummaryDays(e.target.value)}
                    placeholder="days"
                  />
                </div>
              </div>

            </div>
          </SectionBox>
        </TabsContent>

        {/* ── Visits to Other Countries ── */}
        <TabsContent value="visits-other-countries" className="mt-0 flex flex-col gap-4">
          <SectionBox title="Visits to Other Countries">
            <div className="flex flex-col gap-3">

              {/* Table */}
              <div className="border border-border rounded-sm overflow-auto">
                <div
                  className="grid min-w-[500px] bg-accent/60 border-b border-border"
                  style={{ gridTemplateColumns: '1fr 100px 100px 1fr' }}
                >
                  {['Country','From','To','Purpose of Visit']
                    .map((h) => <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>)}
                </div>
                <div className="min-h-[120px]">
                  {otherRows.length === 0 ? (
                    <div className="h-28 bg-muted/20" />
                  ) : otherRows.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedOther(i)}
                      className={cn(
                        'grid min-w-[500px] border-b border-border last:border-0 cursor-pointer hover:bg-accent/30 transition-colors',
                        selectedOther === i && 'bg-primary/10',
                      )}
                      style={{ gridTemplateColumns: '1fr 100px 100px 1fr' }}
                    >
                      {[r.country,r.from,r.to,r.purposeOfVisit]
                        .map((v, ci) => <span key={ci} className="px-2 py-1 text-xs border-r border-border last:border-0 truncate">{v}</span>)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row actions */}
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Remove last" onClick={() => setOtherRows((p) => p.slice(0,-1))} disabled={otherRows.length===0}>
                  <Minus className="size-3 text-destructive" />
                </Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="Add" onClick={addOtherRow}>
                  <Plus className="size-3 text-green-600" />
                </Button>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Country</span>
                  <div className="flex-1 max-w-xs">
                    <CountryCombobox value={otherCountry} onChange={setOtherCountry} />
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Date From</span>
                    <DatePicker value={otherFrom} onChange={setOtherFrom} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setOtherFrom(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground shrink-0">Date To</span>
                    <DatePicker value={otherTo} onChange={setOtherTo} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setOtherTo(undefined)}>
                      <RotateCcw className="size-3 mr-1" />Reset
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Purpose</span>
                  <Input className="h-7 text-sm flex-1" value={otherPurpose} onChange={(e) => setOtherPurpose(e.target.value)} />
                </div>
              </div>

            </div>
          </SectionBox>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─────────────────────────── Health tab ─────────────────────────── */

const MEDICAL_QUESTIONS = [
  { brief: 'Blood Disorder',       question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Blood Disorder' },
  { brief: 'Cancer',               question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Cancer' },
  { brief: 'Heart Disease',        question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Heart Disease' },
  { brief: 'Hepatitis B or C',     question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Hepatitis B or C' },
  { brief: 'HIV/AIDS',             question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> HIV/AIDS' },
  { brief: 'Mental Illness',       question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Mental Illness' },
  { brief: 'Tuberculosis',         question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Tuberculosis' },
  { brief: 'Kidney Disease',       question: 'Have you, or any other person included in this application have any of the following diseases, mental illnesses, conditions or disabilities that is or likely to require treatment/attention/care in Australia? -> Kidney Disease' },
  { brief: 'Disability',           question: 'Do you or does any other person included in this application have a disability or condition that may require health care or community services (other than aids/appliances) in Australia?' },
  { brief: 'Significant Cost',     question: 'Is there any treatment/service that you or any other person included in this application intend to seek in Australia that would result in a significant cost to the Australian community?' },
];

type MedAnswer = { checked: boolean; details: string; reason: string };

function HealthTab() {
  // Health Examinations
  type HExamRow = { date: string; country: string; hapId: string };
  const [examRows, setExamRows]     = useState<HExamRow[]>([]);
  const [examDate, setExamDate]     = useState<Date | undefined>();
  const [examCountry, setExamCountry] = useState('');
  const [examHapId, setExamHapId]   = useState('');

  // Health Insurance
  type InsRow = { typeOfCover: string; insurerName: string; policyNo: string; startDate: string; endDate: string };
  const [insRows, setInsRows]       = useState<InsRow[]>([]);
  const [insStart, setInsStart]     = useState<Date | undefined>();
  const [insEnd, setInsEnd]         = useState<Date | undefined>();
  const [insTypeOfCover, setInsTypeOfCover] = useState('');
  const [insInsurerName, setInsInsurerName] = useState('');
  const [insPolicyNo, setInsPolicyNo]   = useState('');
  const [insOrgEduProvider, setInsOrgEduProvider] = useState('');

  // Childcare Details
  type ChildcareRow = { institution: string; role: string; details: string };
  const [childRows, setChildRows]   = useState<ChildcareRow[]>([]);
  const [childInstitution, setChildInstitution] = useState('');
  const [childRole, setChildRole]   = useState('');
  const [childDetails, setChildDetails] = useState('');

  // Classroom Details
  type ClassroomRow = { courseType: string; courseName: string; institution: string; startDate: string; endDate: string; details: string };
  const [classRows, setClassRows]   = useState<ClassroomRow[]>([]);
  const [classCourseType, setClassCourseType] = useState('');
  const [classCourseName, setClassCourseName] = useState('');
  const [classInstitution, setClassInstitution] = useState('');
  const [classDetails, setClassDetails] = useState('');
  const [classStart, setClassStart] = useState<Date | undefined>();
  const [classEnd, setClassEnd]     = useState<Date | undefined>();

  // Medical
  const [showDetailedText, setShowDetailedText] = useState(true);
  const [medAnswers, setMedAnswers] = useState<MedAnswer[]>(
    MEDICAL_QUESTIONS.map(() => ({ checked: false, details: '', reason: '' }))
  );

  const ROW_COLORS = [
    'bg-primary/15',
    'bg-accent/40',
    'bg-muted/30',
    'bg-accent/20',
    'bg-primary/10',
    'bg-muted/40',
    'bg-accent/30',
    'bg-primary/5',
    'bg-accent/50',
    'bg-muted/20',
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Top two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Left column */}
        <div className="flex flex-col gap-4">

          {/* Health Examinations */}
          <SectionBox title="Health Examinations">
            <div className="flex flex-col gap-2">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
                  {['Date','Country','HAP ID'].map((h) => (
                    <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                  ))}
                </div>
                <div className="min-h-[80px]">
                  {examRows.length === 0 ? <div className="h-20 bg-muted/20" /> : examRows.map((r, i) => (
                    <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.date}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.country}</span>
                      <span className="px-2 py-1 text-xs">{r.hapId}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Row actions */}
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setExamRows((p) => p.slice(0,-1))} disabled={examRows.length===0}><Minus className="size-3 text-destructive" /></Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (examDate || examCountry || examHapId) { setExamRows((p) => [...p, { date: examDate ? format(examDate,'dd/MM/yyyy') : '', country: examCountry, hapId: examHapId }]); setExamDate(undefined); setExamCountry(''); setExamHapId(''); } }}><Plus className="size-3 text-green-600" /></Button>
              </div>
              {/* Fields */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-10">Date</span>
                  <DatePicker value={examDate} onChange={setExamDate} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setExamDate(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Country</span>
                  <div className="flex-1"><CountryCombobox value={examCountry} onChange={setExamCountry} /></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-14">HAP ID</span>
                <Input className="h-7 text-sm flex-1" value={examHapId} onChange={(e) => setExamHapId(e.target.value)} />
              </div>
            </div>
          </SectionBox>

          {/* Childcare Details */}
          <SectionBox title="Childcare Details">
            <div className="flex flex-col gap-2">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 100px 1fr' }}>
                  {['Institution','Role','Details'].map((h) => (
                    <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                  ))}
                </div>
                <div className="min-h-[80px]">
                  {childRows.length === 0 ? <div className="h-20 bg-muted/20" /> : childRows.map((r, i) => (
                    <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '1fr 100px 1fr' }}>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.institution}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.role}</span>
                      <span className="px-2 py-1 text-xs">{r.details}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setChildRows((p) => p.slice(0,-1))} disabled={childRows.length===0}><Minus className="size-3 text-destructive" /></Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (childInstitution || childRole) { setChildRows((p) => [...p, { institution: childInstitution, role: childRole, details: childDetails }]); setChildInstitution(''); setChildRole(''); setChildDetails(''); } }}><Plus className="size-3 text-green-600" /></Button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Institution</span>
                  <Input className="h-7 text-sm flex-1" value={childInstitution} onChange={(e) => setChildInstitution(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground shrink-0">Role</span>
                  <Select value={childRole} onValueChange={setChildRole}>
                    <SelectTrigger className="h-7 text-sm w-36"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="parent">Parent/Guardian</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Details</span>
                <Input className="h-7 text-sm flex-1" value={childDetails} onChange={(e) => setChildDetails(e.target.value)} />
              </div>
            </div>
          </SectionBox>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Health Insurance */}
          <SectionBox title="Health Insurance">
            <div className="flex flex-col gap-2">
              <div className="border border-border rounded-sm overflow-auto">
                <div className="grid min-w-[460px] bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 1fr 90px 90px 90px' }}>
                  {['Type of Cover','Insurer Name','Policy No.','Start Date','End Date'].map((h) => (
                    <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                  ))}
                </div>
                <div className="min-h-[60px]">
                  {insRows.length === 0 ? <div className="h-16 bg-muted/20" /> : insRows.map((r, i) => (
                    <div key={i} className="grid min-w-[460px] border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '1fr 1fr 90px 90px 90px' }}>
                      <span className="px-2 py-1 text-xs border-r border-border truncate">{r.typeOfCover}</span>
                      <span className="px-2 py-1 text-xs border-r border-border truncate">{r.insurerName}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.policyNo}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.startDate}</span>
                      <span className="px-2 py-1 text-xs">{r.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setInsRows((p) => p.slice(0,-1))} disabled={insRows.length===0}><Minus className="size-3 text-destructive" /></Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { setInsRows((p) => [...p, { typeOfCover: insTypeOfCover, insurerName: insInsurerName, policyNo: insPolicyNo, startDate: insStart ? format(insStart,'dd/MM/yyyy') : '', endDate: insEnd ? format(insEnd,'dd/MM/yyyy') : '' }]); setInsStart(undefined); setInsEnd(undefined); setInsTypeOfCover(''); setInsInsurerName(''); setInsPolicyNo(''); }}><Plus className="size-3 text-green-600" /></Button>
              </div>
              {/* form fields */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-20">Start Date</span>
                  <DatePicker value={insStart} onChange={setInsStart} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setInsStart(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground shrink-0">End Date</span>
                  <DatePicker value={insEnd} onChange={setInsEnd} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setInsEnd(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">Type of Cover</span>
                <Input className="h-7 text-sm flex-1" value={insTypeOfCover} onChange={(e) => setInsTypeOfCover(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">Insurer Name</span>
                <Input className="h-7 text-sm flex-1" value={insInsurerName} onChange={(e) => setInsInsurerName(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">Policy Number</span>
                <Input className="h-7 text-sm flex-1" value={insPolicyNo} onChange={(e) => setInsPolicyNo(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">Organised by Edu. Provider</span>
                <Select value={insOrgEduProvider} onValueChange={setInsOrgEduProvider}>
                  <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionBox>

          {/* Classroom Details */}
          <SectionBox title="Classroom Details">
            <div className="flex flex-col gap-2">
              <div className="border border-border rounded-sm overflow-auto">
                <div className="grid min-w-[500px] bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '100px 1fr 1fr 90px 90px 1fr' }}>
                  {['Course Type','Course Name','Institution','Start Date','End Date','Details'].map((h) => (
                    <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                  ))}
                </div>
                <div className="min-h-[60px]">
                  {classRows.length === 0 ? <div className="h-16 bg-muted/20" /> : classRows.map((r, i) => (
                    <div key={i} className="grid min-w-[500px] border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '100px 1fr 1fr 90px 90px 1fr' }}>
                      <span className="px-2 py-1 text-xs border-r border-border truncate">{r.courseType}</span>
                      <span className="px-2 py-1 text-xs border-r border-border truncate">{r.courseName}</span>
                      <span className="px-2 py-1 text-xs border-r border-border truncate">{r.institution}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.startDate}</span>
                      <span className="px-2 py-1 text-xs border-r border-border">{r.endDate}</span>
                      <span className="px-2 py-1 text-xs">{r.details}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setClassRows((p) => p.slice(0,-1))} disabled={classRows.length===0}><Minus className="size-3 text-destructive" /></Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { setClassRows((p) => [...p, { courseType: classCourseType, courseName: classCourseName, institution: classInstitution, startDate: classStart ? format(classStart,'dd/MM/yyyy') : '', endDate: classEnd ? format(classEnd,'dd/MM/yyyy') : '', details: classDetails }]); setClassCourseType(''); setClassCourseName(''); setClassInstitution(''); setClassDetails(''); setClassStart(undefined); setClassEnd(undefined); }}><Plus className="size-3 text-green-600" /></Button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Course Type</span>
                  <Select value={classCourseType} onValueChange={setClassCourseType}>
                    <SelectTrigger className="h-7 text-sm flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English Language</SelectItem>
                      <SelectItem value="vocational">Vocational</SelectItem>
                      <SelectItem value="higher-ed">Higher Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <span className="text-sm text-secondary-foreground shrink-0">Course Name</span>
                  <Input className="h-7 text-sm flex-1" value={classCourseName} onChange={(e) => setClassCourseName(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Institution</span>
                <Input className="h-7 text-sm flex-1" value={classInstitution} onChange={(e) => setClassInstitution(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Details</span>
                <Input className="h-7 text-sm flex-1" value={classDetails} onChange={(e) => setClassDetails(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-24">Start Date</span>
                  <DatePicker value={classStart} onChange={setClassStart} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setClassStart(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground shrink-0">End Date</span>
                  <DatePicker value={classEnd} onChange={setClassEnd} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setClassEnd(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
            </div>
          </SectionBox>
        </div>
      </div>

      {/* ── Medical ── */}
      <div className="border border-border rounded-md overflow-hidden">
        <div className="bg-accent/60 px-3 py-1.5 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-mono uppercase tracking-wide">MEDICAL &mdash; Has the applicant ever:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-secondary-foreground">Show Detailed Question Text</span>
            <Checkbox
              id="show-detail-text"
              checked={showDetailedText}
              onCheckedChange={(v) => setShowDetailedText(!!v)}
            />
          </div>
        </div>
        <div className="overflow-auto">
          {/* Table header */}
          <div className="grid min-w-[600px] bg-accent/40 border-b border-border" style={{ gridTemplateColumns: showDetailedText ? '2fr 160px 32px 1fr' : '160px 32px 1fr' }}>
            {showDetailedText && <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-r border-border">Question</span>}
            <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-r border-border">Question in Brief</span>
            <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-r border-border text-center">✓</span>
            <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Details / Reason</span>
          </div>
          {MEDICAL_QUESTIONS.map((q, i) => (
            <div
              key={i}
              className={cn(
                'grid min-w-[600px] border-b border-border last:border-0',
                ROW_COLORS[i % ROW_COLORS.length],
              )}
              style={{ gridTemplateColumns: showDetailedText ? '2fr 160px 32px 1fr' : '160px 32px 1fr' }}
            >
              {showDetailedText && (
                <span className="px-3 py-2 text-xs text-secondary-foreground border-r border-border leading-relaxed">{q.question}</span>
              )}
              <span className="px-3 py-2 text-xs font-medium text-mono border-r border-border flex items-start">{q.brief}</span>
              <div className="flex items-center justify-center border-r border-border">
                <Checkbox
                  checked={medAnswers[i]?.checked}
                  onCheckedChange={(v) => setMedAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, checked: !!v } : a))}
                />
              </div>
              <div className="flex items-center gap-1 px-2">
                <Input
                  className="h-6 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 flex-1"
                  placeholder="Details / Reason"
                  value={medAnswers[i]?.details}
                  onChange={(e) => setMedAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, details: e.target.value } : a))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Future Tab ──────────────────────────────────────────────────────────────
const FUTURE_SUB_TABS = [
  'Intended Employment',
  'Proposed Travel',
  'Intended Study',
  'Events',
  'Funds',
  'Future Addresses',
];

const PAID_OPTIONS = ['Full Time', 'Part Time', 'Casual', 'Volunteer', 'Unpaid'];
const INDUSTRY_TYPES = [
  'Agriculture','Construction','Education','Finance','Healthcare',
  'Hospitality','Information Technology','Manufacturing','Mining',
  'Professional Services','Retail','Transport','Other',
];
const TRAVEL_PURPOSE_OPTIONS = ['Holiday','Business','Study','Transit','Other'];
const STUDY_TYPE_OPTIONS = ['Full Time','Part Time','Online','Other'];
const FUND_TYPE_OPTIONS = ['Savings','Investment','Gift','Loan','Other'];
const FUND_CURRENCY_OPTIONS = ['AUD','USD','EUR','GBP','NZD','Other'];

function FutureTab() {
  const [futureSubTab, setFutureSubTab] = useState('Intended Employment');

  // ── Intended Employment ──
  type EmpRow = { startDate: string; endDate: string; employerName: string; tradingName: string; abn: string; industryType: string; position: string };
  const [empRows, setEmpRows]         = useState<EmpRow[]>([]);
  const [empSubTab, setEmpSubTab]     = useState('Position Details');
  const [empStart, setEmpStart]       = useState<Date | undefined>();
  const [empEnd, setEmpEnd]           = useState<Date | undefined>();
  const [empPaid, setEmpPaid]         = useState('');
  const [empSalary, setEmpSalary]     = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [empDuties, setEmpDuties]     = useState('');
  // Business Details
  const [empEmployerName, setEmpEmployerName] = useState('');
  const [empTradingName, setEmpTradingName]   = useState('');
  const [empAbn, setEmpAbn]                   = useState('');
  const [empIndustryType, setEmpIndustryType] = useState('');
  // Business Addresses
  const [empStreet, setEmpStreet]     = useState('');
  const [empStreet2, setEmpStreet2]   = useState('');
  const [empCity, setEmpCity]         = useState('');
  const [empState, setEmpState]       = useState('');
  const [empPostcode, setEmpPostcode] = useState('');
  const [empCountry, setEmpCountry]   = useState('');

  const addEmpRow = () => {
    if (!empStart && !empEmployerName) return;
    setEmpRows((p) => [...p, {
      startDate: empStart ? format(empStart,'dd/MM/yyyy') : '',
      endDate: empEnd ? format(empEnd,'dd/MM/yyyy') : '',
      employerName: empEmployerName, tradingName: empTradingName,
      abn: empAbn, industryType: empIndustryType, position: empPosition,
    }]);
  };

  // ── Proposed Travel ──
  type TravelRow = { from: string; to: string; country: string; purpose: string; details: string };
  const [travelRows, setTravelRows]   = useState<TravelRow[]>([]);
  const [travelFrom, setTravelFrom]   = useState<Date | undefined>();
  const [travelTo, setTravelTo]       = useState<Date | undefined>();
  const [travelCountry, setTravelCountry] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('');
  const [travelDetails, setTravelDetails] = useState('');

  // ── Intended Study ──
  type StudyRow = { startDate: string; endDate: string; institution: string; course: string; studyType: string; details: string };
  const [studyRows, setStudyRows]     = useState<StudyRow[]>([]);
  const [studyStart, setStudyStart]   = useState<Date | undefined>();
  const [studyEnd, setStudyEnd]       = useState<Date | undefined>();
  const [studyInstitution, setStudyInstitution] = useState('');
  const [studyCourse, setStudyCourse] = useState('');
  const [studyType, setStudyType]     = useState('');
  const [studyDetails, setStudyDetails] = useState('');

  // ── Events ──
  type EventRow = { date: string; description: string; details: string };
  const [eventRows, setEventRows]     = useState<EventRow[]>([]);
  const [eventDate, setEventDate]     = useState<Date | undefined>();
  const [eventDesc, setEventDesc]     = useState('');
  const [eventDetails, setEventDetails] = useState('');

  // ── Funds ──
  type FundRow = { fundType: string; amount: string; currency: string; details: string };
  const [fundRows, setFundRows]       = useState<FundRow[]>([]);
  const [fundType, setFundType]       = useState('');
  const [fundAmount, setFundAmount]   = useState('');
  const [fundCurrency, setFundCurrency] = useState('');
  const [fundDetails, setFundDetails] = useState('');

  // ── Future Addresses ──
  type AddrRow = { from: string; to: string; street: string; city: string; country: string };
  const [addrRows, setAddrRows]       = useState<AddrRow[]>([]);
  const [addrFrom, setAddrFrom]       = useState<Date | undefined>();
  const [addrTo, setAddrTo]           = useState<Date | undefined>();
  const [addrStreet, setAddrStreet]   = useState('');
  const [addrStreet2, setAddrStreet2] = useState('');
  const [addrCity, setAddrCity]       = useState('');
  const [addrState, setAddrState]     = useState('');
  const [addrPostcode, setAddrPostcode] = useState('');
  const [addrCountry, setAddrCountry] = useState('');

  return (
    <div className="flex flex-col gap-3">
      {/* Future top sub-tab bar */}
      <div className="flex items-center border-b border-border gap-0">
        {FUTURE_SUB_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setFutureSubTab(t)}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shrink-0 transition-colors ${
              futureSubTab === t
                ? 'bg-primary text-primary-foreground'
                : 'text-secondary-foreground hover:bg-accent/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Intended Employment ── */}
      {futureSubTab === 'Intended Employment' && (
        <div className="flex flex-col gap-3">
          {/* Table */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 100px 1fr 1fr' }}>
              {['Start Date','End Date','Employer Name','Trading Name','ABN','Industry Type','Position'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {empRows.length === 0 ? <div className="h-20 bg-muted/20" /> : empRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 100px 1fr 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.startDate}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.endDate}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.employerName}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.tradingName}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.abn}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.industryType}</span>
                  <span className="px-2 py-1 text-xs truncate">{r.position}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setEmpRows((p) => p.slice(0,-1))} disabled={empRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={addEmpRow}><Plus className="size-3 text-green-600" /></Button>
          </div>

          {/* Position/Business/Address sub-tabs */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="flex items-center border-b border-border bg-accent/20">
              {['Position Details','Business Details','Business Addresses'].map((t) => (
                <button key={t} onClick={() => setEmpSubTab(t)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shrink-0 transition-colors ${
                    empSubTab === t ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground hover:bg-accent/60'
                  }`}>{t}</button>
              ))}
            </div>
            <div className="p-4">
              {empSubTab === 'Position Details' && (
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">Start Date</span>
                    <DatePicker value={empStart} onChange={setEmpStart} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setEmpStart(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">End Date</span>
                    <DatePicker value={empEnd} onChange={setEmpEnd} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setEmpEnd(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">Paid</span>
                    <Select value={empPaid} onValueChange={setEmpPaid}>
                      <SelectTrigger className="h-7 text-xs w-48"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>{PAID_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">Salary</span>
                    <Input className="h-7 text-xs flex-1" value={empSalary} onChange={(e) => setEmpSalary(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">Position</span>
                    <Input className="h-7 text-xs flex-1" value={empPosition} onChange={(e) => setEmpPosition(e.target.value)} />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right pt-1">Duties</span>
                    <textarea className="flex-1 rounded-sm border border-border bg-background text-xs px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px]" value={empDuties} onChange={(e) => setEmpDuties(e.target.value)} rows={5} />
                  </div>
                </div>
              )}
              {empSubTab === 'Business Details' && (
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-28 shrink-0 text-right">Employer Name</span>
                    <Input className="h-7 text-xs flex-1" value={empEmployerName} onChange={(e) => setEmpEmployerName(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-28 shrink-0 text-right">Trading Name</span>
                    <Input className="h-7 text-xs flex-1" value={empTradingName} onChange={(e) => setEmpTradingName(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-28 shrink-0 text-right">ABN</span>
                    <Input className="h-7 text-xs flex-1" value={empAbn} onChange={(e) => setEmpAbn(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-28 shrink-0 text-right">Industry Type</span>
                    <Select value={empIndustryType} onValueChange={setEmpIndustryType}>
                      <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>{INDUSTRY_TYPES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {empSubTab === 'Business Addresses' && (
                <div className="flex flex-col gap-3 max-w-md">
                  {[{label:'Street',val:empStreet,set:setEmpStreet},{label:'Street2',val:empStreet2,set:setEmpStreet2}].map(({label,val,set}) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">{label}</span>
                      <Input className="h-7 text-xs flex-1" value={val} onChange={(e) => set(e.target.value)} />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">City</span>
                    <Input className="h-7 text-xs flex-1" value={empCity} onChange={(e) => setEmpCity(e.target.value)} />
                    <span className="text-xs text-secondary-foreground shrink-0">State</span>
                    <Input className="h-7 text-xs w-24" value={empState} onChange={(e) => setEmpState(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-20 shrink-0 text-right">Postcode</span>
                    <Input className="h-7 text-xs w-24" value={empPostcode} onChange={(e) => setEmpPostcode(e.target.value)} />
                    <span className="text-xs text-secondary-foreground shrink-0">Country</span>
                    <div className="flex-1"><CountryCombobox value={empCountry} onChange={setEmpCountry} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Proposed Travel ── */}
      {futureSubTab === 'Proposed Travel' && (
        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr' }}>
              {['From','To','Country','Purpose','Details'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {travelRows.length === 0 ? <div className="h-20 bg-muted/20" /> : travelRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.from}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.to}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.country}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.purpose}</span>
                  <span className="px-2 py-1 text-xs">{r.details}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setTravelRows((p) => p.slice(0,-1))} disabled={travelRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if(travelFrom||travelCountry){setTravelRows((p)=>[...p,{from:travelFrom?format(travelFrom,'dd/MM/yyyy'):'',to:travelTo?format(travelTo,'dd/MM/yyyy'):'',country:travelCountry,purpose:travelPurpose,details:travelDetails}]);setTravelFrom(undefined);setTravelTo(undefined);setTravelCountry('');setTravelPurpose('');setTravelDetails('');} }}><Plus className="size-3 text-green-600" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">Date From</span>
              <div className="flex items-center gap-1.5"><DatePicker value={travelFrom} onChange={setTravelFrom} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setTravelFrom(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">Date To</span>
              <div className="flex items-center gap-1.5"><DatePicker value={travelTo} onChange={setTravelTo} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setTravelTo(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Country</span>
              <div className="flex-1"><CountryCombobox value={travelCountry} onChange={setTravelCountry} /></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Purpose</span>
              <Select value={travelPurpose} onValueChange={setTravelPurpose}>
                <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{TRAVEL_PURPOSE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="text-xs text-secondary-foreground shrink-0">Details</span>
            <Input className="h-7 text-xs flex-1" value={travelDetails} onChange={(e) => setTravelDetails(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Intended Study ── */}
      {futureSubTab === 'Intended Study' && (
        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr 1fr' }}>
              {['Start Date','End Date','Institution','Course','Study Type','Details'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {studyRows.length === 0 ? <div className="h-20 bg-muted/20" /> : studyRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.startDate}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.endDate}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.institution}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.course}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.studyType}</span>
                  <span className="px-2 py-1 text-xs truncate">{r.details}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setStudyRows((p) => p.slice(0,-1))} disabled={studyRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if(studyStart||studyInstitution){setStudyRows((p)=>[...p,{startDate:studyStart?format(studyStart,'dd/MM/yyyy'):'',endDate:studyEnd?format(studyEnd,'dd/MM/yyyy'):'',institution:studyInstitution,course:studyCourse,studyType,details:studyDetails}]);setStudyStart(undefined);setStudyEnd(undefined);setStudyInstitution('');setStudyCourse('');setStudyType('');setStudyDetails('');} }}><Plus className="size-3 text-green-600" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">Start Date</span>
              <div className="flex items-center gap-1.5"><DatePicker value={studyStart} onChange={setStudyStart} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setStudyStart(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">End Date</span>
              <div className="flex items-center gap-1.5"><DatePicker value={studyEnd} onChange={setStudyEnd} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setStudyEnd(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Institution</span>
              <Input className="h-7 text-xs flex-1" value={studyInstitution} onChange={(e) => setStudyInstitution(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Course</span>
              <Input className="h-7 text-xs flex-1" value={studyCourse} onChange={(e) => setStudyCourse(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Study Type</span>
              <Select value={studyType} onValueChange={setStudyType}>
                <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{STUDY_TYPE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Details</span>
              <Input className="h-7 text-xs flex-1" value={studyDetails} onChange={(e) => setStudyDetails(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ── Events ── */}
      {futureSubTab === 'Events' && (
        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
              {['Date','Description','Details'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {eventRows.length === 0 ? <div className="h-20 bg-muted/20" /> : eventRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.date}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.description}</span>
                  <span className="px-2 py-1 text-xs truncate">{r.details}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setEventRows((p) => p.slice(0,-1))} disabled={eventRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if(eventDate||eventDesc){setEventRows((p)=>[...p,{date:eventDate?format(eventDate,'dd/MM/yyyy'):'',description:eventDesc,details:eventDetails}]);setEventDate(undefined);setEventDesc('');setEventDetails('');} }}><Plus className="size-3 text-green-600" /></Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Date</span>
              <DatePicker value={eventDate} onChange={setEventDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setEventDate(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-secondary-foreground shrink-0">Description</span>
              <Input className="h-7 text-xs flex-1" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="text-xs text-secondary-foreground shrink-0">Details</span>
            <Input className="h-7 text-xs flex-1" value={eventDetails} onChange={(e) => setEventDetails(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Funds ── */}
      {futureSubTab === 'Funds' && (
        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 100px 90px 1fr' }}>
              {['Fund Type','Amount','Currency','Details'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {fundRows.length === 0 ? <div className="h-20 bg-muted/20" /> : fundRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '1fr 100px 90px 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.fundType}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.amount}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.currency}</span>
                  <span className="px-2 py-1 text-xs">{r.details}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setFundRows((p) => p.slice(0,-1))} disabled={fundRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if(fundType||fundAmount){setFundRows((p)=>[...p,{fundType,amount:fundAmount,currency:fundCurrency,details:fundDetails}]);setFundType('');setFundAmount('');setFundCurrency('');setFundDetails('');} }}><Plus className="size-3 text-green-600" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Fund Type</span>
              <Select value={fundType} onValueChange={setFundType}>
                <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{FUND_TYPE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Amount</span>
              <Input className="h-7 text-xs flex-1" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Currency</span>
              <Select value={fundCurrency} onValueChange={setFundCurrency}>
                <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{FUND_CURRENCY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Details</span>
              <Input className="h-7 text-xs flex-1" value={fundDetails} onChange={(e) => setFundDetails(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ── Future Addresses ── */}
      {futureSubTab === 'Future Addresses' && (
        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr' }}>
              {['From','To','Street','City','Country'].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
              ))}
            </div>
            <div className="min-h-[80px]">
              {addrRows.length === 0 ? <div className="h-20 bg-muted/20" /> : addrRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '90px 90px 1fr 1fr 1fr' }}>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.from}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.to}</span>
                  <span className="px-2 py-1 text-xs border-r border-border truncate">{r.street}</span>
                  <span className="px-2 py-1 text-xs border-r border-border">{r.city}</span>
                  <span className="px-2 py-1 text-xs">{r.country}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setAddrRows((p) => p.slice(0,-1))} disabled={addrRows.length===0}><Minus className="size-3 text-destructive" /></Button>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if(addrFrom||addrStreet){setAddrRows((p)=>[...p,{from:addrFrom?format(addrFrom,'dd/MM/yyyy'):'',to:addrTo?format(addrTo,'dd/MM/yyyy'):'',street:addrStreet,city:addrCity,country:addrCountry}]);setAddrFrom(undefined);setAddrTo(undefined);setAddrStreet('');setAddrStreet2('');setAddrCity('');setAddrState('');setAddrPostcode('');setAddrCountry('');} }}><Plus className="size-3 text-green-600" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">Date From</span>
              <div className="flex items-center gap-1.5"><DatePicker value={addrFrom} onChange={setAddrFrom} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setAddrFrom(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-secondary-foreground">Date To</span>
              <div className="flex items-center gap-1.5"><DatePicker value={addrTo} onChange={setAddrTo} /><Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setAddrTo(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            {[{label:'Street',val:addrStreet,set:setAddrStreet},{label:'Street2',val:addrStreet2,set:setAddrStreet2}].map(({label,val,set}) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">{label}</span>
                <Input className="h-7 text-xs flex-1" value={val} onChange={(e) => set(e.target.value)} />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">City</span>
              <Input className="h-7 text-xs flex-1" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} />
              <span className="text-xs text-secondary-foreground shrink-0">State</span>
              <Input className="h-7 text-xs w-20" value={addrState} onChange={(e) => setAddrState(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">Postcode</span>
              <Input className="h-7 text-xs w-24" value={addrPostcode} onChange={(e) => setAddrPostcode(e.target.value)} />
              <span className="text-xs text-secondary-foreground shrink-0">Country</span>
              <div className="flex-1"><CountryCombobox value={addrCountry} onChange={setAddrCountry} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dependency Details sub-tab ─────────────────────────────────────────────
function DependencyDetails() {
  const [details, setDetails] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-secondary-foreground">Details</span>
      <textarea
        className="w-full rounded-sm border border-border bg-background text-xs px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[220px]"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={10}
      />
    </div>
  );
}

// ─── Child/Dependant Details sub-tab ────────────────────────────────────────
type CustodyRow = { name: string; natureOfLegalRight: string };

function ChildDependantDetails() {
  const [inPACustody, setInPACustody]           = useState(false);
  const [notInCustodyDetails, setNotInCustodyDetails] = useState('');
  const [legalImpediments, setLegalImpediments] = useState(false);
  const [impedimentDetails, setImpedimentDetails] = useState('');

  const [custodyRows, setCustodyRows]           = useState<CustodyRow[]>([]);
  const [custodyName, setCustodyName]           = useState('');
  const [custodyRight, setCustodyRight]         = useState('');

  const addCustodyRow = () => {
    if (!custodyName && !custodyRight) return;
    setCustodyRows((prev) => [...prev, { name: custodyName, natureOfLegalRight: custodyRight }]);
    setCustodyName('');
    setCustodyRight('');
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Row 1: In PA Custody + Details for not in custody */}
      <div className="flex items-start gap-4 p-3 rounded-sm border border-border bg-muted/10">
        <div className="flex items-start gap-2 w-56 shrink-0">
          <Checkbox
            id="pa-custody"
            checked={inPACustody}
            onCheckedChange={(v) => setInPACustody(!!v)}
            className="size-3.5 mt-0.5"
          />
          <label htmlFor="pa-custody" className="text-xs text-secondary-foreground cursor-pointer leading-snug">
            Child/Dependant is in Primary Applicant&apos;s Legal Custody
          </label>
        </div>
        <div className="flex items-start gap-2 flex-1">
          <span className="text-xs text-secondary-foreground shrink-0 leading-snug pt-0.5">
            Details for Child/Dependant NOT in PA&apos;s Custody
          </span>
          <Input
            className="h-7 text-xs flex-1"
            value={notInCustodyDetails}
            onChange={(e) => setNotInCustodyDetails(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: Legal impediments */}
      <div className="flex items-center gap-4 p-3 rounded-sm border border-border bg-muted/10">
        <div className="flex items-start gap-2 w-56 shrink-0">
          <Checkbox
            id="legal-impediments"
            checked={legalImpediments}
            onCheckedChange={(v) => setLegalImpediments(!!v)}
            className="size-3.5 mt-0.5"
          />
          <label htmlFor="legal-impediments" className="text-xs text-secondary-foreground cursor-pointer leading-snug">
            There are Legal Impediments to Removal of the Child from their Home Country
          </label>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-secondary-foreground shrink-0">Details</span>
          <Input
            className="h-7 text-xs flex-1"
            value={impedimentDetails}
            onChange={(e) => setImpedimentDetails(e.target.value)}
          />
        </div>
      </div>

      {/* Custodial rights table */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-secondary-foreground">
          Other People who have Custodial, Access or Guardian Rights to this Child/Dependant
        </span>
        <div className="border border-border rounded-sm overflow-hidden">
          {/* Header */}
          <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-r border-border">Name</span>
            <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Nature of Legal Right</span>
          </div>
          {/* Rows */}
          <div className="min-h-[100px]">
            {custodyRows.length === 0 ? (
              <div className="h-24 bg-muted/20" />
            ) : (
              custodyRows.map((r, i) => (
                <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/20" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <span className="px-3 py-1.5 text-xs border-r border-border">{r.name}</span>
                  <span className="px-3 py-1.5 text-xs">{r.natureOfLegalRight}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add row controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary-foreground shrink-0 w-10">Name</span>
          <Input
            className="h-7 text-xs flex-1"
            placeholder="Name"
            value={custodyName}
            onChange={(e) => setCustodyName(e.target.value)}
          />
          <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Nature of Legal Right</span>
          <Input
            className="h-7 text-xs flex-1"
            placeholder="Nature of Legal Right"
            value={custodyRight}
            onChange={(e) => setCustodyRight(e.target.value)}
          />
          <Button variant="outline" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => setCustodyRows((p) => p.slice(0, -1))} disabled={custodyRows.length === 0}>
            <Minus className="size-3 text-destructive" />
          </Button>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={addCustodyRow}>
            <Plus className="size-3 text-green-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Spouse Relationship Details 3 sub-tab ─────────────────────────────────
const GENUINE_RELATIONSHIP_OPTIONS = ['Yes', 'No', 'Not Sure'];

type RelAspectRow = { aspect: string; applicantDetails: string; spouseDetails: string };

const REL_ASPECT_ROWS: RelAspectRow[] = [
  { aspect: 'Financial Aspects', applicantDetails: '', spouseDetails: '' },
  { aspect: 'Nature of Household', applicantDetails: '', spouseDetails: '' },
  { aspect: 'Social Aspects', applicantDetails: '', spouseDetails: '' },
  { aspect: 'Commitment', applicantDetails: '', spouseDetails: '' },
];

function SpouseRelationshipDetails3() {
  const [genuineRelationship, setGenuineRelationship] = useState('');
  const [aspectRows, setAspectRows] = useState<RelAspectRow[]>(REL_ASPECT_ROWS);

  const updateAspect = (i: number, field: keyof RelAspectRow, val: string) =>
    setAspectRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="flex flex-col gap-4">
      {/* Question row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-secondary-foreground leading-snug">
          Are you and your partner in a genuine, ongoing relationship together to the exclusion of all others?
        </span>
        <Select value={genuineRelationship} onValueChange={setGenuineRelationship}>
          <SelectTrigger className="h-7 text-xs w-24">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {GENUINE_RELATIONSHIP_OPTIONS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Relationship aspects table */}
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Header */}
        <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '180px 1fr 1fr' }}>
          {['Aspect of Relationship', 'Applicant Details', 'Spouse/Partner Details'].map((h) => (
            <span key={h} className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
          ))}
        </div>
        {/* Rows */}
        {aspectRows.map((row, i) => (
          <div
            key={i}
            className={`grid border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-accent/20' : 'bg-muted/10'}`}
            style={{ gridTemplateColumns: '180px 1fr 1fr' }}
          >
            <span className="px-3 py-2 text-xs font-medium text-secondary-foreground border-r border-border">{row.aspect}</span>
            <textarea
              className="px-2 py-1.5 text-xs bg-transparent border-r border-border resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]"
              value={row.applicantDetails}
              onChange={(e) => updateAspect(i, 'applicantDetails', e.target.value)}
              rows={3}
            />
            <textarea
              className="px-2 py-1.5 text-xs bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]"
              value={row.spouseDetails}
              onChange={(e) => updateAspect(i, 'spouseDetails', e.target.value)}
              rows={3}
            />
          </div>
        ))}
        {/* Empty state */}
        {aspectRows.every((r) => !r.applicantDetails && !r.spouseDetails) && (
          <div className="py-6 text-center text-xs text-muted-foreground border-t border-border">
            No data to display
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Spouse Relationship Details 2 sub-tab ─────────────────────────────────
const BLOOD_RELATION_OPTIONS = ['Yes', 'No', 'Not Sure'];

function SpouseRelationshipDetails2() {
  const [relatedByBlood, setRelatedByBlood]           = useState('');
  const [bloodDetails, setBloodDetails]               = useState('');
  const [registeredRelationship, setRegisteredRelationship] = useState(false);
  const [periodsApart, setPeriodsApart]               = useState('');

  return (
    <div className="flex flex-col gap-5">
      {/* Blood / marriage / adoption question */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-secondary-foreground leading-snug">
          Is this person and their spouse related by blood, marriage or adoption?
        </span>
        <Select value={relatedByBlood} onValueChange={setRelatedByBlood}>
          <SelectTrigger className="h-7 text-xs w-24">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_RELATION_OPTIONS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Details textarea */}
      <div className="flex items-start gap-3">
        <span className="text-xs text-secondary-foreground shrink-0 w-14 pt-1">Details</span>
        <textarea
          className="flex-1 rounded-sm border border-border bg-background text-xs px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px]"
          value={bloodDetails}
          onChange={(e) => setBloodDetails(e.target.value)}
          rows={4}
        />
      </div>

      {/* Registered relationship checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="reg-prescribed"
          checked={registeredRelationship}
          onCheckedChange={(v) => setRegisteredRelationship(!!v)}
          className="size-3.5"
        />
        <label htmlFor="reg-prescribed" className="text-xs text-secondary-foreground cursor-pointer">
          Relationship Registered as Prescribed Relationship in Australia
        </label>
      </div>

      {/* Periods and Reasons for Living Apart */}
      <div className="flex items-start gap-3">
        <span className="text-xs text-secondary-foreground shrink-0 w-24 pt-1 leading-snug">
          Periods and Reasons for Living Apart
        </span>
        <textarea
          className="flex-1 rounded-sm border border-border bg-background text-xs px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px]"
          value={periodsApart}
          onChange={(e) => setPeriodsApart(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}

// ─── Spouse Relationship Details sub-tab ────────────────────────────────────
const RELATIONSHIP_SUB_TYPES = [
  'Married','De Facto','Engaged','Separated','Divorced','Widowed',
  'Prospective Spouse','Long-term Relationship','Other',
];
const CEASE_HOW_OPTIONS = ['Death','Divorce','Separation','Annulment','Other'];

function SpouseRelationshipDetails() {
  const [relSubType, setRelSubType]           = useState('');
  const [noOfChildren, setNoOfChildren]       = useState('');

  // Date fields
  const [meetDate, setMeetDate]               = useState<Date | undefined>();
  const [meetPlace, setMeetPlace]             = useState('');
  const [beginDate, setBeginDate]             = useState<Date | undefined>();
  const [togetherSince, setTogetherSince]     = useState<Date | undefined>();
  const [commitmentDate, setCommitmentDate]   = useState<Date | undefined>();
  const [engagementDate, setEngagementDate]   = useState<Date | undefined>();
  const [engagementPlace, setEngagementPlace] = useState('');
  const [weddingDate, setWeddingDate]         = useState<Date | undefined>();
  const [weddingPlace, setWeddingPlace]       = useState('');
  const [marriageDate, setMarriageDate]       = useState<Date | undefined>();
  const [marriagePlace, setMarriagePlace]     = useState('');
  const [ceaseDate, setCeaseDate]             = useState<Date | undefined>();
  const [ceaseHow, setCeaseHow]               = useState('');

  // Living together address
  const [street, setStreet]                   = useState('');
  const [street2, setStreet2]                 = useState('');
  const [city, setCity]                       = useState('');
  const [state, setState]                     = useState('');
  const [postcode, setPostcode]               = useState('');
  const [country, setCountry]                 = useState('');
  const [celebrant, setCelebrant]             = useState('');

  type DRow = { label: string; date: Date | undefined; setDate: (d: Date | undefined) => void; place?: string; setPlace?: (s: string) => void; extra?: React.ReactNode };

  const dateRows: DRow[] = [
    { label: 'Meet', date: meetDate, setDate: setMeetDate, place: meetPlace, setPlace: setMeetPlace },
    { label: 'Begin Relationship', date: beginDate, setDate: setBeginDate },
    { label: 'Living Together Since', date: togetherSince, setDate: setTogetherSince },
    { label: 'Commitment Date', date: commitmentDate, setDate: setCommitmentDate },
    { label: 'Engagement Date', date: engagementDate, setDate: setEngagementDate, place: engagementPlace, setPlace: setEngagementPlace },
    { label: 'Proposed Wedding Date', date: weddingDate, setDate: setWeddingDate, place: weddingPlace, setPlace: setWeddingPlace },
    { label: 'Date of Marriage', date: marriageDate, setDate: setMarriageDate, place: marriagePlace, setPlace: setMarriagePlace },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold text-mono">Spouse Relationship Details</span>

      {/* RelSubType + No. of Children */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Relationship SubType</span>
          <Select value={relSubType} onValueChange={setRelSubType}>
            <SelectTrigger className="h-7 text-xs w-52">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_SUB_TYPES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">No. of Children</span>
          <Input className="h-7 text-xs w-16" value={noOfChildren} onChange={(e) => setNoOfChildren(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Date events ── */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-secondary-foreground mb-1">
            When did/does this person and their partner/spouse…
          </span>
          <div className="flex flex-col gap-2">
            {dateRows.map(({ label, date, setDate, place, setPlace }) => (
              <div key={label} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-secondary-foreground text-right shrink-0 w-44">{label}</span>
                <DatePicker value={date} onChange={setDate} />
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDate(undefined)}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
                {setPlace !== undefined && (
                  <>
                    <span className="text-xs text-secondary-foreground shrink-0">Place</span>
                    <Input className="h-7 text-xs w-36" value={place ?? ''} onChange={(e) => setPlace(e.target.value)} />
                  </>
                )}
              </div>
            ))}
            {/* Cease Relationship row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-secondary-foreground text-right shrink-0 w-44">Cease Relationship</span>
              <DatePicker value={ceaseDate} onChange={setCeaseDate} />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setCeaseDate(undefined)}>
                <RotateCcw className="size-3 mr-1" />Reset
              </Button>
              <span className="text-xs text-secondary-foreground shrink-0">How</span>
              <Select value={ceaseHow} onValueChange={setCeaseHow}>
                <SelectTrigger className="h-7 text-xs w-36">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {CEASE_HOW_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Right: Living together address ── */}
        <div className="flex flex-col gap-3">
          <span className="text-xs text-secondary-foreground">
            This Person and their Partner/Spouse Started Living Together At
          </span>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Street',  value: street,   set: setStreet,   wide: true },
              { label: 'Street2', value: street2,  set: setStreet2,  wide: true },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">{label}</span>
                <Input className="h-7 text-xs flex-1" value={value} onChange={(e) => set(e.target.value)} />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">City</span>
              <Input className="h-7 text-xs flex-1" value={city} onChange={(e) => setCity(e.target.value)} />
              <span className="text-xs text-secondary-foreground shrink-0">State</span>
              <Input className="h-7 text-xs w-24" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">Postcode</span>
              <Input className="h-7 text-xs w-24" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
              <span className="text-xs text-secondary-foreground shrink-0">Country</span>
              <div className="flex-1"><CountryCombobox value={country} onChange={setCountry} /></div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-secondary-foreground w-16 shrink-0 text-right">Celebrant</span>
              <Input className="h-7 text-xs flex-1" value={celebrant} onChange={(e) => setCelebrant(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Relations Tab ────────────────────────────────────────────────────────────
const RELATION_TYPES = [
  'Spouse/De Facto','Child','Parent','Sibling','Other Relative','Friend','Employer','Other',
];
const GENDER_OPTIONS = ['Male','Female','Non-Binary','Prefer Not to Say'];
const MARITAL_OPTIONS = ['Single','Married','De Facto','Divorced','Widowed','Separated'];
const RELATION_SUB_TABS = [
  'Details',
  'Spouse Relationship Details',
  'Spouse Relationship Details 2',
  'Spouse Relationship Details 3',
  'Child/Dependant Details',
  'Dependency Details',
];

function RelationsTab() {
  // ── Main relations table ──
  type RelationRow = {
    surname: string; givenNames: string; gender: string; dob: string;
    maritalStatus: string; depOnPA: boolean; depOnOther: boolean;
    included: boolean; sponsor: boolean; incapacitated: boolean;
    suppWitness: boolean; countryOfResidence: string; relationship: string;
  };
  const [relations, setRelations] = useState<RelationRow[]>([]);
  const [selectedRelIdx, setSelectedRelIdx] = useState<number | null>(null);
  const [subTab, setSubTab] = useState('Details');

  // ── Details sub-tab fields ──
  const [relationType, setRelationType]           = useState('');
  const [familyName, setFamilyName]               = useState('');
  const [givenNames, setGivenNames]               = useState('');
  const [otherNamesSummary, setOtherNamesSummary] = useState('');
  const [gender, setGender]                       = useState('');
  const [dob, setDob]                             = useState<Date | undefined>();
  const [maritalStatus, setMaritalStatus]         = useState('');
  const [deceased, setDeceased]                   = useState(false);
  const [deceasedDate, setDeceasedDate]           = useState<Date | undefined>();

  // Citizenships
  const [townOfBirth, setTownOfBirth]             = useState('');
  const [countryOfBirth, setCountryOfBirth]       = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [citizenship, setCitizenship]             = useState('');
  const [citizenshipGrant, setCitizenshipGrant]   = useState<Date | undefined>();
  const [otherCitizenship, setOtherCitizenship]   = useState('');
  const [otherCitizenshipGrant, setOtherCitizenshipGrant] = useState<Date | undefined>();

  // Flags
  const [isDependent, setIsDependent]             = useState(false);
  const [isIncluded, setIsIncluded]               = useState(false);
  const [isFamilySponsor, setIsFamilySponsor]     = useState(false);
  const [isIncapacitated, setIsIncapacitated]     = useState(false);
  const [isSuppWitness, setIsSuppWitness]         = useState(false);

  const addRelation = () => {
    setRelations((prev) => [...prev, {
      surname: familyName, givenNames, gender, dob: dob ? format(dob,'dd/MM/yyyy') : '',
      maritalStatus, depOnPA: isDependent, depOnOther: false,
      included: isIncluded, sponsor: isFamilySponsor,
      incapacitated: isIncapacitated, suppWitness: isSuppWitness,
      countryOfResidence, relationship: relationType,
    }]);
  };

  const TABLE_COLS = 'minmax(90px,1fr) minmax(100px,1.2fr) 64px 80px minmax(90px,1fr) 80px 80px 60px 60px 100px 90px minmax(100px,1fr) minmax(90px,1fr)';

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main relations table ── */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 1100 }}>
            {/* Header */}
            <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: TABLE_COLS }}>
              {[
                'Surname','Given Names','Gender','D.O.B','Marital Status',
                'Dependent on PA','Dependent on Other','Included','Sponsor',
                'Incapacitated for work','Supp Witness','Country of Residence','Relationship',
              ].map((h) => (
                <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0 truncate">{h}</span>
              ))}
            </div>
            {/* Rows */}
            <div className="min-h-[140px]">
              {relations.length === 0 ? (
                <div className="h-36 bg-muted/20" />
              ) : (
                relations.map((r, i) => (
                  <div
                    key={i}
                    className={`grid border-b border-border last:border-0 cursor-pointer ${selectedRelIdx === i ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/30'}`}
                    style={{ gridTemplateColumns: TABLE_COLS }}
                    onClick={() => setSelectedRelIdx(i === selectedRelIdx ? null : i)}
                  >
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.surname}</span>
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.givenNames}</span>
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.gender}</span>
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.dob}</span>
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.maritalStatus}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.depOnPA ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.depOnOther ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.included ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.sponsor ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.incapacitated ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border text-center">{r.suppWitness ? '✓' : ''}</span>
                    <span className="px-2 py-1 text-xs border-r border-border truncate">{r.countryOfResidence}</span>
                    <span className="px-2 py-1 text-xs truncate">{r.relationship}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row action buttons ── */}
      <div className="flex items-center justify-end gap-1.5">
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { setRelations((p) => p.filter((_, i) => i !== selectedRelIdx)); setSelectedRelIdx(null); }} disabled={selectedRelIdx === null}><Minus className="size-3 text-destructive" /></Button>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={addRelation}><Plus className="size-3 text-green-600" /></Button>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Sub-tab bar */}
        <div className="flex items-center border-b border-border bg-accent/30 overflow-x-auto">
          {RELATION_SUB_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shrink-0 transition-colors ${
                subTab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary-foreground hover:bg-accent/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-4">
          {subTab === 'Details' && (
            <div className="flex flex-col gap-4">
              {/* "This person is ... 's" */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground shrink-0">This person is John Smith&apos;s...</span>
                <Select value={relationType} onValueChange={setRelationType}>
                  <SelectTrigger className="h-7 text-xs w-48">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATION_TYPES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left column ── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Family Name</span>
                    <Input className="h-7 text-xs flex-1" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Given Names</span>
                    <Input className="h-7 text-xs flex-1" value={givenNames} onChange={(e) => setGivenNames(e.target.value)} />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right pt-1">Other Names Summary</span>
                    <textarea
                      className="flex-1 rounded-sm border border-border bg-background text-xs px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[52px]"
                      value={otherNamesSummary}
                      onChange={(e) => setOtherNamesSummary(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Gender</span>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Date of Birth</span>
                    <DatePicker value={dob} onChange={setDob} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDob(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Marital Status</span>
                    <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARITAL_OPTIONS.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-32 shrink-0 text-right">Deceased</span>
                    <Checkbox checked={deceased} onCheckedChange={(v) => setDeceased(!!v)} className="size-3.5" />
                    <span className="text-xs text-secondary-foreground ml-2 shrink-0">Date</span>
                    <DatePicker value={deceasedDate} onChange={setDeceasedDate} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDeceasedDate(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                </div>

                {/* ── Middle column — Citizenships ── */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-mono">Citizenships</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Town of Birth</span>
                    <Input className="h-7 text-xs flex-1" value={townOfBirth} onChange={(e) => setTownOfBirth(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Country of Birth</span>
                    <div className="flex-1"><CountryCombobox value={countryOfBirth} onChange={setCountryOfBirth} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Country of Residence</span>
                    <div className="flex-1"><CountryCombobox value={countryOfResidence} onChange={setCountryOfResidence} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Citizenship</span>
                    <Input className="h-7 text-xs flex-1" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Date of Grant</span>
                    <DatePicker value={citizenshipGrant} onChange={setCitizenshipGrant} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setCitizenshipGrant(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Other Citizenship</span>
                    <Input className="h-7 text-xs flex-1" value={otherCitizenship} onChange={(e) => setOtherCitizenship(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-foreground w-36 shrink-0 text-right">Date of Grant</span>
                    <DatePicker value={otherCitizenshipGrant} onChange={setOtherCitizenshipGrant} />
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setOtherCitizenshipGrant(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                  </div>
                </div>

                {/* ── Right column — Flags ── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 p-3 rounded-sm border border-border bg-muted/20">
                    <Checkbox checked={isDependent} onCheckedChange={(v) => setIsDependent(!!v)} className="size-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs text-secondary-foreground leading-snug">
                      This person is dependent on the following person:
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-sm border border-border bg-muted/20">
                    <Checkbox checked={isIncluded} onCheckedChange={(v) => setIsIncluded(!!v)} className="size-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs text-secondary-foreground leading-snug">
                      This person is included in the application
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-sm border border-border bg-muted/20">
                    <Checkbox checked={isFamilySponsor} onCheckedChange={(v) => setIsFamilySponsor(!!v)} className="size-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs text-secondary-foreground leading-snug">
                      This person is the Family Sponsor
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-sm border border-border bg-muted/20">
                    <Checkbox checked={isIncapacitated} onCheckedChange={(v) => setIsIncapacitated(!!v)} className="size-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs text-secondary-foreground leading-snug">
                      This person is incapacitated for work
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-sm border border-border bg-muted/20">
                    <Checkbox checked={isSuppWitness} onCheckedChange={(v) => setIsSuppWitness(!!v)} className="size-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs text-secondary-foreground leading-snug">
                      This person is a Supporting Witness for PA/Spouse Relationship
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'Spouse Relationship Details' && (
            <SpouseRelationshipDetails />
          )}

          {subTab === 'Spouse Relationship Details 2' && (
            <SpouseRelationshipDetails2 />
          )}

          {subTab === 'Spouse Relationship Details 3' && (
            <SpouseRelationshipDetails3 />
          )}

          {subTab === 'Child/Dependant Details' && (
            <ChildDependantDetails />
          )}

          {subTab === 'Dependency Details' && (
            <DependencyDetails />
          )}

          {subTab !== 'Details' && subTab !== 'Spouse Relationship Details' && subTab !== 'Spouse Relationship Details 2' && subTab !== 'Spouse Relationship Details 3' && subTab !== 'Child/Dependant Details' && subTab !== 'Dependency Details' && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {subTab} — coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const CHARACTER_QUESTIONS = [
  { question: 'Have you ever been convicted of a crime or offence in any country (including any conviction which is now removed from official records)?', brief: 'Any Convictions?' },
  { question: 'Have you ever been charged with an offence in any country that is currently awaiting legal action?', brief: 'Charged with Offence?' },
  { question: 'Have you been the subject of an arrest warrant or Interpol Notice?', brief: 'Arrest Warrant or Interpol Notice' },
  { question: 'Have you ever been the subject of a domestic violence or family violence order?', brief: 'Domestic Violence Order' },
  { question: 'Have you ever been involved in any activities or been a member of any group or organisation that has been involved in criminal conduct?', brief: 'Criminal Activities/Groups' },
  { question: 'Have you ever been removed, deported or excluded from any country?', brief: 'Removed/Deported?' },
  { question: 'Have you ever been refused a visa or entry to any country?', brief: 'Visa Refused?' },
  { question: 'Have you ever been involved in terrorism, war crimes, crimes against humanity, or genocide?', brief: 'Terrorism/War Crimes?' },
  { question: 'Have you been a member of any organisation involved in totalitarian or subversive activities?', brief: 'Subversive Organisation?' },
];

type CharAnswer = { country: string; date: string; offenceType: string; details: string };

function CharacterTab() {
  // Police Clearance
  type PoliceClearanceRow = { appDate: string; issueDate: string; refNo: string; country: string };
  const [policeRows, setPoliceRows]   = useState<PoliceClearanceRow[]>([]);
  const [policeAppDate, setPoliceAppDate]   = useState<Date | undefined>();
  const [policeIssueDate, setPoliceIssueDate] = useState<Date | undefined>();
  const [policeRefNo, setPoliceRefNo]   = useState('');
  const [policeCountry, setPoliceCountry] = useState('');

  // Immigration Detention
  type DetentionRow = { from: string; to: string; details: string; country: string };
  const [detRows, setDetRows]         = useState<DetentionRow[]>([]);
  const [detFrom, setDetFrom]         = useState<Date | undefined>();
  const [detTo, setDetTo]             = useState<Date | undefined>();
  const [detCountry, setDetCountry]   = useState('');
  const [detDetails, setDetDetails]   = useState('');

  // Military/Police/Intelligence Officer Service
  type MilServiceRow = { from: string; to: string; service: string; type: string; orgUnit: string; posRank: string; deployment: string; duties: string };
  const [milServiceRows, setMilServiceRows] = useState<MilServiceRow[]>([]);
  const [msFrom, setMsFrom]           = useState<Date | undefined>();
  const [msTo, setMsTo]               = useState<Date | undefined>();
  const [msServiceCountry, setMsServiceCountry] = useState('');
  const [msServiceType, setMsServiceType] = useState('');
  const [msOrgUnit, setMsOrgUnit]     = useState('');
  const [msPosRank, setMsPosRank]     = useState('');
  const [msDeploymentCtry, setMsDeploymentCtry] = useState('');
  const [msDuties, setMsDuties]       = useState('');

  // Military/Paramilitary/Weapons/Chemical Training
  type MilTrainingRow = { from: string; to: string; country: string; type: string; details: string };
  const [milTrainRows, setMilTrainRows] = useState<MilTrainingRow[]>([]);
  const [mtFrom, setMtFrom]           = useState<Date | undefined>();
  const [mtTo, setMtTo]               = useState<Date | undefined>();
  const [mtCountry, setMtCountry]     = useState('');
  const [mtTrainingType, setMtTrainingType] = useState('');
  const [mtDetails, setMtDetails]     = useState('');

  // Character questions
  const [showDetailedText, setShowDetailedText] = useState(true);
  const [charAnswers, setCharAnswers] = useState<CharAnswer[]>(
    CHARACTER_QUESTIONS.map(() => ({ country: '', date: '', offenceType: '', details: '' }))
  );
  const [charChecked, setCharChecked] = useState<boolean[]>(
    CHARACTER_QUESTIONS.map(() => false)
  );

  const updateCharAnswer = (i: number, field: keyof CharAnswer, value: string) => {
    setCharAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  const ROW_COLORS = [
    'bg-primary/10', 'bg-accent/30', 'bg-muted/20', 'bg-accent/20', 'bg-primary/5',
    'bg-muted/30', 'bg-accent/40', 'bg-primary/15', 'bg-muted/10',
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Top two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Police Clearance */}
        <SectionBox title="Police Clearance">
          <div className="flex flex-col gap-2">
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                {['Application Date','Issue Date','Reference No.','Clearance Country'].map((h) => (
                  <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                ))}
              </div>
              <div className="min-h-[60px]">
                {policeRows.length === 0 ? <div className="h-16 bg-muted/20" /> : policeRows.map((r, i) => (
                  <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.appDate}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.issueDate}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.refNo}</span>
                    <span className="px-2 py-1 text-xs">{r.country}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setPoliceRows((p) => p.slice(0,-1))} disabled={policeRows.length===0}><Minus className="size-3 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (policeAppDate || policeIssueDate || policeRefNo || policeCountry) { setPoliceRows((p) => [...p, { appDate: policeAppDate ? format(policeAppDate,'dd/MM/yyyy') : '', issueDate: policeIssueDate ? format(policeIssueDate,'dd/MM/yyyy') : '', refNo: policeRefNo, country: policeCountry }]); setPoliceAppDate(undefined); setPoliceIssueDate(undefined); setPoliceRefNo(''); setPoliceCountry(''); } }}><Plus className="size-3 text-green-600" /></Button>
            </div>
            {/* App. Date & Issue Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">App. Date</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={policeAppDate} onChange={setPoliceAppDate} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setPoliceAppDate(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Issue Date</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={policeIssueDate} onChange={setPoliceIssueDate} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setPoliceIssueDate(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0">Country</span>
                <div className="flex-1"><CountryCombobox value={policeCountry} onChange={setPoliceCountry} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Reference Number</span>
                <Input className="h-7 text-xs flex-1" value={policeRefNo} onChange={(e) => setPoliceRefNo(e.target.value)} />
              </div>
            </div>
          </div>
        </SectionBox>

        {/* RIGHT: Immigration Detention */}
        <SectionBox title="Immigration Detention">
          <div className="flex flex-col gap-2">
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                {['From','To','Details','Detention Country'].map((h) => (
                  <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                ))}
              </div>
              <div className="min-h-[60px]">
                {detRows.length === 0 ? <div className="h-16 bg-muted/20" /> : detRows.map((r, i) => (
                  <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.from}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.to}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.details}</span>
                    <span className="px-2 py-1 text-xs">{r.country}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setDetRows((p) => p.slice(0,-1))} disabled={detRows.length===0}><Minus className="size-3 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (detFrom || detTo || detDetails || detCountry) { setDetRows((p) => [...p, { from: detFrom ? format(detFrom,'dd/MM/yyyy') : '', to: detTo ? format(detTo,'dd/MM/yyyy') : '', details: detDetails, country: detCountry }]); setDetFrom(undefined); setDetTo(undefined); setDetDetails(''); setDetCountry(''); } }}><Plus className="size-3 text-green-600" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date From</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={detFrom} onChange={setDetFrom} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDetFrom(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date To</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={detTo} onChange={setDetTo} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setDetTo(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0">Country</span>
                <div className="flex-1"><CountryCombobox value={detCountry} onChange={setDetCountry} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0">Details</span>
                <Input className="h-7 text-xs flex-1" value={detDetails} onChange={(e) => setDetDetails(e.target.value)} />
              </div>
            </div>
          </div>
        </SectionBox>
      </div>

      {/* ── Second two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Military/Police/Intelligence Officer Service */}
        <SectionBox title="Military/Police/Intelligence Officer Service">
          <div className="flex flex-col gap-2">
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '70px 70px 1fr 1fr 1fr 1fr 1fr 1fr' }}>
                {['From','To','Service','Type','Org/Unit/Br','Position/Rank','Deployment','Duties'].map((h) => (
                  <span key={h} className="px-1.5 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0 truncate">{h}</span>
                ))}
              </div>
              <div className="min-h-[60px]">
                {milServiceRows.length === 0 ? <div className="h-16 bg-muted/20" /> : milServiceRows.map((r, i) => (
                  <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '70px 70px 1fr 1fr 1fr 1fr 1fr 1fr' }}>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.from}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.to}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.service}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.type}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.orgUnit}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.posRank}</span>
                    <span className="px-1.5 py-1 text-xs border-r border-border truncate">{r.deployment}</span>
                    <span className="px-1.5 py-1 text-xs truncate">{r.duties}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setMilServiceRows((p) => p.slice(0,-1))} disabled={milServiceRows.length===0}><Minus className="size-3 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (msFrom || msTo || msServiceCountry || msServiceType) { setMilServiceRows((p) => [...p, { from: msFrom ? format(msFrom,'dd/MM/yyyy') : '', to: msTo ? format(msTo,'dd/MM/yyyy') : '', service: msServiceCountry, type: msServiceType, orgUnit: msOrgUnit, posRank: msPosRank, deployment: msDeploymentCtry, duties: msDuties }]); setMsFrom(undefined); setMsTo(undefined); setMsServiceCountry(''); setMsServiceType(''); setMsOrgUnit(''); setMsPosRank(''); setMsDeploymentCtry(''); setMsDuties(''); } }}><Plus className="size-3 text-green-600" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date From</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={msFrom} onChange={setMsFrom} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setMsFrom(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date To</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={msTo} onChange={setMsTo} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setMsTo(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Service Country</span>
                <div className="flex-1"><CountryCombobox value={msServiceCountry} onChange={setMsServiceCountry} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Service Type</span>
                <Input className="h-7 text-xs flex-1" value={msServiceType} onChange={(e) => setMsServiceType(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Organisation/Unit</span>
                <Input className="h-7 text-xs flex-1" value={msOrgUnit} onChange={(e) => setMsOrgUnit(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Position/Rank</span>
                <Input className="h-7 text-xs flex-1" value={msPosRank} onChange={(e) => setMsPosRank(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Deployment Ctry</span>
                <div className="flex-1"><CountryCombobox value={msDeploymentCtry} onChange={setMsDeploymentCtry} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0">Duties</span>
                <Input className="h-7 text-xs flex-1" value={msDuties} onChange={(e) => setMsDuties(e.target.value)} />
              </div>
            </div>
          </div>
        </SectionBox>

        {/* RIGHT: Military/Paramilitary/Weapons/Chemical Training */}
        <SectionBox title="Military/Paramilitary/Weapons/Chemical Training">
          <div className="flex flex-col gap-2">
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="grid bg-accent/60 border-b border-border" style={{ gridTemplateColumns: '80px 80px 1fr 1fr 1fr' }}>
                {['From','To','Country','Type','Details'].map((h) => (
                  <span key={h} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
                ))}
              </div>
              <div className="min-h-[60px]">
                {milTrainRows.length === 0 ? <div className="h-16 bg-muted/20" /> : milTrainRows.map((r, i) => (
                  <div key={i} className="grid border-b border-border last:border-0 hover:bg-accent/30" style={{ gridTemplateColumns: '80px 80px 1fr 1fr 1fr' }}>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.from}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.to}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.country}</span>
                    <span className="px-2 py-1 text-xs border-r border-border">{r.type}</span>
                    <span className="px-2 py-1 text-xs">{r.details}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setMilTrainRows((p) => p.slice(0,-1))} disabled={milTrainRows.length===0}><Minus className="size-3 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => { if (mtFrom || mtTo || mtCountry || mtTrainingType) { setMilTrainRows((p) => [...p, { from: mtFrom ? format(mtFrom,'dd/MM/yyyy') : '', to: mtTo ? format(mtTo,'dd/MM/yyyy') : '', country: mtCountry, type: mtTrainingType, details: mtDetails }]); setMtFrom(undefined); setMtTo(undefined); setMtCountry(''); setMtTrainingType(''); setMtDetails(''); } }}><Plus className="size-3 text-green-600" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date From</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={mtFrom} onChange={setMtFrom} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setMtFrom(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-secondary-foreground">Date To</span>
                <div className="flex items-center gap-1.5">
                  <DatePicker value={mtTo} onChange={setMtTo} />
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 shrink-0" onClick={() => setMtTo(undefined)}><RotateCcw className="size-3 mr-1" />Reset</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0">Country</span>
                <div className="flex-1"><CountryCombobox value={mtCountry} onChange={setMtCountry} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground shrink-0 whitespace-nowrap">Training Type</span>
                <Input className="h-7 text-xs flex-1" value={mtTrainingType} onChange={(e) => setMtTrainingType(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-foreground shrink-0">Details</span>
              <Input className="h-7 text-xs flex-1" value={mtDetails} onChange={(e) => setMtDetails(e.target.value)} />
            </div>
          </div>
        </SectionBox>
      </div>

      {/* ── CHARACTER questions table ── */}
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-accent/60 border-b border-border">
          <span className="text-xs font-semibold text-mono uppercase tracking-wide">CHARACTER — Has the applicant ever:</span>
          <div className="flex items-center gap-2">
            <label className="text-xs text-secondary-foreground cursor-pointer select-none" htmlFor="char-show-detail">
              Show Detailed Question Text
            </label>
            <Checkbox
              id="char-show-detail"
              checked={showDetailedText}
              onCheckedChange={(v) => setShowDetailedText(!!v)}
            />
          </div>
        </div>
        {/* Column headers */}
        <div className="grid bg-muted/40 border-b border-border" style={{ gridTemplateColumns: showDetailedText ? '260px 160px 24px 120px 100px 120px 1fr' : '160px 24px 120px 100px 120px 1fr' }}>
          {(showDetailedText ? ['Question','Question in Brief','','Country','Date','Offence Type','Details'] : ['Question in Brief','','Country','Date','Offence Type','Details']).map((h, i) => (
            <span key={i} className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-r border-border last:border-0">{h}</span>
          ))}
        </div>
        {/* Rows */}
        {CHARACTER_QUESTIONS.map((q, i) => {
          const ans = charAnswers[i];
          const isChecked = charChecked[i];
          const rowBg = isChecked ? 'bg-primary text-primary-foreground' : ROW_COLORS[i % ROW_COLORS.length];
          const cols = showDetailedText
            ? '260px 160px 24px 120px 100px 120px 1fr'
            : '160px 24px 120px 100px 120px 1fr';
          return (
            <div
              key={i}
              className={`grid border-b border-border last:border-0 ${rowBg}`}
              style={{ gridTemplateColumns: cols }}
            >
              {showDetailedText && (
                <span className="px-2 py-1.5 text-xs border-r border-border leading-snug">{q.question}</span>
              )}
              <span className={`px-2 py-1.5 text-xs border-r border-border font-medium ${isChecked ? 'text-primary-foreground' : 'text-mono'}`}>{q.brief}</span>
              <div className="flex items-center justify-center border-r border-border">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(v) => setCharChecked((prev) => prev.map((c, idx) => idx === i ? !!v : c))}
                  className="size-3.5"
                />
              </div>
              <Input
                className={`h-full rounded-none border-0 border-r border-border text-xs px-1.5 focus-visible:ring-0 bg-transparent ${isChecked ? 'placeholder:text-primary-foreground/60' : ''}`}
                placeholder="Country"
                value={ans.country}
                onChange={(e) => updateCharAnswer(i, 'country', e.target.value)}
              />
              <Input
                className={`h-full rounded-none border-0 border-r border-border text-xs px-1.5 focus-visible:ring-0 bg-transparent ${isChecked ? 'placeholder:text-primary-foreground/60' : ''}`}
                placeholder="Date"
                value={ans.date}
                onChange={(e) => updateCharAnswer(i, 'date', e.target.value)}
              />
              <Input
                className={`h-full rounded-none border-0 border-r border-border text-xs px-1.5 focus-visible:ring-0 bg-transparent ${isChecked ? 'placeholder:text-primary-foreground/60' : ''}`}
                placeholder="Offence Type"
                value={ans.offenceType}
                onChange={(e) => updateCharAnswer(i, 'offenceType', e.target.value)}
              />
              <Input
                className={`h-full rounded-none border-0 text-xs px-1.5 focus-visible:ring-0 bg-transparent ${isChecked ? 'placeholder:text-primary-foreground/60' : ''}`}
                placeholder="Details"
                value={ans.details}
                onChange={(e) => updateCharAnswer(i, 'details', e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const INNER_TABS = [
  'Particulars',
  'Identity',
  'Addresses',
  'Employment',
  'Education',
  'Language',
  'Talent',
  'Skills',
  'Asmt',
  'Business',
  'Visas',
  'Visits',
  'Health',
  'Character',
  'Relations',
  'Future',
];

export function Applicant() {
  const [person, setPerson]           = useState('smith-john');
  const [personIdx, setPersonIdx]     = useState(0);
  const [includeNonApp, setIncludeNonApp] = useState(false);

  const navigate = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(PERSONS.length - 1, personIdx + dir));
    setPersonIdx(next);
    setPerson(PERSONS[next].value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Person bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-secondary-foreground shrink-0">Person</span>
        <Select value={person} onValueChange={setPerson}>
          <SelectTrigger className="h-8 text-sm w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERSONS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(1)}>
          <ChevronRight className="size-4" />
        </Button>

        <div className="flex items-center gap-1.5 ml-2">
          <Checkbox
            id="include-non-app"
            checked={includeNonApp}
            onCheckedChange={(v) => setIncludeNonApp(!!v)}
          />
          <label htmlFor="include-non-app" className="text-sm text-secondary-foreground cursor-pointer whitespace-nowrap">
            Include Non-Applicants
          </label>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          Relationship to Primary Applicant
        </span>
      </div>

      {/* ── Inner sub-tabs ── */}
      <Tabs defaultValue="particulars" className="w-full">
        <div className="border-b border-border">
          <TabsList
            variant="line"
            size="sm"
            className="w-full justify-start overflow-x-auto gap-0 bg-transparent p-0 h-auto flex-wrap"
          >
            {INNER_TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="px-3 py-2 rounded-none text-xs font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="pt-4">
          <TabsContent value="particulars" className="mt-0">
            <ParticularsTab />
          </TabsContent>

          <TabsContent value="identity" className="mt-0">
            <IdentityTab />
          </TabsContent>

          <TabsContent value="addresses" className="mt-0">
            <AddressesTab />
          </TabsContent>

          <TabsContent value="employment" className="mt-0">
            <EmploymentTab />
          </TabsContent>

          <TabsContent value="education" className="mt-0">
            <EducationTab />
          </TabsContent>

          <TabsContent value="language" className="mt-0">
            <LanguageTab />
          </TabsContent>

          <TabsContent value="talent" className="mt-0">
            <TalentTab />
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <SkillsTab />
          </TabsContent>

          <TabsContent value="asmt" className="mt-0">
            <AsmtTab />
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <BusinessTab />
          </TabsContent>

          <TabsContent value="visas" className="mt-0">
            <VisasTab />
          </TabsContent>

          <TabsContent value="visits" className="mt-0">
            <VisitsTab />
          </TabsContent>

          <TabsContent value="health" className="mt-0">
            <HealthTab />
          </TabsContent>

          <TabsContent value="character" className="mt-0">
            <CharacterTab />
          </TabsContent>

          <TabsContent value="relations" className="mt-0">
            <RelationsTab />
          </TabsContent>

          <TabsContent value="future" className="mt-0">
            <FutureTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
