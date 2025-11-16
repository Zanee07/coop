import { useState, useRef, useEffect } from "react";
import { Send, TrendingUp, Target, Lightbulb, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface NegotiatorProps {
  userName?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const NEGOTIATOR_ASSISTANT_ID = "asst_JQE3K3UtYHAsAbS5DEwOg1h8";

const Negotiator = ({ userName = "Usuário" }: NegotiatorProps) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Olá, ${userName}! 💼

Sou seu **Assistente de Negociação**. Estou aqui para te ajudar a fechar mais negócios com argumentos poderosos e estratégias eficazes.

**Como posso potencializar suas vendas hoje?**

🎯 Criar argumentos de venda personalizados
💡 Superar objeções de clientes
📊 Desenvolver estratégias de negociação
🔥 Preparar pitches convincentes`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: Target, label: "Argumentos", color: "bg-blue-500" },
    { icon: Lightbulb, label: "Objeções", color: "bg-yellow-500" },
    { icon: TrendingUp, label: "Estratégias", color: "bg-green-500" },
    { icon: Zap, label: "Pitch", color: "bg-purple-500" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/threads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to create thread');

        const data = await response.json();
        setThreadId(data.id);
      } catch (error) {
        console.error('Error creating thread:', error);
      }
    };

    createThread();
  }, []);

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || !threadId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      await fetch(`${API_BASE_URL}/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageToSend,
        }),
      });

      const runResponse = await fetch(`${API_BASE_URL}/api/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant_id: NEGOTIATOR_ASSISTANT_ID,
        }),
      });

      if (!runResponse.ok) throw new Error('Failed to run assistant');

      const runData = await runResponse.json();
      const runId = runData.id;

      let isComplete = false;
      let attempts = 0;
      const maxAttempts = 60;

      while (!isComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const statusResponse = await fetch(
          `${API_BASE_URL}/api/threads/${threadId}/runs/${runId}`,
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

      if (!isComplete) throw new Error('Assistant timeout');

      const messagesResponse = await fetch(
        `${API_BASE_URL}/api/threads/${threadId}/messages`,
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
        content: "❌ Erro ao conectar. Tente novamente.",
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

  const handleQuickAction = (label: string) => {
    const prompts: { [key: string]: string } = {
      "Argumentos": "Me ajude a criar argumentos de venda convincentes para produtos da cooperativa",
      "Objeções": "Quais são as melhores formas de superar objeções comuns de clientes?",
      "Estratégias": "Me dê estratégias de negociação para fechar mais vendas",
      "Pitch": "Crie um pitch de elevador impactante para nossos produtos",
    };
    handleSend(prompts[label]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-blue-500/20 px-4 sm:px-6 py-4 sm:py-5 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Negociador Inteligente
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Potencialize suas vendas com IA 💼
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white font-medium">Ativo</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div key={message.id} className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-3 p-4 rounded-2xl shadow-sm max-w-lg transition-all hover:shadow-md ${
                    isUser
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {!isUser && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className={`text-sm font-bold mb-2 ${isUser ? "text-white/90" : "text-blue-600"}`}>
                      {isUser ? "Você" : "Negociador AI"}
                    </p>
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "text-white" : "text-gray-700"}`}>
                      {message.content.split('\n').map((line, index) => {
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={index} className="mb-2">
                              {parts.map((part, i) => 
                                i % 2 === 1 ? (
                                  <strong key={i} className={isUser ? "font-bold" : "font-bold text-blue-700"}>
                                    {part}
                                  </strong>
                                ) : part
                              )}
                            </p>
                          );
                        }
                        if (line.trim().startsWith('🎯') || line.trim().startsWith('💡') || line.trim().startsWith('📊') || line.trim().startsWith('🔥')) {
                          return (
                            <div key={index} className={`flex gap-2 mb-2 items-start p-2 rounded-lg ${isUser ? "bg-white/10" : "bg-blue-50"}`}>
                              <span className="flex-1">{line.trim()}</span>
                            </div>
                          );
                        }
                        return line.trim() ? <p key={index} className="mb-2">{line}</p> : <br key={index} />;
                      })}
                    </div>
                  </div>

                  {isUser && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm max-w-lg">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-2 text-blue-600">Negociador AI</p>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions + Input Area */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all border border-gray-200 hover:border-gray-300 group whitespace-nowrap"
                  >
                    <div className={`w-6 h-6 rounded-md ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Descreva sua situação de venda..."
              className="flex-1 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border-gray-300 rounded-lg focus-visible:ring-blue-600"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          <p className="hidden sm:block text-xs text-gray-500 text-center mt-3">
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default Negotiator;