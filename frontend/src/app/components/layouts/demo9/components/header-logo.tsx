'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MegaMenuMobile } from './mega-menu-mobile';

export function HeaderLogo() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center gap-1 lg:w-[400px] grow lg:grow-0">
      <div className="flex items-center gap-2 shrink-0 py-4">
        <Link href="/">
           <img
          src={toAbsoluteUrl('/logo.png')}
          className="h-[100px] hidden md:block py-4"
          alt="logo"
        />
        </Link>
      
      </div>

      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="dim" mode="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="p-0 gap-0 w-[275px]"
            side="left"
            close={false}
          >
            <SheetHeader className="p-0 space-y-0" />
            <SheetBody className="p-0 overflow-y-auto">
              <MegaMenuMobile />
            </SheetBody>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
