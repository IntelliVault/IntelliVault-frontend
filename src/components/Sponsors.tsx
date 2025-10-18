import { Card, CardContent } from "@/components/ui/card";
import { Coins, Search, Network } from "lucide-react";
import { useState } from "react";

const sponsors = [
  {
    name: "PYUSD",
    icon: Coins,
    tagline: "Stable settlements. Real liquidity.",
    color: "hsl(var(--pyusd-blue))",
    gradientFrom: "from-[#00BFFF]",
    gradientTo: "to-[#0080FF]",
  },
  {
    name: "Blockscout",
    icon: Search,
    tagline: "Cross-chain transparency and data you can trust.",
    color: "hsl(var(--blockscout-magenta))",
    gradientFrom: "from-[#C754FF]",
    gradientTo: "to-[#9F44D3]",
  },
  {
    name: "MCP",
    icon: Network,
    tagline: "Smart analytics for intelligent trading.",
    color: "hsl(var(--mcp-green))",
    gradientFrom: "from-[#00C878]",
    gradientTo: "to-[#00A062]",
  },
];

export const Sponsors = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-4 bg-gradient-sponsors overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C754FF]/20 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-neon-blue bg-clip-text text-transparent inline-block">
            Trusted Partners
          </h2>
          
          <p className="text-[#A0AEC0] text-lg max-w-2xl mx-auto tracking-wide font-normal">
            Powering the future of decentralized finance with industry-leading technology partners
          </p>
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {sponsors.map((sponsor, index) => {
            const isHovered = hoveredCard === index;
            
            return (
              <Card
                key={sponsor.name}
                className={`group relative overflow-hidden border-2 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  border-border/30 hover:border-transparent
                  ${isHovered ? "transform -translate-y-1.5 shadow-glassmorphic" : ""}
                `}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-8 h-80 flex flex-col items-center justify-center relative">
                  {/* Icon with Gradient Circle */}
                  <div
                    className={`mb-6 p-5 rounded-full bg-gradient-to-br ${sponsor.gradientFrom} ${sponsor.gradientTo} 
                      transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isHovered ? "scale-110 shadow-lg" : "scale-100"}
                    `}
                    style={{
                      boxShadow: isHovered ? `0 10px 40px ${sponsor.color}80` : "none",
                    }}
                  >
                    <sponsor.icon 
                      className="w-10 h-10 text-white transition-transform duration-500"
                      style={{
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  </div>

                  {/* Sponsor Name */}
                  <h3 className="text-2xl font-bold mb-3 transition-all duration-500 text-center text-foreground">
                    {sponsor.name}
                  </h3>

                  {/* Tagline - Fades in on hover */}
                  <p 
                    className={`text-sm font-medium text-center mb-4 px-4 transition-all duration-500
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                    `}
                    style={{ color: sponsor.color }}
                  >
                    {sponsor.tagline}
                  </p>

                  {/* Learn More Button - Appears on hover */}
                  <button
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-500
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    `}
                    style={{
                      background: isHovered ? `linear-gradient(90deg, ${sponsor.color}, ${sponsor.color}dd)` : "transparent",
                      color: "white",
                    }}
                  >
                    Learn more →
                  </button>

                  {/* Glow Effect on Hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10 blur-xl
                      ${isHovered ? "opacity-30" : "opacity-0"}
                    `}
                    style={{
                      background: `radial-gradient(circle at center, ${sponsor.color}, transparent 70%)`,
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-[#A0AEC0]/80 text-sm tracking-wide max-w-3xl mx-auto font-light">
          Together with our partners, we're building the next era of tokenized real-world assets.
        </p>
      </div>
    </section>
  );
};
