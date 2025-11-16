import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import Learning from "@/components/Learning";
import Negotiator from "@/components/Negotiator";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [activeSession, setActiveSession] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Modo claro por padrão

  const renderContent = () => {
    switch (activeSession) {
      case "learning":
        return <Learning />;
      case "negotiator":
        return <Negotiator userName="Carlos" />;
      case "chat":
      default:
        return <Chat sessionId={activeSession} userName="Carlos" />;
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden relative ${darkMode ? 'bg-[#0a0e1a]' : 'bg-background'}`}>
      {/* Particles Background (only in dark mode) */}
      {darkMode && <ParticlesBackground />}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative z-10">
        <Sidebar 
          activeSession={activeSession} 
          onSessionChange={setActiveSession}
          darkMode={darkMode}
        />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Mobile Header with Hamburger */}
        <div className={`lg:hidden border-b px-4 py-3 flex items-center justify-between ${
          darkMode ? 'bg-[#141b2d] border-[#1e2a3f]' : 'bg-card border-border'
        }`}>
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar 
                  activeSession={activeSession} 
                  onSessionChange={(session) => {
                    setActiveSession(session);
                    setSidebarOpen(false);
                  }}
                  darkMode={darkMode}
                />
              </SheetContent>
            </Sheet>
            <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>
              🧠 Cérebro da Cooperativa
            </h1>
          </div>
          
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;