import { useState } from "react";
import blockscoutLogo from "@/assets/blockscout-logo.png";
import pyusdLogo from "@/assets/pyusd-logo.png";
import hardhatLogo from "@/assets/hardhat-logo.png";

const sponsors = [
  {
    name: "Blockscout",
    logo: blockscoutLogo,
    label: "On-chain Analytics Partner",
    description: "Empowering IntelliVault with transparent on-chain analytics and network visibility.",
    glowColor: "#8B5CF6",
  },
  {
    name: "PayPal USD",
    logo: pyusdLogo,
    label: "Stablecoin Partner",
    description: "Enabling secure, stable transactions through trusted USD-backed assets.",
    glowColor: "#00BFFF",
  },
  {
    name: "Hardhat",
    logo: hardhatLogo,
    label: "Development Environment",
    description: "Providing a powerful development environment for blockchain innovation.",
    glowColor: "#F7DF1E",
  },
];

export const Sponsors = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4 bg-[#0D1117] overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00BFFF]/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header with Gradient Text and Underline Animation */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 relative inline-block group">
            <span className="bg-gradient-to-r from-[#00BFFF] via-[#8B5CF6] to-[#00BFFF] bg-clip-text text-transparent">
              Trusted Partners
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powering the future of decentralized finance with industry-leading technology
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sponsors.map((sponsor, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={sponsor.name}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glassmorphic Card */}
                <div
                  className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-500 ease-out
                    ${isHovered ? 'transform -translate-y-2' : ''}
                  `}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isHovered 
                      ? `0 20px 60px ${sponsor.glowColor}40, inset 0 0 20px ${sponsor.glowColor}20`
                      : "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${sponsor.glowColor}40, transparent)`,
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Logo Container with Glow */}
                  <div className="mb-6 flex justify-center">
                    <div 
                      className="relative p-4 transition-all duration-500"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 30px ${sponsor.glowColor})` : "none",
                      }}
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className={`h-20 w-auto object-contain transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                      />
                    </div>
                  </div>

                  {/* Partner Name */}
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {sponsor.name}
                  </h3>

                  {/* Label */}
                  <p 
                    className="text-sm font-semibold text-center mb-4 transition-colors duration-300"
                    style={{ color: isHovered ? sponsor.glowColor : '#00BFFF' }}
                  >
                    {sponsor.label}
                  </p>

                  {/* Description */}
                  <p className="text-gray-400 text-sm text-center leading-relaxed">
                    {sponsor.description}
                  </p>

                  {/* Bottom Glow Line */}
                  <div 
                    className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ color: sponsor.glowColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
