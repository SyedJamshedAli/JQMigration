'use client';

import { useState } from 'react';
import { Mail, Check, ChevronsUpDown } from 'lucide-react';
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

export default function OrganizationPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    address: '',
    city: '',
    state: '',
    email: '',
    country: '',
    cell: '',
    phone: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidEmail = (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.address.trim()) e.address = 'Required';
    if (!formData.city.trim()) e.city = 'Required';
    if (!formData.state.trim()) e.state = 'Required';
    if (!formData.country) e.country = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!isValidEmail(formData.email)) e.email = 'Invalid email';
    if (!formData.cell.trim()) e.cell = 'Required';
    if (!formData.contactPersonName.trim()) e.contactPersonName = 'Required';
    if (!formData.contactPersonEmail.trim()) e.contactPersonEmail = 'Required';
    else if (!isValidEmail(formData.contactPersonEmail)) e.contactPersonEmail = 'Invalid email';
    if (!formData.contactPersonPhone.trim()) e.contactPersonPhone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Saved:', formData);
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
            <ToolbarPageTitle text="Organization" />
          </ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* Organization Details */}
              <SectionBox title="Organization Details">
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

                  <Field label="Address" required error={errors.address}>
                    <Input
                      className={inputCls('address')}
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </Field>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="City" required error={errors.city}>
                      <Input
                        className={inputCls('city')}
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                      />
                    </Field>
                    <Field label="State" required error={errors.state}>
                      <Input
                        className={inputCls('state')}
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      />
                    </Field>
                    <Field label="Country" required error={errors.country}>
                      <CountryPicker
                        value={formData.country}
                        onChange={(v) => handleChange('country', v)}
                        hasError={!!errors.country}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                    <Field label="Cell" required error={errors.cell}>
                      <Input
                        className={inputCls('cell')}
                        placeholder="+1 (555) 000-0000"
                        value={formData.cell}
                        onChange={(e) => handleChange('cell', e.target.value)}
                      />
                    </Field>
                  </div>

                  <Field label="Phone">
                    <Input
                      className="h-9 text-sm w-full"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </Field>

                </div>
              </SectionBox>

              {/* Contact Person + Actions */}
              <div className="flex flex-col gap-6">
                <SectionBox title="Contact Person">
                  <div className="flex flex-col gap-4">

                    <Field label="Name" required error={errors.contactPersonName}>
                      <Input
                        className={inputCls('contactPersonName')}
                        placeholder="Contact person name"
                        value={formData.contactPersonName}
                        onChange={(e) => handleChange('contactPersonName', e.target.value)}
                      />
                    </Field>

                    <Field label="Email" required error={errors.contactPersonEmail}>
                      <div className="relative">
                        <Input
                          className={inputCls('contactPersonEmail')}
                          type="email"
                          placeholder="email@example.com"
                          value={formData.contactPersonEmail}
                          onChange={(e) => handleChange('contactPersonEmail', e.target.value)}
                        />
                        {!errors.contactPersonEmail && isValidEmail(formData.contactPersonEmail) && formData.contactPersonEmail && (
                          <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-green-500" />
                        )}
                      </div>
                    </Field>

                    <Field label="Phone" required error={errors.contactPersonPhone}>
                      <Input
                        className={inputCls('contactPersonPhone')}
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactPersonPhone}
                        onChange={(e) => handleChange('contactPersonPhone', e.target.value)}
                      />
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
                        lastName: '', firstName: '', address: '', city: '',
                        state: '', email: '', country: '', cell: '', phone: '',
                        contactPersonName: '', contactPersonEmail: '', contactPersonPhone: '',
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit">
                    Save Organization
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
            <span className="text-xs font-semibold text-mono uppercase tracking-wide">Organizations List</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 border-b border-border text-xs font-semibold text-mono bg-muted/30 min-w-[640px]">
              <span className="px-3 py-2 border-r border-border">Last Name</span>
              <span className="px-3 py-2 border-r border-border">First Name</span>
              <span className="px-3 py-2 border-r border-border">City</span>
              <span className="px-3 py-2 border-r border-border">Country</span>
              <span className="px-3 py-2 border-r border-border">Email</span>
              <span className="px-3 py-2">Phone</span>
            </div>
            {[
              { lastName: 'Smith',    firstName: 'John',    city: 'New York',  country: 'United States',   email: 'john.smith@example.com',       phone: '+1 (212) 555-0101' },
              { lastName: 'Johnson',  firstName: 'Emily',   city: 'London',    country: 'United Kingdom',   email: 'emily.johnson@example.co.uk',  phone: '+44 20 7946 0958' },
              { lastName: 'Martinez', firstName: 'Carlos',  city: 'Sydney',    country: 'Australia',        email: 'carlos.martinez@example.com',  phone: '+61 2 9876 5432'  },
              { lastName: 'Nguyen',   firstName: 'Linh',    city: 'Toronto',   country: 'Canada',           email: 'linh.nguyen@example.ca',       phone: '+1 (416) 555-0198' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-6 border-b border-border last:border-b-0 min-w-[640px] hover:bg-accent/30 transition-colors">
                <span className="px-3 py-2 border-r border-border text-sm">{row.lastName}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.firstName}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.city}</span>
                <span className="px-3 py-2 border-r border-border text-sm">{row.country}</span>
                <span className="px-3 py-2 border-r border-border text-sm text-blue-600 dark:text-blue-400">{row.email}</span>
                <span className="px-3 py-2 text-sm">{row.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}