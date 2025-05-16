
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { TaskProvider } from "@/context/TaskContext";
import { PomodoroProvider } from "@/context/PomodoroContext";
import { NotesProvider } from "@/context/NotesContext";
import { MarkdownProvider } from "@/context/MarkdownContext";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NavigationProvider>
        <TaskProvider>
          <PomodoroProvider>
            <NotesProvider>
              <MarkdownProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="flex h-screen w-full overflow-hidden">
                      <Sidebar />
                      <MainContent />
                    </div>
                  </BrowserRouter>
                </TooltipProvider>
              </MarkdownProvider>
            </NotesProvider>
          </PomodoroProvider>
        </TaskProvider>
      </NavigationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
