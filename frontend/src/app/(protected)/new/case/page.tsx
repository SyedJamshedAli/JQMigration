'use client';

import { Fragment, useState } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarDays, Download, FileText, ListChecks, Users, UserCog, Building2, Scale, StickyNote, CreditCard, BarChart2, FolderOpen, UserCheck, Award } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoverPage } from './components/cover-page';
import { NewClient } from './components/new-client';
import { Applicant } from './components/applicant';

const TABS = [
  { label: 'New Client',  value: 'new-client',  icon: Users     },
  { label: 'Cover Page',  value: 'cover-page',  icon: FileText  },
  { label: 'Applicant',   value: 'applicant',   icon: UserCheck  },
  { label: 'Sponsor',     value: 'sponsor',     icon: Award      },
  { label: 'Contacts',    value: 'contacts',     icon: Users      },
  { label: 'Staff',       value: 'staff',        icon: UserCog    },
  { label: 'Dept',        value: 'dept',         icon: Building2  },
  { label: 'Appeal',      value: 'appeal',       icon: Scale      },
  { label: 'File Notes',  value: 'file-notes',   icon: StickyNote },
  { label: 'Accounts',    value: 'accounts',     icon: CreditCard },
  { label: 'Progress',    value: 'progress',     icon: BarChart2  },
  { label: 'Documents',   value: 'documents',    icon: FolderOpen },
];

export default function NewCasePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  return (
    <Fragment>
      <Container className="pt-7">
        {/* <Toolbar >
          <ToolbarHeading >
            <ToolbarPageTitle text="New Case" />
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" className="gap-1.5">
              <Download className="size-4" />
              Export
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant="outline" className="gap-1.5">
                  <CalendarDays className="size-4" />
                  {date?.from ? (
                    date.to ? (
                      <span>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </span>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </ToolbarActions>
        </Toolbar>  */}
      </Container>

      <Container>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="border-b border-border bg-card px-4 pt-1">
            <Tabs defaultValue="cover-page" className="w-full">
              <TabsList
                variant="line"
                size="md"
                className="w-full justify-start overflow-x-auto gap-0 bg-transparent p-0 h-auto"
              >
                {TABS.map(({ label, value, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="gap-1.5 px-4 py-3 rounded-none text-xs font-medium"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content area */}
              <div className="p-5">
                <TabsContent value="new-client" className="mt-0">
                  <NewClient />
                </TabsContent>
                <TabsContent value="cover-page" className="mt-0">
                  <CoverPage />
                </TabsContent>
                <TabsContent value="applicant"  className="mt-0"><Applicant /></TabsContent>
                <TabsContent value="sponsor"    className="mt-0"><div /></TabsContent>
                <TabsContent value="contacts"   className="mt-0"><div /></TabsContent>
                <TabsContent value="staff"      className="mt-0"><div /></TabsContent>
                <TabsContent value="dept"       className="mt-0"><div /></TabsContent>
                <TabsContent value="appeal"     className="mt-0"><div /></TabsContent>
                <TabsContent value="file-notes" className="mt-0"><div /></TabsContent>
                <TabsContent value="accounts"   className="mt-0"><div /></TabsContent>
                <TabsContent value="progress"   className="mt-0"><div /></TabsContent>
                <TabsContent value="documents"  className="mt-0"><div /></TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
