import { MessageSquare, Handshake, Settings, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSession: string;
  onSessionChange: (session: string) => void;
  darkMode?: boolean;
}

const Sidebar = ({ activeSession, onSessionChange, darkMode = false }: SidebarProps) => {
  const sessions = [
    { id: "chat", name: "Assistente Pessoal", icon: MessageSquare, color: "bg-blue-500" },
    { id: "negotiator", name: "Negociador", icon: Handshake, color: "bg-purple-500" },
    { id: "learning", name: "Aprendizado", icon: GraduationCap, color: "bg-green-500" },
  ];

  return (
    <aside className={cn(
      "w-72 flex flex-col h-screen border-r shadow-xl",
      darkMode 
        ? "bg-[#141b2d] border-[#1e2a3f] text-white" 
        : "bg-gradient-to-b from-coop-sidebar to-coop-sidebar/95 text-sidebar-foreground border-sidebar-border/50"
    )}>
      {/* Header */}
      <div className={cn(
        "p-6 border-b",
        darkMode ? "border-[#1e2a3f]" : "border-sidebar-border/50"
      )}>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
            darkMode 
              ? "bg-blue-600/20" 
              : "bg-gradient-to-br from-primary to-primary/70"
          )}>
            <Sparkles className={cn("w-6 h-6", darkMode ? "text-blue-400" : "text-white")} />
          </div>
          <div>
            <h1 className="text-lg font-bold">
              Cérebro da Cooperativa
            </h1>
            <p className={cn(
              "text-xs",
              darkMode ? "text-gray-400" : "text-sidebar-foreground/60"
            )}>
              Assistente Inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <nav className="flex-1 p-4 space-y-2">
        <p className={cn(
          "text-xs font-semibold px-3 mb-4 uppercase tracking-wider",
          darkMode ? "text-gray-500" : "text-sidebar-foreground/50"
        )}>
          Sessões
        </p>
        {sessions.map((session) => {
          const Icon = session.icon;
          const isActive = activeSession === session.id;
          
          return (
            <Button
              key={session.id}
              variant="ghost"
              onClick={() => onSessionChange(session.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 transition-all duration-200 rounded-xl group relative overflow-hidden",
                darkMode
                  ? isActive
                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                    : "text-gray-300 hover:bg-white/5"
                  : isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-md"
                    : "text-sidebar-foreground hover:bg-coop-sidebar-hover"
              )}
            >
              {/* Background glow effect on hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                session.color
              )} />
              
              {/* Icon with colored background */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                darkMode
                  ? isActive ? "bg-blue-600/30" : "bg-white/5"
                  : isActive ? "bg-white/20" : "bg-sidebar-foreground/10"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              <span className="font-medium text-sm">{session.name}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className={cn(
                  "ml-auto w-2 h-2 rounded-full animate-pulse",
                  darkMode ? "bg-blue-400" : "bg-white"
                )} />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Admin Section */}
      <div className={cn(
        "p-4 border-t",
        darkMode ? "border-[#1e2a3f] bg-white/5" : "border-sidebar-border/50 bg-sidebar-foreground/5"
      )}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-12 px-4 rounded-xl cursor-not-allowed",
            darkMode 
              ? "text-gray-500 hover:bg-white/5" 
              : "text-sidebar-foreground/70 hover:bg-coop-sidebar-hover"
          )}
          disabled
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            darkMode ? "bg-white/5" : "bg-sidebar-foreground/10"
          )}>
            <Settings className="h-4 w-4" />
          </div>
          <span className="font-medium text-sm">Configurações</span>
          <span className={cn(
            "ml-auto text-xs px-2.5 py-1 rounded-full font-medium",
            darkMode ? "bg-gray-800 text-gray-400" : "bg-sidebar-accent/80"
          )}>
            Em breve
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;