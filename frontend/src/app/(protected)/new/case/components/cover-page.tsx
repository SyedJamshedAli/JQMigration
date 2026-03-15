'use client';

import { useState } from 'react';
import { Mail, FileText, Bell, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CountrySelect } from './country-select';

function SectionBox({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-accent/60 px-3 py-1.5 border-b border-border">
        <span className="text-xs font-semibold text-mono uppercase tracking-wide">
          {title}
        </span>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  children,
  labelWidth = 'w-32',
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
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
        <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">Suburb</span>
        <Input className="h-7 text-sm flex-1" placeholder="Suburb" />
        <span className="text-sm text-secondary-foreground shrink-0">City/Town</span>
        <Input className="h-7 text-sm flex-1" placeholder="City / Town" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">State</span>
        <Input className="h-7 text-sm flex-1" placeholder="State" />
        <span className="text-sm text-secondary-foreground shrink-0">Postcode</span>
        <Input className="h-7 text-sm w-28" placeholder="Postcode" />
      </div>
      <FieldRow label="Country">
        <Input className="h-7 text-sm" placeholder="Country" />
      </FieldRow>
    </div>
  );
}

export function CoverPage() {
  const [useSponsor, setUseSponsor] = useState(false);
  const [phoneCodes, setPhoneCodes] = useState<Record<string, string>>({ home: 'au', work: 'au', fax: 'au' });
  const [prefEmail, setPrefEmail] = useState('');
  const [altEmail, setAltEmail] = useState('');
  const [fileStatus, setFileStatus] = useState('open');
  const [client, setClient] = useState('client');
  const [referral, setReferral] = useState('referral');
  const [category, setCategory] = useState('cat1');
  const [matterType, setMatterType] = useState('type1');
  const [feeType, setFeeType] = useState('fixed');

  const isValidEmail = (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col gap-3">
        {/* Filename */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-secondary-foreground shrink-0 w-20">
            Filename:
          </Label>
          <Input className="h-8 text-sm flex-1" placeholder="Enter filename..." />
        </div>

        {/* Contact Person */}
        <SectionBox title="Contact Person">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="use-sponsor"
                  checked={useSponsor}
                  onCheckedChange={(v) => setUseSponsor(!!v)}
                />
                <label htmlFor="use-sponsor" className="text-sm text-secondary-foreground cursor-pointer">
                  Use Sponsor's own details
                </label>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                Select Contact
              </Button>
            </div>
            <FieldRow label="Surname">
              <Input className="h-7 text-sm" />
            </FieldRow>
            <FieldRow label="Given Names">
              <Input className="h-7 text-sm" />
            </FieldRow>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">
                Preferred Name
              </span>
              <Input className="h-7 text-sm flex-1" />
              <span className="text-sm text-secondary-foreground shrink-0">Prefix</span>
              <Input className="h-7 text-sm w-20" />
            </div>
            <FieldRow label="Position">
              <Input className="h-7 text-sm" />
            </FieldRow>
          </div>
        </SectionBox>

        {/* Contact Person Addresses */}
        <SectionBox title="Contact Person Addresses">
          <Tabs defaultValue="contact-details">
            <TabsList variant="button" size="xs" className="mb-3">
              <TabsTrigger value="contact-details">
                Contact Details
              </TabsTrigger>
              <TabsTrigger value="physical">
                Physical
              </TabsTrigger>
              <TabsTrigger value="correspondence">
                Correspondence
              </TabsTrigger>
              <TabsTrigger value="overseas">
                Overseas
              </TabsTrigger>
            </TabsList>

            {/* Contact Details */}
            <TabsContent value="contact-details">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <span className="w-32 shrink-0" />
                  <span className="w-28">Country</span>
                  <span className="flex-1">Number</span>
                </div>
                {[
                  { label: 'Home Telephone', key: 'home' },
                  { label: 'Work Telephone', key: 'work' },
                  { label: 'Fax', key: 'fax' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">
                      {row.label}
                    </span>
                    <CountrySelect
                      value={phoneCodes[row.key]}
                      onChange={(v) => setPhoneCodes((prev) => ({ ...prev, [row.key]: v }))}
                    />
                    <Input className="h-7 text-sm flex-1" placeholder="Phone number" />
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">
                    Mobile/Cell
                  </span>
                  <Input className="h-7 text-sm flex-1" placeholder="Mobile number" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Preferred E-mail',  value: prefEmail, onChange: setPrefEmail, valid: isValidEmail(prefEmail) },
                    { label: 'Alternative E-mail', value: altEmail,  onChange: setAltEmail,  valid: isValidEmail(altEmail)  },
                  ].map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary-foreground text-right shrink-0 w-32">
                          {row.label}
                        </span>
                        <Input
                          className={`h-7 text-sm flex-1 ${!row.valid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          type="email"
                          value={row.value}
                          onChange={(e) => row.onChange(e.target.value)}
                          placeholder="email@example.com"
                        />
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                          <Mail className="size-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                      {!row.valid && (
                        <p className="text-xs text-destructive pl-[8.5rem]">Enter a valid email address</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Shared address fields for Physical / Correspondence / Overseas */}
            {(['physical', 'correspondence', 'overseas'] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <AddressFields />
              </TabsContent>
            ))}
          </Tabs>
        </SectionBox>

        {/* Summary Filenote */}
        <SectionBox title="Summary Filenote">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <FileText className="size-3.5" />
                Open Filenote
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Bell className="size-3.5" />
                Reminder
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <CalendarIcon className="size-3.5" />
                Add to Outlook
              </Button>
            </div>
            <Textarea
              className="min-h-[120px] text-sm resize-none"
              placeholder="Enter summary filenote..."
            />
          </div>
        </SectionBox>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col gap-3">
        <Card>
          <CardContent className="p-4 flex flex-col gap-3">
            {/* File Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                File Status
              </span>
              <Select value={fileStatus} onValueChange={setFileStatus}>
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger className="h-8 text-sm w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Referral/Source */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                Referral/Source
              </span>
              <Select value={referral} onValueChange={setReferral}>
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-8 text-sm px-2.5 shrink-0">
                ...
              </Button>
            </div>

            {/* Last Contact */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                Last Contact
              </span>
              <Input className="h-8 text-sm flex-1" type="date" />
              <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 shrink-0">
                Reset
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 shrink-0">
                Today
              </Button>
            </div>

            {/* Intended Lodgement */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                Intended Lodgement
              </span>
              <Input className="h-8 text-sm flex-1" type="date" />
              <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 shrink-0">
                Reset
              </Button>
            </div>

            {/* Alternative Ref */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-36">
                Alternative Ref
              </span>
              <Input className="h-8 text-sm flex-1" />
              <Button variant="outline" size="sm" className="h-8 text-xs px-3 shrink-0">
                More
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-3">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">
                Category
              </span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Partner Visa</SelectItem>
                  <SelectItem value="cat2">Skilled Migration</SelectItem>
                  <SelectItem value="cat3">Student Visa</SelectItem>
                  <SelectItem value="cat4">Employer Sponsored</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Matter Type */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">
                Matter Type
              </span>
              <Select value={matterType} onValueChange={setMatterType}>
                <SelectTrigger className="h-8 text-sm flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">Onshore Partner 820/801</SelectItem>
                  <SelectItem value="type2">Offshore Partner 309/100</SelectItem>
                  <SelectItem value="type3">Prospective Marriage 300</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stream */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">
                Stream
              </span>
              <Select disabled>
                <SelectTrigger className="h-8 text-sm flex-1 bg-muted">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Stream 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="flex items-start gap-2">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-28 pt-1.5">
                Description
              </span>
              <Textarea className="flex-1 min-h-[80px] text-sm resize-none" placeholder="Enter description..." />
            </div>

            {/* Fee ExTax */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-secondary-foreground text-right shrink-0 w-28">
                Fee ExTax
              </span>
              <Input className="h-8 text-sm w-24" placeholder="0.00" />
              <Select value={feeType} onValueChange={setFeeType}>
                <SelectTrigger className="h-8 text-sm w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-secondary-foreground">Deposit</span>
              <Input className="h-8 text-sm w-24" placeholder="0.00" />
              <span className="text-sm text-secondary-foreground">Est Time</span>
              <Input className="h-8 text-sm w-20" placeholder="0" />
            </div>
          </CardContent>
        </Card>

        {/* Sponsor + Applicants table */}
        <Card className="flex-1">
          <CardContent className="p-0 flex flex-col">
            {/* Sponsor row */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <span className="text-sm text-secondary-foreground shrink-0 w-16">Sponsor</span>
              <Input className="h-7 text-sm flex-1" placeholder="Sponsor name..." />
              <Button variant="outline" size="sm" className="h-7 text-xs px-3 shrink-0">
                GoTo
              </Button>
            </div>

            {/* Grid header */}
            <div className="grid border-b border-border text-xs font-semibold text-mono bg-accent/60"
              style={{ gridTemplateColumns: '1fr auto 1fr auto' }}>
              <span className="px-3 py-2 border-r border-border">Applicant&apos;s Full Name</span>
              <span className="px-3 py-2 border-r border-border w-24 text-center">D.O.B.</span>
              <span className="px-3 py-2 border-r border-border">Relationship to Main Applicant</span>
              <span className="px-3 py-2 w-14"></span>
            </div>

            {/* Grid rows */}
            <div className="flex-1 min-h-[60px]">
              {[
                { name: 'John Smith', dob: '', relationship: 'Primary Applicant' },
                { name: '', dob: '', relationship: '' },
                { name: '', dob: '', relationship: '' },
              ].map((row, i) => (
                <div
                  key={i}
                  className="grid border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors"
                  style={{ gridTemplateColumns: '1fr auto 1fr auto' }}
                >
                  <span className="px-3 py-2 border-r border-border text-sm">{row.name}</span>
                  <span className="px-3 py-2 border-r border-border text-sm w-24 text-center">{row.dob}</span>
                  <span className="px-3 py-2 border-r border-border text-sm">{row.relationship}</span>
                  <div className="px-2 py-1.5 w-14 flex items-center justify-center">
                    {row.name && (
                      <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                        GoTo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border">
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-base leading-none">
                −
              </Button>
              <Button size="sm" className="h-7 w-7 p-0 text-base leading-none">
                +
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
