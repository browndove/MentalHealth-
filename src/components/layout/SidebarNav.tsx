
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar, SidebarTooltip } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/layout/AppLogo';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}

interface SidebarNavProps {
  navItems: NavItem[];
  userRole: 'student' | 'counselor';
  isMobile?: boolean;
}

export function SidebarNav({ navItems, userRole, isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  const handleToggle = () => setIsOpen(!isOpen);

  const renderContent = () => (
     <div className="flex h-full flex-col">
       <div
        className={cn(
          "flex items-center border-b border-sidebar-border h-16 px-4",
          isOpen ? "justify-between" : "justify-center"
        )}
      >
        <div className={cn(!isOpen && "hidden")}>
          <AppLogo />
        </div>
         <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={handleToggle}
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </Button>
      </div>

       <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
           const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
           return(
            <SidebarTooltip key={item.href} label={item.title}>
              <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                  buttonVariants({ variant: isActive ? 'sidebar' : 'ghost', size: 'default' }),
                  "w-full justify-start",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : undefined}
              >
                <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "mr-0")} />
                <span className={cn('truncate', !isOpen && "sr-only")}>{item.title}</span>
                {item.label && <span className="ml-auto">{item.label}</span>}
              </Link>
            </SidebarTooltip>
           )
        })}
      </nav>
     </div>
  );

  if (isMobile) {
    return renderContent();
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden h-full flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 ease-in-out md:flex',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {renderContent()}
    </aside>
  );
}
