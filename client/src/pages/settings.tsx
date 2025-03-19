import React from 'react';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Shield, 
  UserCog,
  Building,
  Languages,
  BellRing,
  Save,
  ChevronRight
} from 'lucide-react';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary mb-6">{t('nav.settings')}</h1>
          
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-4 md:w-[600px] mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid gap-6">
                {/* Hotel Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      Hotel Information
                    </CardTitle>
                    <CardDescription>
                      Update your hotel details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotel-name">Hotel Name</Label>
                        <Input id="hotel-name" defaultValue="HotelX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="info@hotelx.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://hotelx.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Hotel Street" />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="New York" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" defaultValue="NY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" defaultValue="USA" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Language Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Languages className="mr-2 h-5 w-5" />
                      Language & Localization
                    </CardTitle>
                    <CardDescription>
                      Configure language preferences and regional settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-language">Default Language</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className={`border rounded-md p-3 cursor-pointer flex items-center ${language === 'en' ? 'border-primary bg-blue-50' : ''}`}
                          onClick={() => setLanguage('en')}
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            <img src="https://flagcdn.com/w20/us.png" alt="English" width="24" height="24" />
                          </div>
                          <div>
                            <p className="font-medium">English</p>
                            <p className="text-xs text-slate-500">United States</p>
                          </div>
                          {language === 'en' && <ChevronRight className="ml-auto h-5 w-5 text-primary" />}
                        </div>
                        <div 
                          className={`border rounded-md p-3 cursor-pointer flex items-center ${language === 'id' ? 'border-primary bg-blue-50' : ''}`}
                          onClick={() => setLanguage('id')}
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            <img src="https://flagcdn.com/w20/id.png" alt="Indonesian" width="24" height="24" />
                          </div>
                          <div>
                            <p className="font-medium">Indonesian</p>
                            <p className="text-xs text-slate-500">Indonesia</p>
                          </div>
                          {language === 'id' && <ChevronRight className="ml-auto h-5 w-5 text-primary" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-3 cursor-pointer border-primary bg-blue-50">
                          <p className="font-medium">MM/DD/YYYY</p>
                          <p className="text-xs text-slate-500">e.g. 05/25/2023</p>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer">
                          <p className="font-medium">DD/MM/YYYY</p>
                          <p className="text-xs text-slate-500">e.g. 25/05/2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time-format">Time Format</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-3 cursor-pointer border-primary bg-blue-50">
                          <p className="font-medium">12-hour format</p>
                          <p className="text-xs text-slate-500">e.g. 2:30 PM</p>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer">
                          <p className="font-medium">24-hour format</p>
                          <p className="text-xs text-slate-500">e.g. 14:30</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-3 cursor-pointer border-primary bg-blue-50">
                          <p className="font-medium">USD ($)</p>
                          <p className="text-xs text-slate-500">United States Dollar</p>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer">
                          <p className="font-medium">IDR (Rp)</p>
                          <p className="text-xs text-slate-500">Indonesian Rupiah</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BellRing className="mr-2 h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Control your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive email for new bookings</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-slate-500">Receive SMS for booking confirmations</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment Alerts</p>
                        <p className="text-sm text-slate-500">Get notified about successful/failed payments</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Payment Settings */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Gateway Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your Xendit payment gateway integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="xendit-api-key">Xendit API Key</Label>
                    <Input id="xendit-api-key" type="password" defaultValue="••••••••••••••••••••••" />
                    <p className="text-xs text-slate-500">Your secure API key for Xendit payment gateway</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="xendit-callback-url">Callback URL</Label>
                    <Input id="xendit-callback-url" defaultValue="https://hotelx.com/api/xendit/webhook" readOnly />
                    <p className="text-xs text-slate-500">This URL should be set in your Xendit dashboard for webhook notifications</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <p className="font-medium">Available Payment Methods</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="visa" defaultChecked />
                        <Label htmlFor="visa">Visa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="mastercard" defaultChecked />
                        <Label htmlFor="mastercard">MasterCard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="amex" defaultChecked />
                        <Label htmlFor="amex">American Express</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="bank-transfer" defaultChecked />
                        <Label htmlFor="bank-transfer">Bank Transfer</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="font-medium mb-3">3D Secure Settings</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Enable 3D Secure 2.0</p>
                        <p className="text-xs text-slate-500">Require 3D Secure authentication for all credit card transactions</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Enable 2FA</p>
                        <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Account Settings */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCog className="mr-2 h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your personal account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input id="user-name" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email Address</Label>
                      <Input id="user-email" type="email" defaultValue="admin@hotelx.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Role</Label>
                      <Input id="user-role" defaultValue="Administrator" readOnly />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive account-related notifications</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
