'use client';

import { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import {
  Toolbar,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SectionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="bg-accent/60 px-3 py-1.5 border-b border-border">
        <span className="text-xs font-semibold text-mono uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  children,
  required = false,
  error,
  labelWidth = 'w-28',
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  labelWidth?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 min-h-[28px]">
        <span className={`text-sm text-secondary-foreground text-right shrink-0 ${labelWidth}`}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </span>
        <div className="flex-1">{children}</div>
      </div>
      {error && <p className="text-xs text-destructive ml-34">{error}</p>}
    </div>
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

  const validateEmail = (email: string) => {
    return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateFormData = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    } else if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.cell.trim()) newErrors.cell = 'Cell phone is required';
    
    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact person name is required';
    }
    if (!validateEmail(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Enter a valid email address';
    } else if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    }
    if (!formData.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = 'Contact person phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFormData()) {
      console.log('Form submitted:', formData);
      // TODO: Send to backend
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

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
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-4">
            {/* Organization Details */}
            <SectionBox title="Organization Details">
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <FieldRow
                    label="Last Name"
                    required
                    error={errors.lastName}
                  >
                    <Input
                      className={`h-8 text-sm ${
                        errors.lastName ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow
                    label="First Name"
                    required
                    error={errors.firstName}
                  >
                    <Input
                      className={`h-8 text-sm ${
                        errors.firstName ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Address" required error={errors.address} labelWidth="w-40">
                  <Input
                    className={`h-8 text-sm ${
                      errors.address ? 'border-destructive' : ''
                    }`}
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </FieldRow>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <FieldRow label="City" required error={errors.city} labelWidth="w-24">
                    <Input
                      className={`h-8 text-sm ${
                        errors.city ? 'border-destructive' : ''
                      }`}
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow label="State" required error={errors.state} labelWidth="w-24">
                    <Input
                      className={`h-8 text-sm ${
                        errors.state ? 'border-destructive' : ''
                      }`}
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow label="Country" required error={errors.country} labelWidth="w-32">
                    <Select value={formData.country} onValueChange={(v) => handleChange('country', v)}>
                      <SelectTrigger className={`h-8 text-sm ${
                        errors.country ? 'border-destructive' : ''
                      }`}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="nz">New Zealand</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldRow>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <FieldRow label="Email" required error={errors.email}>
                    <div className="relative">
                      <Input
                        className={`h-8 text-sm ${
                          errors.email ? 'border-destructive' : ''
                        }`}
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      {!errors.email && formData.email && (
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </FieldRow>
                  <FieldRow label="Cell" required error={errors.cell}>
                    <Input
                      className={`h-8 text-sm ${
                        errors.cell ? 'border-destructive' : ''
                      }`}
                      placeholder="+1 (555) 000-0000"
                      value={formData.cell}
                      onChange={(e) => handleChange('cell', e.target.value)}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="Phone" error={errors.phone}>
                  <Input
                    className={`h-8 text-sm ${
                      errors.phone ? 'border-destructive' : ''
                    }`}
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </FieldRow>
              </div>
            </SectionBox>

            {/* Contact Person */}
            <SectionBox title="Contact Person">
              <div className="space-y-2.5">
                <FieldRow
                  label="Name"
                  required
                  error={errors.contactPersonName}
                  labelWidth="w-32"
                >
                  <Input
                    className={`h-8 text-sm ${
                      errors.contactPersonName ? 'border-destructive' : ''
                    }`}
                    placeholder="Enter contact person name"
                    value={formData.contactPersonName}
                    onChange={(e) =>
                      handleChange('contactPersonName', e.target.value)
                    }
                  />
                </FieldRow>

                <FieldRow
                  label="Email"
                  required
                  error={errors.contactPersonEmail}
                  labelWidth="w-32"
                >
                  <div className="relative">
                    <Input
                      className={`h-8 text-sm ${
                        errors.contactPersonEmail ? 'border-destructive' : ''
                      }`}
                      type="email"
                      placeholder="email@example.com"
                      value={formData.contactPersonEmail}
                      onChange={(e) =>
                        handleChange('contactPersonEmail', e.target.value)
                      }
                    />
                    {!errors.contactPersonEmail &&
                      formData.contactPersonEmail && (
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      )}
                  </div>
                </FieldRow>

                <FieldRow
                  label="Phone"
                  required
                  error={errors.contactPersonPhone}
                  labelWidth="w-32"
                >
                  <Input
                    className={`h-8 text-sm ${
                      errors.contactPersonPhone ? 'border-destructive' : ''
                    }`}
                    placeholder="+1 (555) 000-0000"
                    value={formData.contactPersonPhone}
                    onChange={(e) =>
                      handleChange('contactPersonPhone', e.target.value)
                    }
                  />
                </FieldRow>
              </div>
            </SectionBox>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" type="reset">
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save Organization
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}
