import React from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "./contexts/theme-context"; // Added ThemeProvider import
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Rooms from "@/pages/rooms";
import Bookings from "@/pages/bookings";
import Guests from "@/pages/guests";
import Payments from "@/pages/payments";
import Settings from "@/pages/settings";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/guests" component={Guests} />
      <Route path="/payments" component={Payments} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider> {/* Added ThemeProvider */}
        <LanguageProvider>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow bg-slate-50">
                <Router />
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
          <Toaster />
        </LanguageProvider>
      </ThemeProvider> {/* Added ThemeProvider */}
    </QueryClientProvider>
  );
}

export default App;