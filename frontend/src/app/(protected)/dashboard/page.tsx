'use client';

import { Fragment, useState } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarDays, Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DashboardContent } from './content';

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <Toolbar>
          <ToolbarDescription>
            Sales, inventory, and activity overview
          </ToolbarDescription>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="#">
                <Download />
                Export
              </Link>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant="outline">
                  <CalendarDays />
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
        </Toolbar>
      </Container>
      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
}
