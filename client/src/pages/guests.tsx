import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Guest } from '@shared/schema';
import { Search, UserPlus, Mail, Phone, Home, Globe, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Guests = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch guests
  const { data: guests = [], isLoading } = useQuery<Guest[]>({
    queryKey: ['/api/guests'],
  });

  // Filter guests based on search term
  const filteredGuests = guests.filter(guest => {
    return (
      searchTerm === '' || 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchTerm)) ||
      (guest.country && guest.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get random pastel color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-red-100 text-red-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
    ];
    
    // Simple hash function for name to get consistent color
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-secondary">{t('nav.guests')}</h1>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </div>
          
          {/* Search bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, phone, or country..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Guest list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-4 w-24 mb-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredGuests.length > 0 ? (
              filteredGuests.map(guest => (
                <Card key={guest.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className={`h-12 w-12 ${getAvatarColor(guest.name)}`}>
                        <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-secondary">{guest.name}</h3>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Mail className="h-3.5 w-3.5 mr-1.5" />
                          <span>{guest.email}</span>
                        </div>
                        
                        {guest.phone && (
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Phone className="h-3.5 w-3.5 mr-1.5" />
                            <span>{guest.phone}</span>
                          </div>
                        )}
                        
                        {guest.address && (
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Home className="h-3.5 w-3.5 mr-1.5" />
                            <span>{guest.address}</span>
                          </div>
                        )}
                        
                        {guest.country && (
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Globe className="h-3.5 w-3.5 mr-1.5" />
                            <span>{guest.country}</span>
                          </div>
                        )}
                        
                        {guest.id_type && guest.id_number && (
                          <Badge className="mt-2 bg-blue-50 text-blue-600 hover:bg-blue-50">
                            {guest.id_type}: {guest.id_number}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center p-10">
                <p className="text-slate-500">No guests found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guests;
