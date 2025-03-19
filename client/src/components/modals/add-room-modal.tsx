import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n';
import { X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { RoomCategory } from '@shared/schema';

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Get room categories
  const { data: categories = [] } = useQuery<RoomCategory[]>({
    queryKey: ['/api/room-categories'],
  });

  // Form validation schema
  const formSchema = z.object({
    room_number: z.string().min(1, 'Room number is required'),
    category_id: z.string().transform(val => parseInt(val, 10)),
    floor: z.string().transform(val => parseInt(val, 10)),
    status: z.enum(['available', 'occupied', 'maintenance', 'reserved']),
    has_wifi: z.boolean().default(true),
    has_ac: z.boolean().default(true),
    has_minibar: z.boolean().default(false),
    has_room_service: z.boolean().default(false),
    has_tv: z.boolean().default(true),
    has_balcony: z.boolean().default(false),
    notes: z.string().optional(),
  });

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_number: '',
      category_id: '',
      floor: '1',
      status: 'available',
      has_wifi: true,
      has_ac: true,
      has_minibar: false,
      has_room_service: false,
      has_tv: true,
      has_balcony: false,
      notes: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await apiRequest('POST', '/api/rooms', values);
      const data = await response.json();
      
      toast({
        title: "Room Created",
        description: "The room has been created successfully",
        variant: "default",
      });
      
      // Invalidate rooms query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      
      // Close modal after successful creation
      onOpenChange(false);
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary flex justify-between items-center">
            {t('room.addNew')}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription>
            {t('room.addDescription') || 'Enter room details to add new room to inventory'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('room.number')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="101" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('room.type')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('room.floor')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('room.status')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">{t('room.features')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="has_wifi"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.wifi')}</Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_ac"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.ac')}</Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_minibar"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.minibar')}</Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_room_service"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.roomService')}</Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_tv"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.tv')}</Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_balcony"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>{t('room.balcony')}</Label>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Room description..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.addNew')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomModal;
