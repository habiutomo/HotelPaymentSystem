import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/lib/i18n';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">HotelX</Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className={`text-slate-700 hover:text-blue-600 transition ${location === '/' ? 'text-blue-600 font-medium' : ''}`}>
                {t('nav.home')}
              </Link>
              <Link href="/rooms" className={`text-slate-700 hover:text-blue-600 transition ${location === '/rooms' ? 'text-blue-600 font-medium' : ''}`}>
                {t('nav.rooms')}
              </Link>
              <Link href="/bookings" className={`text-slate-700 hover:text-blue-600 transition ${location === '/bookings' ? 'text-blue-600 font-medium' : ''}`}>
                {t('nav.bookings')}
              </Link>
              <Link href="/guests" className={`text-slate-700 hover:text-blue-600 transition ${location === '/guests' ? 'text-blue-600 font-medium' : ''}`}>
                {t('nav.guests')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Select 
              value={language} 
              onValueChange={(value) => setLanguage(value as 'en' | 'id')}
            >
              <SelectTrigger className="w-[120px] border-none">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Indonesian</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link href="/" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.home')}
                  </Link>
                  <Link href="/rooms" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.rooms')}
                  </Link>
                  <Link href="/bookings" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.bookings')}
                  </Link>
                  <Link href="/guests" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.guests')}
                  </Link>
                  <Link href="/payments" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.payments')}
                  </Link>
                  <hr className="my-2" />
                  <Link href="/settings" className="text-slate-700 hover:text-blue-600 transition py-2 font-medium">
                    {t('nav.settings')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
