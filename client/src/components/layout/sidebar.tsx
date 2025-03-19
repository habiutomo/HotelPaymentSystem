import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays,
  CreditCard,
  Settings,
  LogOut 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Rooms", href: "/rooms", icon: BedDouble },
  { name: "Bookings", href: "/bookings", icon: CalendarDays },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="flex h-screen flex-col gap-y-5 bg-sidebar border-r border-sidebar-border p-6">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold text-sidebar-primary">HotelX</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        location === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer"
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start gap-x-3"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-6 w-6 shrink-0" />
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}