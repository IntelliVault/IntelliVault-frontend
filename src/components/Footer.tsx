import { Github, Twitter, Linkedin, Hexagon, Coins } from "lucide-react";
import logo from "@/assets/intellivault-logo.png";

const quickLinks = [
  { name: "About", href: "#" },
  { name: "Partners", href: "#partners" },
  { name: "Docs", href: "#docs" },
  { name: "Privacy", href: "#privacy" },
  { name: "Terms", href: "#terms" },
];

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

// Animated tokens for footer
const footerTokens = [
  { x: "5%", y: "20%", delay: "0s" },
  { x: "15%", y: "70%", delay: "2s" },
  { x: "85%", y: "30%", delay: "1s" },
  { x: "95%", y: "80%", delay: "3s" },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background/98 to-background backdrop-blur-xl">
      {/* Elegant metallic gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00BFFF]/60 via-primary/60 via-[#C754FF]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
      </div>
      
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.15"/>
              <circle cx="0" cy="0" r="1" fill="hsl(var(--primary))" opacity="0.3"/>
            </pattern>
            <linearGradient id="footerOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerGrid)" />
          <rect width="100%" height="100%" fill="url(#footerOverlay)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left: Logo + Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-lg group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] transition-all duration-300">
                <img src={logo} alt="IntelliVault" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#00BFFF] via-primary to-[#C754FF] bg-clip-text text-transparent uppercase">
                IntelliVault
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Powering the future of tokenized finance.
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Social Icons with elegant glassmorphism */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="relative w-11 h-11 rounded-xl backdrop-blur-sm bg-background/30 border border-primary/20 hover:border-primary/50 hover:bg-primary/10 group transition-all duration-500 overflow-hidden"
                >
                  <div className="relative w-full h-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all duration-500">
                    <social.icon size={18} className="group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {/* Subtle glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_hsl(var(--primary)/0.4)]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Copyright with elegant divider */}
        <div className="mt-12 pt-8 relative">
          {/* Elegant divider line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <p className="text-xs text-muted-foreground/80 text-center font-light tracking-wide">
            © 2025 IntelliVault. Built for transparent DeFi.
          </p>
        </div>
      </div>
    </footer>
  );
};
