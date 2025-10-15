import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetCardProps {
  symbol: string;
  name: string;
  type: "bond" | "stock";
  price: number;
  change: number;
  volume: string;
  holders: number;
}

export const AssetCard = ({ symbol, name, type, price, change, volume, holders }: AssetCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-bold">{symbol}</h3>
            <Badge variant={type === "bond" ? "secondary" : "default"} className="capitalize">
              {type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        
        <div className={`flex items-center gap-1 ${isPositive ? 'text-secondary' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price</span>
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">24h Volume</span>
          <span className="font-medium">{volume}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Holders</span>
          <span className="font-medium">{holders.toLocaleString()}</span>
        </div>
      </div>
      
      <Button className="w-full" variant="default">
        Trade Now
      </Button>
    </Card>
  );
};
