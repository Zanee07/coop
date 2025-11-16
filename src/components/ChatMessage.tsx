import { cn } from "@/lib/utils";
import { Bot, User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("mb-1.5", isUser ? "flex justify-end" : "flex justify-start")}>
      <div
        className={cn(
          "flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl shadow-sm transition-all hover:shadow-md max-w-lg",
          isUser
            ? "bg-coop-message-user text-primary-foreground"
            : "bg-gradient-to-br from-coop-message-ai to-coop-message-ai/95 text-card-foreground border border-primary/10"
        )}
      >
        {/* Avatar - só aparece à esquerda para assistente */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xs sm:text-sm font-semibold mb-2",
            isUser ? "text-primary-foreground/90" : "text-primary"
          )}>
            {isUser ? "Você" : "Atlas AI"}
          </p>
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words prose prose-sm max-w-none">
            {content.split('\n').map((line, index) => {
              // Detecta títulos em negrito **texto**
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="font-bold text-primary">{part}</strong> : part
                    )}
                  </p>
                );
              }
              // Detecta bullet points
              if (line.trim().startsWith('•')) {
                return (
                  <div key={index} className="flex gap-2 mb-2 items-start">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span className="flex-1 bg-primary/5 px-2.5 py-1 rounded-md hover:bg-primary/10 transition-colors">
                      {line.replace('•', '').trim()}
                    </span>
                  </div>
                );
              }
              // Linha normal
              return line.trim() ? <p key={index} className="mb-2">{line}</p> : <br key={index} />;
            })}
          </div>
        </div>

        {/* Avatar - só aparece à direita para usuário */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;