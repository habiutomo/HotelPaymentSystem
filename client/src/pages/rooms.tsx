import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddRoomModal from '@/components/modals/add-room-modal';
import { PlusCircle, Wifi, Airplay, Wine, Coffee, Tv, Mountain, Pencil, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Room, RoomWithCategory } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Rooms = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Fetch rooms
  const { data: rooms = [], isLoading } = useQuery<RoomWithCategory[]>({
    queryKey: ['/api/rooms'],
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      await apiRequest('DELETE', `/api/rooms/${roomId}`);
    },
    onSuccess: () => {
      toast({
        title: "Room deleted",
        description: "The room has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setRoomToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete room. It may be in use.",
        variant: "destructive",
      });
    },
  });

  // Helper function to render room status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Maintenance</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Reserved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-secondary">{t('room.management')}</h1>
            <Button onClick={() => setAddRoomModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('room.addNew')}
            </Button>
          </div>

          {/* Rooms grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <div className="p-5">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-5 w-32 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{t('room.number')}: {room.room_number}</h3>
                        {renderStatusBadge(room.status)}
                      </div>
                      <p className="text-slate-600 mb-2">{room.category?.name || t('room.uncategorized')}</p>
                      <p className="text-primary font-semibold mb-4">${room.category?.base_price || 0}/night</p>

                      {/* Room features */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {room.has_wifi && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Wifi size={16} />
                          </div>
                        )}
                        {room.has_ac && (
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                            <Airplay size={16} />
                          </div>
                        )}
                        {room.has_minibar && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <Wine size={16} />
                          </div>
                        )}
                        {room.has_room_service && (
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Coffee size={16} />
                          </div>
                        )}
                        {room.has_tv && (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <Tv size={16} />
                          </div>
                        )}
                        {room.has_balcony && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Mountain size={16} />
                          </div>
                        )}
                      </div>

                      {room.notes && (
                        <p className="text-sm text-slate-500 mb-4">{room.notes}</p>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between mt-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil size={14} />
                          {t('common.edit')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 gap-1"
                          onClick={() => setRoomToDelete(room)}
                        >
                          <Trash2 size={14} />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center p-10">
                <p className="text-slate-500">No rooms found. Add your first room.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <AddRoomModal 
        open={addRoomModalOpen} 
        onOpenChange={setAddRoomModalOpen} 
      />

      {/* Delete Room Confirmation Dialog */}
      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Room {roomToDelete?.room_number}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => roomToDelete && deleteRoomMutation.mutate(roomToDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Rooms;