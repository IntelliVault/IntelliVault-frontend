// src/pages/Chat.tsx

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import {
  aiAgentService,
  ChatMessage,
  ChatResponse,
  ToolCall,
} from "@/services/aiAgentService";
import { ethers } from "ethers";

const Chat = () => {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your IntelliVault AI Assistant powered by Gemini 2.0 Flash. I can help you with:\n\n📊 Token prices and market data\n💰 Buy/sell cost calculations\n🔍 Smart contract analysis\n📈 Transaction history\n🌐 Multi-chain blockchain data\n\nHow can I assist you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Setup AI agent service
  useEffect(() => {
    // Check health and connect
    aiAgentService.checkHealth().then((healthy) => {
      if (!healthy) {
        setAgentStatus("error");
        setError(
          "AI Agent server is not available. Please ensure the server is running on port 3002."
        );
      }
    });

    // Listen for status updates
    aiAgentService.onStatus((status) => {
      if (status === "connected" || status === "ready") {
        setAgentStatus("connected");
        setError(null);
      } else if (status === "disconnected") {
        setAgentStatus("disconnected");
      } else if (status === "error") {
        setAgentStatus("error");
        setError(
          "Connection error. Please check if the AI agent server is running."
        );
      }
    });

    // Listen for chat responses
    aiAgentService.onMessage((response: ChatResponse) => {
      setIsTyping(false);

      if (response.success && response.data) {
        const agentMessage: ChatMessage = {
          id: Date.now().toString(),
          text: response.data.response,
          sender: "agent",
          timestamp: new Date(response.timestamp),
          toolCalls: response.data.toolCalls,
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `❌ Error: ${response.error || "Unknown error occurred"}`,
          sender: "agent",
          timestamp: new Date(response.timestamp),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(response.error || "Unknown error occurred");
      }
    });

    // Cleanup on unmount
    return () => {
      // Don't disconnect as the service is a singleton
    };
  }, []);

  // Notify agent when wallet connects
  useEffect(() => {
    if (isConnected && address && aiAgentService.isConnected()) {
      // Could send wallet connection event to agent if needed
      console.log("Wallet connected:", address);
    }
  }, [isConnected, address]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      if (aiAgentService.isConnected()) {
        // Send via WebSocket
        await aiAgentService.sendMessage(inputValue);
      } else {
        // Fallback to HTTP
        const response = await aiAgentService.sendMessageHTTP(inputValue);
        setIsTyping(false);

        if (response.success && response.data) {
          const agentMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response.data.response,
            sender: "agent",
            timestamp: new Date(response.timestamp),
            toolCalls: response.data.toolCalls,
          };
          setMessages((prev) => [...prev, agentMessage]);
        } else {
          throw new Error(response.error || "Request failed");
        }
      }
    } catch (err) {
      setIsTyping(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);

      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `❌ Error: ${errorMessage}. Please ensure the AI agent server is running on port 3002.`,
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      label: "Tesla Token Price",
      icon: TrendingUp,
      query: "What's the current price of Tesla token?",
    },
    {
      label: "Buy 5 Tokens",
      icon: Zap,
      query: "How much will it cost to buy 5 Tesla tokens?",
    },
    {
      label: "Analyze Vault",
      icon: Shield,
      query: "Analyze the vault contract",
    },
  ];

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  const clearHistory = async () => {
    try {
      await aiAgentService.clearHistory();
      setMessages([
        {
          id: "1",
          text: "Conversation history cleared. How can I assist you?",
          sender: "agent",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const getStatusBadge = () => {
    switch (agentStatus) {
      case "connected":
        return (
          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "connecting":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Connecting
          </Badge>
        );
      case "disconnected":
        return (
          <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/20 text-red-700 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  const renderToolCalls = (toolCalls?: ToolCall[]) => {
    if (!toolCalls || toolCalls.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
        <p className="text-xs font-semibold opacity-70">Tool Calls:</p>
        {toolCalls.map((call, index) => (
          <div
            key={index}
            className="text-xs bg-black/10 rounded p-2 space-y-1"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span className="font-mono font-semibold">{call.tool}</span>
            </div>
            {call.args && (
              <div className="opacity-70">
                Args: {JSON.stringify(call.args)}
              </div>
            )}
            {call.result && (
              <div className="opacity-70">
                Result:{" "}
                {typeof call.result === "string"
                  ? call.result
                  : JSON.stringify(call.result).substring(0, 100)}
                ...
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background opacity-90" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C754FF]/10 rounded-full blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern
              id="chatGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <circle
                cx="0"
                cy="0"
                r="1.5"
                fill="hsl(var(--primary))"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chatGrid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-all duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              {isConnected && (
                <Badge variant="outline" className="font-mono">
                  <Wallet className="h-3 w-3 mr-1" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Badge>
              )}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Badge className="relative bg-gradient-to-r from-primary/90 to-[#00BFFF]/90 border-primary/30 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gemini 2.0
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
          {/* Error Alert */}
          {error && agentStatus === "error" && (
            <Card className="mb-4 bg-destructive/10 border-destructive/50">
              <div className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-destructive mb-1">
                    Connection Error
                  </h4>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Make sure the AI agent server is running:{" "}
                    <code className="bg-background/50 px-1 rounded">
                      npm run dev:ai
                    </code>
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="flex-1 flex flex-col bg-gradient-card/50 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden">
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
                  <Avatar
                    className={`h-10 w-10 ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-primary to-[#00BFFF] shadow-lg shadow-primary/30"
                        : "bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30"
                    } border-2 border-background`}
                  >
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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>

                    {/* Tool Calls Display */}
                    {message.sender === "agent" &&
                      renderToolCalls(message.toolCalls)}

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.sender === "agent" && (
                        <Badge
                          variant="outline"
                          className="text-xs border-white/20"
                        >
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
                      <div
                        className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!isTyping &&
              messages.length <= 2 &&
              agentStatus === "connected" && (
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                      className="bg-gradient-card hover:bg-destructive/10 border-border/50 transition-all duration-300 hover:scale-105 hover:border-destructive/50"
                    >
                      Clear History
                    </Button>
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
                    placeholder="Ask about prices, buy/sell costs, contracts, or blockchain data..."
                    disabled={agentStatus !== "connected"}
                    className="pr-12 bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input transition-all duration-300 rounded-xl h-12 text-base shadow-inner disabled:opacity-50"
                  />
                  {inputValue && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      Press Enter
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || agentStatus !== "connected"}
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
                  Powered by Gemini 2.0 Flash
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
