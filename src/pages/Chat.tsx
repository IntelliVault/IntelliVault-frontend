import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, Sparkles, Zap, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your IntelliVault AI Assistant powered by advanced blockchain analytics. I can help you with asset information, portfolio analysis, and answer questions about tokenized real-world assets. How can I assist you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("portfolio") || lowerMessage.includes("assets")) {
      return "📊 Your current portfolio has a total value of $142,890.50 across 4 active assets. You're showing strong performance with a +13.9% gain. Would you like detailed analytics on any specific asset?";
    } else if (lowerMessage.includes("pyusd") || lowerMessage.includes("balance")) {
      return "💰 Your PYUSD balance is $125,450.00, which is available for trading. PYUSD provides instant settlement for all your tokenized asset transactions with zero gas fees.";
    } else if (lowerMessage.includes("risk") || lowerMessage.includes("security")) {
      return "🛡️ Your wallet has a Low risk rating with a reputation score of 850/1000. Your transaction history shows 2+ years of verified activity with no red flags detected. You're in the top 15% of secure wallets!";
    } else if (lowerMessage.includes("buy") || lowerMessage.includes("trade")) {
      return "🔥 You can trade tokenized assets directly from the marketplace. Currently, we have 24 active RWAs including stocks, bonds, and REITs. Visit the Vault page to explore available assets with real-time pricing!";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return "✨ I can help you with:\n\n• 📈 Portfolio analytics and performance tracking\n• 💎 Asset information and trading\n• 🔒 Risk assessment and security\n• 💵 PYUSD balance and transactions\n• 🌐 General questions about tokenized RWAs\n• 📊 Market trends and insights\n\nWhat would you like to know more about?";
    } else if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
      return "👋 Hello! Great to see you here! I'm ready to help you navigate the world of tokenized assets. What would you like to explore today?";
    } else if (lowerMessage.includes("thanks") || lowerMessage.includes("thank you")) {
      return "🙏 You're very welcome! I'm always here to help. Feel free to ask me anything else about your portfolio or our platform!";
    } else {
      return "🤔 I understand you're asking about \"" + userMessage + "\". IntelliVault provides secure, blockchain-based trading of tokenized real-world assets with PYUSD settlements. Could you please be more specific about what you'd like to know? I'm here to help!";
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAgentResponse(inputValue),
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "Portfolio", icon: TrendingUp, query: "Show my portfolio" },
    { label: "Risk Score", icon: Shield, query: "Check my risk assessment" },
    { label: "PYUSD Balance", icon: Zap, query: "What's my PYUSD balance?" },
  ];

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background opacity-90" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C754FF]/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="chatGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2"/>
              <circle cx="0" cy="0" r="1.5" fill="hsl(var(--primary))" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chatGrid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-all duration-300 group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Badge className="relative bg-gradient-to-r from-primary/90 to-[#00BFFF]/90 border-primary/30 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-card border border-border/50">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold bg-gradient-to-r from-primary to-[#00BFFF] bg-clip-text text-transparent">
                  IntelliVault AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 relative z-10 flex flex-col h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-6xl">
          <Card className="flex-1 flex flex-col bg-gradient-card/50 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[#C754FF]/5 pointer-events-none" />
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Avatar className={`h-10 w-10 ${
                    message.sender === "user" 
                      ? "bg-gradient-to-br from-primary to-[#00BFFF] shadow-lg shadow-primary/30" 
                      : "bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30"
                  } border-2 border-background`}>
                    <AvatarFallback className="bg-transparent">
                      {message.sender === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-primary to-[#00BFFF] text-white border border-primary/20"
                        : "bg-gradient-to-br from-muted/80 to-muted backdrop-blur-sm border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.sender === "agent" && (
                        <Badge variant="outline" className="text-xs border-white/20">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 animate-slide-up">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30 border-2 border-background">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gradient-to-br from-muted/80 to-muted backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-lg">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - Only show when no typing */}
            {!isTyping && messages.length <= 2 && (
              <div className="px-6 pb-4">
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="bg-gradient-card hover:bg-primary/10 border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50"
                    >
                      <action.icon className="h-3 w-3 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border/50 p-6 bg-background/30 backdrop-blur-sm">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your portfolio, assets, or trading..."
                    className="pr-12 bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input transition-all duration-300 rounded-xl h-12 text-base shadow-inner"
                  />
                  {inputValue && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      Press Enter
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="lg"
                  className="shrink-0 h-12 px-6 bg-gradient-to-r from-primary to-[#00BFFF] hover:from-primary/90 hover:to-[#00BFFF]/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 rounded-xl"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  AI responses are for informational purposes only
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Powered by IntelliVault AI
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
