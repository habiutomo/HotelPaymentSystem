import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function Settings() {
  const [paymentMethods, setPaymentMethods] = useState({
    visa: true,
    mastercard: true,
    amex: false,
    bankTransfer: true
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <Tabs defaultValue="payment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateway Settings</CardTitle>
                  <CardDescription>
                    Configure your Xendit payment gateway integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Xendit API Key</Label>
                    <Input 
                      type="password" 
                      value="••••••••••••••••••••"
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Your secure API key for Xendit payment gateway
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Callback URL</Label>
                    <Input 
                      value="https://hotelx.com/api/xendit/webhook"
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      This URL should be set in your Xendit dashboard for webhook notifications
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label>Available Payment Methods</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="visa">Visa</Label>
                        <Switch
                          id="visa"
                          checked={paymentMethods.visa}
                          onCheckedChange={(checked) => 
                            setPaymentMethods(prev => ({...prev, visa: checked}))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mastercard">MasterCard</Label>
                        <Switch
                          id="mastercard"
                          checked={paymentMethods.mastercard}
                          onCheckedChange={(checked) => 
                            setPaymentMethods(prev => ({...prev, mastercard: checked}))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="amex">American Express</Label>
                        <Switch
                          id="amex"
                          checked={paymentMethods.amex}
                          onCheckedChange={(checked) => 
                            setPaymentMethods(prev => ({...prev, amex: checked}))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bank">Bank Transfer</Label>
                        <Switch
                          id="bank"
                          checked={paymentMethods.bankTransfer}
                          onCheckedChange={(checked) => 
                            setPaymentMethods(prev => ({...prev, bankTransfer: checked}))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure general hotel settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Hotel Name</Label>
                      <Input defaultValue="HotelX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input type="email" defaultValue="contact@hotelx.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input type="tel" defaultValue="+1 234 567 8900" />
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable 3D Secure 2.0</Label>
                        <p className="text-sm text-muted-foreground">
                          Require 3D Secure authentication for all credit card transactions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
