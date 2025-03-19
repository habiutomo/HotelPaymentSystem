import React from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LucideIcon, BarChart2, DoorOpen, CalendarCheck, Users, CreditCard, Settings } from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, active }) => {
  return (
    <li>
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary cursor-pointer",
          active ? "bg-primary/5 text-primary" : "text-slate-500"
        )}>
          <Icon className="h-4 w-4" />
          {label}
        </div>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold text-lg text-secondary mb-4">{t('common.admin')}</h3>
        <ul className="space-y-2">
          <SidebarItem 
            href="/" 
            icon={BarChart2} 
            label={t('common.dashboard')} 
            active={location === '/'} 
          />
          <SidebarItem 
            href="/rooms" 
            icon={DoorOpen} 
            label={t('room.management')} 
            active={location === '/rooms'} 
          />
          <SidebarItem 
            href="/bookings" 
            icon={CalendarCheck} 
            label={t('nav.bookings')} 
            active={location === '/bookings'} 
          />
          <SidebarItem 
            href="/guests" 
            icon={Users} 
            label={t('nav.guests')} 
            active={location === '/guests'} 
          />
          <SidebarItem 
            href="/payments" 
            icon={CreditCard} 
            label={t('nav.payments')} 
            active={location === '/payments'} 
          />
          <SidebarItem 
            href="/settings" 
            icon={Settings} 
            label={t('nav.settings')} 
            active={location === '/settings'} 
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;