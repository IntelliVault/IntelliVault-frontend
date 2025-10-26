// src/pages/Chat.tsx

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
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

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

// Contract ABIs for MetaMask transactions
const VAULT_ABI = [
  "function buyStock(address _token, uint256 _amountInWholeTokens) public",
  "function sellStock(address _token, uint256 _amountInWholeTokens) public"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];



const Chat = () => {
  const { address, isConnected } = useAccount();
  const [currentMode, setCurrentMode] = useState<'agent' | 'query'>('agent');
  
  // Helper function to generate unique message IDs
  const generateMessageId = (prefix: string = 'msg') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Custom CSS for animation delays to avoid inline styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .animate-delay-1s { animation-delay: 1s !important; }
      .animate-delay-150ms { animation-delay: 150ms !important; }
      .animate-delay-300ms { animation-delay: 300ms !important; }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your IntelliVault AI Assistant powered by Gemini 2.0 Flash. I have two modes:\n\n**🤖 Agent Mode (Current):**\n• Get real-time token prices\n• Calculate buy/sell costs\n• Execute buy/sell with MetaMask\n\n**🔍 Query Mode:**\n• Multi-chain blockchain analysis\n• Transaction history across chains\n• Token holdings & gas calculations\n\n🌐 **Network Requirements**: Transactions work on Sepolia testnet. I'll automatically switch your MetaMask to the correct network.\n\nSwitch modes using the toggle above! How can I assist you today?",
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
  const [isExecutingTx, setIsExecutingTx] = useState(false);
  const [executedTxIds, setExecutedTxIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Setup AI agent service
  useEffect(() => {
    console.log('Chat component mounting, checking connection status...');
    
    // Check if already connected
    if (aiAgentService.isConnected()) {
      console.log('AI agent is already connected');
      setAgentStatus("connected");
      setError(null);
    } else {
      console.log('AI agent not connected, attempting connection...');
      // Ensure connection is attempted
      aiAgentService.connect();
    }

    // Listen for status updates
    aiAgentService.onStatus((status) => {
      console.log("Status update received:", status);
      if (status === "connected" || status === "ready") {
        setAgentStatus("connected");
        setError(null);
      } else if (status === "connecting") {
        setAgentStatus("connecting");
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
      console.log('📨 Received response in Chat component:', response);
      setIsTyping(false);

      try {
        if (!response) {
          throw new Error('Response is undefined');
        }

        if (response.success && response.data) {
          const agentMessage: ChatMessage = {
            id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: response.data.response || 'No response text available',
            sender: "agent",
            timestamp: response.timestamp ? new Date(response.timestamp) : new Date(),
            toolCalls: response.data.toolCalls,
          };
          setMessages((prev) => [...prev, agentMessage]);

        // Process tool calls for better user experience
        if (response.data.toolCalls) {
          // Enhance the response message with tool call results
          let enhancedMessage = response.data.response;
          
          response.data.toolCalls.forEach(call => {
            // Extract meaningful information from tool calls
            if (call.tool === 'get_token_price' && call.result && call.result.success) {
              // Debug the actual structure of tool calls
              console.log('🔍 Tool call structure:', JSON.stringify(call, null, 2));
              // Temporarily use fixed name to test if this fixes the server error
              enhancedMessage = `The current Tesla token price is **$${call.result.price} ${call.result.currency}**.`;
            } else if (call.tool === 'calculate_buy_cost' && call.result && call.result.success) {
              enhancedMessage = `To buy ${call.args.amount || 'the requested'} tokens, it will cost **${call.result.totalCost} ${call.result.currency}**.`;
            } else if (call.tool === 'calculate_sell_value' && call.result && call.result.success) {
              enhancedMessage = `Selling ${call.args.amount || 'the requested'} tokens will give you **${call.result.totalValue} ${call.result.currency}**.`;
            }
            
            // Check for MetaMask transactions
            if (call.result && call.result.requiresMetaMask) {
              // Create a unique ID for this transaction to prevent duplicates
              const txId = `${call.tool}-${JSON.stringify(call.args)}-${response.timestamp}`;
              
              if (!executedTxIds.has(txId)) {
                // Mark this transaction as executed
                setExecutedTxIds(prev => new Set([...prev, txId]));
                
                // Automatically trigger MetaMask transaction
                console.log('🚀 Auto-executing MetaMask transaction...');
                setTimeout(() => {
                  executeMetaMaskTransaction(call.result);
                }, 1000); // Small delay to let the user see the preparation message
              } else {
                console.log('🔄 Transaction already executed, skipping...');
              }
            }
          });
          
          // Update the agent message with enhanced content
          agentMessage.text = enhancedMessage;
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: `❌ Error: ${response.error || "Unknown error occurred"}`,
          sender: "agent",
          timestamp: new Date(response.timestamp),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(response.error || "Unknown error occurred");
      }
      } catch (error) {
        console.error('❌ Error processing chat response:', error);
        const fallbackMessage: ChatMessage = {
          id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: `❌ Error processing response: ${error instanceof Error ? error.message : 'Unknown error'}`,
          sender: "agent",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    });

    // Fallback health check (non-blocking)
    const checkHealthAfterDelay = async () => {
      // Wait a bit for WebSocket to connect first
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Only check health if still connecting or if connection failed
      if (!aiAgentService.isConnected()) {
        try {
          const healthy = await aiAgentService.checkHealth();
          if (!healthy && !aiAgentService.isConnected()) {
            setAgentStatus("error");
            setError(
              "AI Agent server is not available. Please ensure the server is running on port 3002."
            );
          }
        } catch (err) {
          console.error("Health check failed:", err);
          if (!aiAgentService.isConnected()) {
            setAgentStatus("error");
            setError(
              "Unable to connect to AI Agent server. Please ensure it's running on port 3002."
            );
          }
        }
      }
    };

    checkHealthAfterDelay();

    // Cleanup on unmount
    return () => {
      // Don't disconnect as the service is a singleton
    };
  }, []);

  // Notify agent when wallet connects
  useEffect(() => {
    if (isConnected && address && aiAgentService.isConnected()) {
      console.log("Wallet connected:", address);
      // Send wallet connection event to agent like HTML version
      aiAgentService.notifyWalletConnection(address);
    }
  }, [isConnected, address]);

  // Mode switching function
  const switchMode = (mode: 'agent' | 'query') => {
    setCurrentMode(mode);
    
    const modeMessage: ChatMessage = {
      id: generateMessageId('mode'),
      text: `Switched to ${mode === 'agent' ? 'Agent' : 'Query'} Mode`,
      sender: "agent",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, modeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: generateMessageId('user'),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      if (currentMode === 'query') {
        // Query Mode: Direct call to MCP server (like HTML version)
        try {
          const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
          });

          const data = await response.json();
          setIsTyping(false);

          if (data.success) {
            const agentMessage: ChatMessage = {
              id: generateMessageId('query-response'),
              text: data.response || data.data?.response || 'Query completed successfully',
              sender: "agent",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, agentMessage]);
          } else {
            throw new Error(data.error || 'Query failed');
          }
        } catch (error) {
          setIsTyping(false);
          const errorMessage = error instanceof Error ? error.message : 'MCP Query failed';
          const errorResponse: ChatMessage = {
            id: generateMessageId('query-error'),
            text: `❌ ${errorMessage}. Make sure MCP server is running on port 3001.`,
            sender: "agent",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorResponse]);
        }
      } else {
        // Agent Mode: Use WebSocket to AI agent
        if (aiAgentService.isConnected()) {
          // Use WebSocket like the HTML version
          console.log('📤 Sending message via WebSocket:', messageText);
          console.log('🔍 Testing with simple message first...');
          
          // For debugging: try exact same message as HTML version
          await aiAgentService.sendMessage(messageText);
        } else {
          // Fallback to HTTP
          const response = await aiAgentService.sendMessageHTTP(messageText);
          setIsTyping(false);

          if (response.success && response.data) {
            const agentMessage: ChatMessage = {
              id: generateMessageId('agent-http'),
              text: response.data.response,
              sender: "agent",
              timestamp: new Date(response.timestamp),
              toolCalls: response.data.toolCalls,
            };
            setMessages((prev) => [...prev, agentMessage]);

          // Process tool calls for better user experience (HTTP mode)
          if (response.data.toolCalls) {
            // Enhance the response message with tool call results
            let enhancedMessage = response.data.response;
            
            response.data.toolCalls.forEach(call => {
              // Extract meaningful information from tool calls
              if (call.tool === 'get_token_price' && call.result && call.result.success) {
                // Debug the actual structure of tool calls (HTTP mode)
                console.log('🔍 HTTP Tool call structure:', JSON.stringify(call, null, 2));
                // Temporarily use fixed name to test if this fixes the server error
                enhancedMessage = `The current Tesla token price is **$${call.result.price} ${call.result.currency}**.`;
              } else if (call.tool === 'calculate_buy_cost' && call.result && call.result.success) {
                enhancedMessage = `To buy ${call.args.amount || 'the requested'} tokens, it will cost **${call.result.totalCost} ${call.result.currency}**.`;
              } else if (call.tool === 'calculate_sell_value' && call.result && call.result.success) {
                enhancedMessage = `Selling ${call.args.amount || 'the requested'} tokens will give you **${call.result.totalValue} ${call.result.currency}**.`;
              }
              
              // Check for MetaMask transactions
              if (call.result && call.result.requiresMetaMask) {
                // Create a unique ID for this transaction to prevent duplicates
                const txId = `${call.tool}-${JSON.stringify(call.args)}-${response.timestamp}`;
                
                if (!executedTxIds.has(txId)) {
                  // Mark this transaction as executed
                  setExecutedTxIds(prev => new Set([...prev, txId]));
                  
                  console.log('🚀 Auto-executing MetaMask transaction (HTTP mode)...');
                  setTimeout(() => {
                    executeMetaMaskTransaction(call.result);
                  }, 1000);
                } else {
                  console.log('🔄 Transaction already executed (HTTP mode), skipping...');
                }
              }
            });
            
            // Update the agent message with enhanced content
            agentMessage.text = enhancedMessage;
          }
          } else {
            throw new Error(response.error || "Request failed");
          }
        }
      }
    } catch (err) {
      setIsTyping(false);
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);

      const errorResponse: ChatMessage = {
        id: generateMessageId('send-error'),
        text: `❌ Error: ${errorMessage}. Please ensure the ${currentMode === 'agent' ? 'AI agent server is running on port 3002' : 'MCP server is running on port 3001'}.`,
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

  const getQuickActions = () => {
    if (currentMode === 'agent') {
      return [
        {
          label: "Tesla Token Price",
          icon: TrendingUp,
          query: "What's the current price of Tesla token?",
        },
        {
          label: "Google Token Price",
          icon: TrendingUp,
          query: "What's the current price of Google token?",
        },
        {
          label: "Microsoft Token Price",
          icon: TrendingUp,
          query: "What's the current price of Microsoft token?",
        },
        {
          label: "Calculate Buy Cost",
          icon: TrendingUp,
          query: "How much will it cost to buy 5 Tesla tokens?",
        },
        {
          label: "Buy 5 Tesla",
          icon: Zap,
          query: "Buy 5 Tesla tokens",
        },
        {
          label: "Buy 5 Google",
          icon: Zap,
          query: "Buy 5 Google tokens",
        },
        {
          label: "Buy 5 Microsoft",
          icon: Zap,
          query: "Buy 5 Microsoft tokens",
        },
        {
          label: "Sell 3 Tesla",
          icon: TrendingUp,
          query: "Sell 3 Tesla tokens",
        },
        {
          label: "Sell 3 Google",
          icon: TrendingUp,
          query: "Sell 3 Google tokens",
        },
        {
          label: "Sell 3 Microsoft",
          icon: TrendingUp,
          query: "Sell 3 Microsoft tokens",
        },
      ];
    } else {
      return [
        {
          label: "Cross-Chain Activity",
          icon: TrendingUp,
          query: "Show me the activity of 0x49f51e3C94B459677c3B1e611DB3E44d4E6b1D55 across all chains",
        },
        {
          label: "Total Gas Spend",
          icon: TrendingUp,
          query: "Calculate my total gas spend across all chains for the last 10 transactions for 0x49f51e3C94B459677c3B1e611DB3E44d4E6b1D55",
        },
        {
          label: "Token Holdings",
          icon: Zap,
          query: "What tokens does 0x49f51e3C94B459677c3B1e611DB3E44d4E6b1D55 hold across all chains?",
        },
        {
          label: "Analyze Contract",
          icon: TrendingUp,
          query: "Analyze this contract 0xB6C58FDB4BBffeD7B7224634AB932518a29e4C4b on sepolia testnet",
        },
      ];
    }
  };

  const handleQuickAction = (query: string) => {
    if (currentMode === 'agent' && agentStatus !== "connected") {
      const errorMessage: ChatMessage = {
        id: generateMessageId('connection-error'),
        text: "❌ Not connected to AI Agent server",
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }
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

  // Execute MetaMask transaction automatically
  const executeMetaMaskTransaction = async (txData: any) => {
    if (isExecutingTx) {
      console.log('🔄 Transaction already in progress, skipping...');
      return;
    }
    
    setIsExecutingTx(true);
    try {
      if (!window.ethereum) {
        addErrorMessage('MetaMask not detected. Please install MetaMask first: https://metamask.io/download/');
        setIsExecutingTx(false);
        return;
      }

      // Add simple status message
      addAgentMessage('� Executing transaction with MetaMask...');
      
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      
      // Check and switch to Sepolia network if needed (silently)
      const network = await provider.getNetwork();
      const expectedChainId = 11155111; // Sepolia testnet
      
      if (Number(network.chainId) !== expectedChainId) {
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: `0x${expectedChainId.toString(16)}` }
          ]);
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Chain not added to MetaMask, add it
            await provider.send("wallet_addEthereumChain", [{
              chainId: `0x${expectedChainId.toString(16)}`,
              chainName: 'Sepolia Testnet',
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]);
          } else {
            throw switchError;
          }
        }
      }
      
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Execute each step automatically
      for (const step of txData.steps) {
        
        if (step.action === 'approve_pyusd' || step.action === 'approve_token') {
          // Approve token
          const tokenContract = new ethers.Contract(step.contract, ERC20_ABI, signer);
          
          try {
            // Verify contract exists by checking if it has code
            const code = await provider.getCode(step.contract);
            if (code === '0x') {
              throw new Error(`No contract found at address ${step.contract}. Please verify the contract address and network.`);
            }
            
            // Check current allowance
            const currentAllowance = await tokenContract.allowance(userAddress, step.spender);
            const requiredAmount = BigInt(step.amount);
            
            if (currentAllowance < requiredAmount) {
              const approveTx = await tokenContract.approve(step.spender, requiredAmount);
              await approveTx.wait();
            }
          } catch (contractError: any) {
            throw new Error(`Contract interaction failed: ${contractError.message}. Please verify you're on the correct network (Sepolia testnet).`);
          }
        } else if (step.action === 'buy_stock') {
          // Execute buy
          const vaultContract = new ethers.Contract(step.contract, VAULT_ABI, signer);
          
          // Verify vault contract exists
          const vaultCode = await provider.getCode(step.contract);
          if (vaultCode === '0x') {
            throw new Error(`No vault contract found at address ${step.contract}. Please verify the contract address and network.`);
          }
          
          const buyTx = await vaultContract.buyStock(
            step.params.token,
            BigInt(step.params.amount)
          );
          const receipt = await buyTx.wait();
          addAgentMessage(`✅ Buy transaction successful! Hash: ${receipt?.hash || buyTx.hash}`);
        } else if (step.action === 'sell_stock') {
          // Execute sell
          const vaultContract = new ethers.Contract(step.contract, VAULT_ABI, signer);
          
          // Verify vault contract exists
          const vaultCode = await provider.getCode(step.contract);
          if (vaultCode === '0x') {
            throw new Error(`No vault contract found at address ${step.contract}. Please verify the contract address and network.`);
          }
          
          const sellTx = await vaultContract.sellStock(
            step.params.token,
            BigInt(step.params.amount)
          );
          const receipt = await sellTx.wait();
          addAgentMessage(`✅ Sell transaction successful! Hash: ${receipt?.hash || sellTx.hash}`);
        }
      }
      
      addAgentMessage('🎉 Transaction completed successfully!');
      
    } catch (error: any) {
      console.error('Transaction error:', error);
      
      // Handle specific MetaMask errors
      if (error.code === 4001) {
        addErrorMessage('Transaction rejected by user in MetaMask');
      } else if (error.code === -32603) {
        addErrorMessage('Transaction failed - please check your balance and gas');
      } else if (error.message?.includes('insufficient funds')) {
        addErrorMessage('Insufficient funds for transaction + gas');
      } else {
        addErrorMessage(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsExecutingTx(false);
    }
  };

  // Helper functions to add messages
  const addAgentMessage = (text: string) => {
    const agentMessage: ChatMessage = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender: "agent",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);
  };

  const addErrorMessage = (text: string) => {
    const errorMessage: ChatMessage = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `❌ Error: ${text}`,
      sender: "agent",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
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



  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background opacity-90" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C754FF]/10 rounded-full blur-[120px] animate-glow-pulse animate-delay-1s" />
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
              {messages.filter(message => message && message.id).map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-slide-up`}
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
                    <div className="text-sm leading-relaxed">
                      {message?.text ? message.text.split('\n').map((line, index) => {
                        if (line.includes('**') && line.includes('**')) {
                          // Bold headers
                          return (
                            <div key={index} className="font-semibold text-primary mb-2 mt-3 first:mt-0">
                              {line.replace(/\*\*/g, '')}
                            </div>
                          );
                        } else if (line.startsWith('•') || line.startsWith('-')) {
                          // Bullet points
                          return (
                            <div key={index} className="flex items-start gap-2 ml-2 mb-1">
                              <span className="text-primary mt-1">•</span>
                              <span>{line.substring(1).trim()}</span>
                            </div>
                          );
                        } else if (line.match(/^\d+\./)) {
                          // Numbered lists
                          return (
                            <div key={index} className="ml-2 mb-1">
                              <span className="text-primary font-semibold mr-2">{line.match(/^\d+\./)?.[0]}</span>
                              {line.replace(/^\d+\.\s*/, '')}
                            </div>
                          );
                        } else if (line.trim()) {
                          return (
                            <div key={index} className="mb-1">
                              {line}
                            </div>
                          );
                        }
                        return <div key={index} className="mb-1"></div>;
                      }) : <div className="text-red-400">Error: Message content unavailable</div>}
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                      <span className="text-xs opacity-70">
                        {message?.timestamp ? message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : 'N/A'}
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

              {(isTyping || isExecutingTx) && (
                <div className="flex gap-4 animate-slide-up">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30 border-2 border-background">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gradient-to-br from-muted/80 to-muted backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce animate-delay-150ms" />
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce animate-delay-300ms" />
                      </div>
                      {isExecutingTx && (
                        <span className="text-sm text-muted-foreground">
                          Executing MetaMask transaction...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!isTyping &&
              messages.length <= 2 &&
              ((currentMode === 'agent' && agentStatus === "connected") || currentMode === 'query') && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    Quick Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getQuickActions().map((action) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        console.log('Manual connection status check:', aiAgentService.getConnectionStatus());
                        const connectivity = await aiAgentService.testConnectivity();
                        console.log('Connectivity test:', connectivity);
                        
                        // Try a simple ping first
                        if (aiAgentService.isConnected()) {
                          console.log('🏓 Sending test ping...');
                          aiAgentService.sendTestPing();
                        }
                      }}
                      className="bg-gradient-card hover:bg-primary/10 border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50"
                    >
                      Test Connection
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
                    placeholder={
                      currentMode === 'agent' 
                        ? "Ask about prices, buy/sell costs, contracts, or blockchain data..." 
                        : "Ask about cross-chain analysis, transaction history, token holdings..."
                    }
                    disabled={(currentMode === 'agent' && agentStatus !== "connected")}
                    className="pr-12 bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input transition-all duration-300 rounded-xl h-12 text-base shadow-inner disabled:opacity-50"
                  />
                  {inputValue && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      Press Enter
                    </span>
                  )}
                </div>
                
                {/* Mode Toggle Switch */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-muted/50 rounded-xl p-1 border border-border/50">
                    <button
                      onClick={() => switchMode('agent')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        currentMode === 'agent'
                          ? 'bg-gradient-to-r from-primary to-[#00BFFF] text-white shadow-md shadow-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Bot className="h-3 w-3" />
                      Agent
                    </button>
                    <button
                      onClick={() => switchMode('query')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        currentMode === 'query'
                          ? 'bg-gradient-to-r from-[#17a2b8] to-[#20c997] text-white shadow-md shadow-[#17a2b8]/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Zap className="h-3 w-3" />
                      Query
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || (currentMode === 'agent' && agentStatus !== "connected")}
                  size="lg"
                  className="shrink-0 h-12 px-6 bg-gradient-to-r from-primary to-[#00BFFF] hover:from-primary/90 hover:to-[#00BFFF]/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 rounded-xl"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    AI responses are for informational purposes only
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 ${
                      currentMode === 'agent'
                        ? 'border-primary/30 text-primary bg-primary/10'
                        : 'border-[#17a2b8]/30 text-[#17a2b8] bg-[#17a2b8]/10'
                    }`}
                  >
                    {currentMode === 'agent' ? (
                      <>
                        <Bot className="h-2.5 w-2.5 mr-1" />
                        Agent Mode • {agentStatus === "connected" ? "Connected" : "Disconnected"}
                      </>
                    ) : (
                      <>
                        <Zap className="h-2.5 w-2.5 mr-1" />
                        Query Mode • MCP Server
                      </>
                    )}
                  </Badge>
                </div>
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
