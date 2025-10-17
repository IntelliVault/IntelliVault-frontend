import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero z-10" />
      
      {/* Content */}
      <div className="container relative z-20 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by PYUSD & Blockscout</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Trade Tokenized
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Real-World Assets
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Access institutional-grade bonds and stocks as ERC-20 tokens. Secured in decentralized vaults with PYUSD settlements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/vault">
              <Button variant="hero" size="lg">
                Launch Vault
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View Analytics
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h3 className="text-3xl font-bold">$2.4M</h3>
              </div>
              <p className="text-muted-foreground">Total Value Locked</p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-3xl font-bold">847</h3>
              </div>
              <p className="text-muted-foreground">Active Assets</p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-3xl font-bold">100%</h3>
              </div>
              <p className="text-muted-foreground">On-Chain Verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
