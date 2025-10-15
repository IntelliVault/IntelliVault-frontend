import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AssetMarketplace } from "@/components/AssetMarketplace";
import { AddressIntelligence } from "@/components/AddressIntelligence";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <AssetMarketplace />
      <AddressIntelligence />
    </div>
  );
};

export default Index;
