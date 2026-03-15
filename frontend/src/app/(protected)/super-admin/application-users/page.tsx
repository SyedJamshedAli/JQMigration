'use client';

import { useState } from 'react';
import { Mail, Check, ChevronsUpDown, Send } from 'lucide-react';
import {
  Toolbar,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/app/(protected)/new/case/components/country-select';

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-accent/60 px-4 py-2 border-b border-border">
        <span className="text-xs font-semibold text-mono uppercase tracking-wide">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CountryPicker({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-9 w-full justify-between px-3 text-sm font-normal',
            hasError ? 'border-destructive' : ''
          )}
        >
          <span className="truncate">{selected ? selected.name : 'Select country'}</span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." className="h-8 text-sm" />
          <CommandList className="max-h-52 overflow-y-auto">
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No country found
            </CommandEmpty>
            {COUNTRIES.map((c) => (
              <CommandItem
                key={c.code}
                value={`${c.name} ${c.dial}`}
                onSelect={() => {
                  onChange(c.code === value ? '' : c.code);
                  setOpen(false);
                }}
                className="text-xs"
              >
                <Check className={cn('mr-2 size-3', value === c.code ? 'opacity-100' : 'opacity-0')} />
                <span className="flex-1">{c.name}</span>
                <span className="text-muted-foreground ml-2">{c.dial}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ApplicationUsersPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    country: '',
    cell: '',
    username: '',
    role: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidEmail = (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!isValidEmail(formData.email)) e.email = 'Invalid email';
    if (!formData.country) e.country = 'Required';
    if (!formData.cell.trim()) e.cell = 'Required';
    if (!formData.username.trim()) e.username = 'Required';
    if (!formData.role) e.role = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Send invitation:', formData);
      // TODO: Send invitation to backend
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const inputCls = (field: string) =>
    cn('h-9 text-sm w-full', errors[field] ? 'border-destructive' : '');

  return (
    <>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Application Users" />
          </ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* LEFT — User Details */}
              <SectionBox title="User Details">
                <div className="flex flex-col gap-4">

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Last Name" required error={errors.lastName}>
                      <Input
                        className={inputCls('lastName')}
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                      />
                    </Field>
                    <Field label="First Name" required error={errors.firstName}>
                      <Input
                        className={inputCls('firstName')}
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                      />
                    </Field>
                  </div>

                  <Field label="Email" required error={errors.email}>
                    <div className="relative">
                      <Input
                        className={inputCls('email')}
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      {!errors.email && isValidEmail(formData.email) && formData.email && (
                        <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-green-500" />
                      )}
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Country" required error={errors.country}>
                      <CountryPicker
                        value={formData.country}
                        onChange={(v) => handleChange('country', v)}
                        hasError={!!errors.country}
                      />
                    </Field>
                    <Field label="Cell" required error={errors.cell}>
                      <Input
                        className={inputCls('cell')}
                        placeholder="+1 (555) 000-0000"
                        value={formData.cell}
                        onChange={(e) => handleChange('cell', e.target.value)}
                      />
                    </Field>
                  </div>

                </div>
              </SectionBox>

              {/* RIGHT — Account + Actions */}
              <div className="flex flex-col gap-6">
                <SectionBox title="Account">
                  <div className="flex flex-col gap-4">

                    <Field label="Username" required error={errors.username}>
                      <Input
                        className={inputCls('username')}
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                      />
                    </Field>

                    <Field label="Role" required error={errors.role}>
                      <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                        <SelectTrigger className={cn('h-9 text-sm w-full', errors.role ? 'border-destructive' : '')}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super-admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                  </div>
                </SectionBox>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setFormData({
                        lastName: '', firstName: '', email: '', country: '',
                        cell: '', username: '', role: '',
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" className="gap-1.5">
                    <Send className="size-3.5" />
                    Send Invitation
                  </Button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </Container>

      <Container>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-[20px]">
          <div className="bg-accent/60 px-4 py-2 border-b border-border">
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Application Users List</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 border-b border-border text-xs font-semibold text-mono bg-muted/30 min-w-[700px]">
              <span className="px-3 py-2 border-r border-border">Last Name</span>
              <span className="px-3 py-2 border-r border-border">First Name</span>
              <span className="px-3 py-2 border-r border-border">Email</span>
              <span className="px-3 py-2 border-r border-border">Country</span>
              <span className="px-3 py-2 border-r border-border">Cell</span>
              <span className="px-3 py-2">Role</span>
            </div>
            {[
              { lastName: 'Roberts',  firstName: 'James',   email: 'james.roberts@example.com',  country: 'United States',  cell: '+1 (555) 876-5432',  role: 'Super Admin' },
              { lastName: 'Anderson', firstName: 'Lisa',    email: 'lisa.anderson@example.co.uk', country: 'United Kingdom', cell: '+44 7700 900123',    role: 'Admin' },
              { lastName: 'Taylor',   firstName: 'Mark',    email: 'mark.taylor@example.com',     country: 'Australia',      cell: '+61 498 765 432',    role: 'Admin' },
              { lastName: 'Garcia',   firstName: 'Sofia',   email: 'sofia.garcia@example.ca',     country: 'Canada',         cell: '+1 (604) 555-0234',  role: 'Super Admin' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-6 border-b border-border last:border-b-0 min-w-[700px] hover:bg-accent/30 transition-colors">
                <span className="px-3 py-2 border-r border-border text-sm">{row.lastName}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.firstName}</span>
                <span className="px-3 py-2 border-r border-border text-sm text-blue-600 dark:text-blue-400">{row.email}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.country}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.cell}</span>
                <span className="px-3 py-2 text-sm">{row.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}