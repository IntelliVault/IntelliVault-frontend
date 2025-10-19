import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AssetMarketplace } from "@/components/AssetMarketplace";
import { AddressIntelligence } from "@/components/AddressIntelligence";
import { Sponsors } from "@/components/Sponsors";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Seamless animated background - clean and minimal */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background opacity-90" />
        
        {/* Subtle geometric network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <line x1="8%" y1="15%" x2="22%" y2="45%" stroke="url(#pageGrad1)" strokeWidth="1" strokeDasharray="8,4" className="animate-network-line" />
          <line x1="22%" y1="45%" x2="52%" y2="25%" stroke="url(#pageGrad1)" strokeWidth="1" strokeDasharray="8,4" className="animate-network-line" style={{ animationDelay: "1s" }} />
          <line x1="52%" y1="25%" x2="68%" y2="60%" stroke="url(#pageGrad2)" strokeWidth="1" strokeDasharray="8,4" className="animate-network-line" style={{ animationDelay: "2s" }} />
          <line x1="68%" y1="60%" x2="82%" y2="35%" stroke="url(#pageGrad2)" strokeWidth="1" strokeDasharray="8,4" className="animate-network-line" style={{ animationDelay: "0.5s" }} />
          <defs>
            <linearGradient id="pageGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="pageGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#00BFFF", stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: "#C754FF", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#00BFFF", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle light rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#C754FF]/5 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Sponsors />
        <AssetMarketplace />
        <Features />
        <AddressIntelligence />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

