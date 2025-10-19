import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LayoutDashboard, Users, FileText, Mail, MessageSquare, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import logo from "@/assets/intellivault-logo.png";

const navLinks = [
  { name: "Home", href: "/", icon: Home, isRoute: true },
  { name: "Dashboard", href: "#dashboard", icon: LayoutDashboard, isRoute: false },
  { name: "Chat", href: "/chat", icon: MessageSquare, isRoute: true }, 
  { name: "Partners", href: "#partners", icon: Users, isRoute: false },
  { name: "Docs", href: "#docs", icon: FileText, isRoute: false },
  { name: "Contact", href: "#contact", icon: Mail, isRoute: false },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWalletClick = () => {
    if (isConnected) {
      open({ view: 'Account' });
    } else {
      open();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          : "bg-gradient-to-b from-background/40 to-transparent backdrop-blur-sm"
      }`}
    >
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#headerGradient)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo with glassmorphic effect */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden backdrop-blur-sm bg-background/20 border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              <img src={logo} alt="IntelliVault" className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#00BFFF] via-primary to-[#C754FF] bg-clip-text text-transparent" style={{ fontFamily: "Inter, sans-serif" }}>
              IntelliVault
            </span>
          </Link>

          {/* Desktop Navigation with icons */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/5 backdrop-blur-sm"
                >
                  <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-500" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/5 backdrop-blur-sm"
                >
                  <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-500" />
                </a>
              )
            ))}
          </nav>

          {/* Wallet Connect & Launch App Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={handleWalletClick}
              variant="outline"
              className="relative overflow-hidden backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-500 font-semibold group"
            >
              <Wallet className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">
                {isConnected && address ? formatAddress(address) : "Connect Wallet"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>

            <Link to="/vault">
              <Button className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-[#00BFFF]/90 hover:from-primary hover:to-[#00BFFF] backdrop-blur-sm border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-500 font-semibold group">
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu with glassmorphism */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 rounded-xl backdrop-blur-xl bg-background/60 border border-border/40 p-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-4 rounded-lg hover:bg-primary/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-4 rounded-lg hover:bg-primary/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </a>
                )
              ))}
              <Button 
                onClick={() => {
                  handleWalletClick();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full mt-2 border-primary/20"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnected && address ? formatAddress(address) : "Connect Wallet"}
              </Button>
              <Link to="/vault" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-primary to-[#00BFFF] mt-2 w-full">Launch App</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};