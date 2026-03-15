'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

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

export function MegaMenu() {
  const pathname = usePathname();
  const { isActive } = useMenu(pathname);

  const linkClass = `
    inline-flex flex-row items-center h-12 py-0 border-b border-transparent rounded-none bg-transparent -mb-[1px]
    text-sm text-secondary-foreground font-medium 
    hover:text-mono hover:bg-transparent 
    focus:text-mono focus:bg-transparent 
    data-[active=true]:text-mono data-[active=true]:bg-transparent data-[active=true]:border-mono 
    data-[here=true]:text-mono data-[here=true]:bg-transparent data-[here=true]:border-mono 
    data-[state=open]:text-mono data-[state=open]:bg-transparent 
  `;

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-2">
        {MENU.map((item, i) =>
          item.children ? (
            <NavigationMenuItem key={i}>
              <NavigationMenuTrigger className={cn(linkClass)}>
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-1 min-w-[160px]">
                <ul className="flex flex-col">
                  {item.children.map((child, j) => (
                    <li key={j}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.path}
                          className={cn(
                            'block px-3 py-2 text-sm text-secondary-foreground font-medium rounded-md hover:text-mono hover:bg-muted transition-colors',
                            isActive(child.path) && 'text-mono bg-muted font-semibold',
                          )}
                        >
                          {child.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={i}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.path!}
                  className={cn(linkClass)}
                  data-active={isActive(item.path) || undefined}
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
