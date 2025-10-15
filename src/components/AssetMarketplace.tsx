import { AssetCard } from "./AssetCard";

const MOCK_ASSETS = [
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "stock" as const,
    price: 242.84,
    change: 2.4,
    volume: "$1.2M",
    holders: 1247
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock" as const,
    price: 178.52,
    change: -0.8,
    volume: "$890K",
    holders: 2134
  },
  {
    symbol: "USTB",
    name: "US Treasury Bond",
    type: "bond" as const,
    price: 98.45,
    change: 0.3,
    volume: "$2.4M",
    holders: 856
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "stock" as const,
    price: 384.12,
    change: 1.7,
    volume: "$1.8M",
    holders: 1892
  },
  {
    symbol: "GOOG",
    name: "Alphabet Inc.",
    type: "stock" as const,
    price: 141.80,
    change: 3.2,
    volume: "$1.1M",
    holders: 1456
  },
  {
    symbol: "CORP",
    name: "Corporate Bond AA",
    type: "bond" as const,
    price: 102.34,
    change: 0.1,
    volume: "$780K",
    holders: 523
  }
];

export const AssetMarketplace = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Tokenized Asset Marketplace</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trade institutional-grade assets with instant settlement via PYUSD
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ASSETS.map((asset) => (
            <AssetCard key={asset.symbol} {...asset} />
          ))}
        </div>
      </div>
    </section>
  );
};
