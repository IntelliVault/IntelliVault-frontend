import { Card } from "@/components/ui/card";
import { Coins, Lock, BarChart3, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Secure Vaults",
    description: "Smart contract-based vaults holding tokenized assets with multi-signature security"
  },
  {
    icon: Coins,
    title: "PYUSD Settlement",
    description: "All trades settled instantly using PYUSD stablecoin for reliable transactions"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive trading data and holder statistics powered by Blockscout"
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Track and analyze activity across multiple blockchain networks seamlessly"
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Built for Institutional Trading</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade infrastructure for tokenized real-world assets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
