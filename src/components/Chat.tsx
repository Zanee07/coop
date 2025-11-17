import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import ApiKeyConfig from "./ApiKeyConfig";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  sessionId: string;
  userName?: string;
}

// OpenAI Assistant Configuration
const ASSISTANT_ID = "asst_CCu0BHjv7F57ES9RmPbHEaYT";
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const Chat = ({ sessionId, userName = "Usuário" }: ChatProps) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Olá, ${userName}! 👋\n\nEstou pronto para te ajudar com dúvidas sobre seguros, crédito, consórcio e processos da cooperativa.\n\nPode me perguntar qualquer coisa sobre:\n• Produtos e serviços\n• Estatutos e regulamentos\n• Formulários e documentos\n• Processos internos\n\nComo posso ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a thread when component mounts
  useEffect(() => {
    const createThread = async () => {
      try {
        const response = await fetch('/api/threads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create thread');
        }

        const data = await response.json();
        setThreadId(data.id);
        console.log('Thread created:', data.id);
      } catch (error) {
        console.error('Error creating thread:', error);
      }
    };

    createThread();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !threadId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    setIsTyping(true);

    try {
      // Add message to thread
      await fetch(`/api/messages?threadId=${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      // Run the assistant
      const runResponse = await fetch(`/api/runs?threadId=${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
        }),
      });

      if (!runResponse.ok) {
        throw new Error('Failed to run assistant');
      }

      const runData = await runResponse.json();
      const runId = runData.id;

      // Poll for completion
      let isComplete = false;
      let attempts = 0;
      const maxAttempts = 60; // 30 seconds max

      while (!isComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const statusResponse = await fetch(
          `/api/runs?threadId=${threadId}&runId=${runId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          isComplete = true;
        } else if (statusData.status === 'failed' || statusData.status === 'cancelled' || statusData.status === 'expired') {
          throw new Error(`Run ${statusData.status}`);
        }
        
        attempts++;
      }

      if (!isComplete) {
        throw new Error('Assistant timeout');
      }

      // Get messages
      const messagesResponse = await fetch(
        `/api/messages?threadId=${threadId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const messagesData = await messagesResponse.json();
      const assistantMessage = messagesData.data[0];
      
      if (assistantMessage && assistantMessage.role === 'assistant') {
        const content = assistantMessage.content[0]?.text?.value || 'Sem resposta';
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: content,
        };

        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('OpenAI Assistant Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ Erro ao conectar com o assistente. Tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-coop-chat-bg">
     {/* Header */}
<header className="bg-card border-b border-border px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
  <div className="flex items-center justify-between max-w-7xl mx-auto">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="text-2xl">🤖</span>
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          {sessionId === "chat" ? "Assistente Inteligente" : "Negociador"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Olá, {userName} 👋 {threadId && `• Conectado`}
        </p>
      </div>
    </div>
    
    {/* Badge de status */}
    <div className="hidden sm:flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-xs text-green-700 dark:text-green-400 font-medium">Online</span>
    </div>
  </div>
</header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isTyping && (
            <div className="flex justify-start mb-1.5">
              <div className="bg-coop-message-ai text-card-foreground p-4 sm:p-6 rounded-2xl shadow-sm max-w-lg">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg sm:text-xl">
                    🧠
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold mb-1">Cérebro da Cooperativa</p>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-3 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua mensagem…"
            className="flex-1 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base bg-background border-input rounded-lg focus-visible:ring-primary"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-10 sm:h-12 px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            <Send className="h-4 w-4 sm:h-5 sm:h-5" />
          </Button>
        </div>
        <p className="hidden sm:block text-xs text-muted-foreground text-center mt-3">
          Pressione Enter para enviar • Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
};

export default Chat;