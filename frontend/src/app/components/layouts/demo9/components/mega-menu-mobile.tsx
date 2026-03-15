'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';

const MENU = [
  { title: 'Dashboard', path: '/dashboard' },
  {
    title: 'New',
    children: [
      { title: 'Case', path: '/new/case' },
      { title: 'FN', path: '/new/fn' },
      { title: 'Filenote', path: '/new/filenote' },
      { title: 'Task', path: '/new/task' },
    ],
  },
  { title: 'Reports', path: '/reports' },
  { title: 'Letters', path: '/letters' },
  { title: 'CIQ', path: '/ciq' },
  { title: 'Forms', path: '/forms' },
  {
    title: 'Administration',
    children: [
      { title: 'Users', path: '/administration/users' },
    ],
  },
  {
    title: 'Super Admin',
    children: [
      { title: 'Organizations', path: '/super-admin/organizations' },
      { title: 'Users', path: '/super-admin/users' },
      { title: 'Application Users', path: '/super-admin/application-users' },
    ],
  },
];

const itemClass =
  'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium';
const subTriggerClass =
  'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium';

export function MegaMenuMobile() {
  const pathname = usePathname();

  return (
    <AccordionMenu type="single" collapsible selectedValue={pathname} className="p-4 space-y-1">
      <AccordionMenuGroup className="gap-px">
        {MENU.map((item, i) =>
          item.children ? (
            <AccordionMenuSub key={i} value={item.title}>
              <AccordionMenuSubTrigger className={cn(subTriggerClass, 'text-sm font-medium')}>
                {item.title}
              </AccordionMenuSubTrigger>
              <AccordionMenuSubContent
                type="single"
                collapsible
                parentValue={item.title}
                className="ps-6"
              >
                <AccordionMenuGroup>
                  {item.children.map((child, j) => (
                    <AccordionMenuItem
                      key={j}
                      value={child.path}
                      className={cn(itemClass, 'text-[13px]')}
                    >
                      <Link href={child.path}>{child.title}</Link>
                    </AccordionMenuItem>
                  ))}
                </AccordionMenuGroup>
              </AccordionMenuSubContent>
            </AccordionMenuSub>
          ) : (
            <AccordionMenuItem
              key={i}
              value={item.path!}
              className={cn(itemClass, 'text-sm font-medium')}
            >
              <Link href={item.path!}>{item.title}</Link>
            </AccordionMenuItem>
          ),
        )}
      </AccordionMenuGroup>
    </AccordionMenu>
  );
}
