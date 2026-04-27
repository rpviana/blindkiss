import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SettingsProvider } from "@/components/SettingsProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";

import Home from "@/pages/Home";

import Archive from "@/pages/Archive";
import Bkid from "@/pages/Bkid";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <AnnouncementOverlay />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/archive" component={Archive} />
          <Route path="/bk-id" component={Bkid} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              classNames: {
                toast: "font-mono border-4 border-border rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                success: "bg-green-100 text-green-800 border-green-600",
                error: "bg-red-100 text-red-800 border-red-600",
              },
            }}
          />
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
