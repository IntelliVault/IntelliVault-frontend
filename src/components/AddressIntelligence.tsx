import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export const AddressIntelligence = () => {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    setIsSearching(true);
    // Mock search - would integrate with Blockscout MCP SDK
    setTimeout(() => setIsSearching(false), 1500);
  };
  
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">Powered by Blockscout MCP</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Address Intelligence</h2>
          <p className="text-xl text-muted-foreground">
            Multi-chain reputation checks and trading history analysis
          </p>
        </div>
        
        <Card className="p-8 bg-gradient-card border-border">
          <div className="flex gap-3 mb-8">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-input border-border"
            />
            <Button 
              onClick={handleSearch}
              disabled={!address || isSearching}
              className="px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
          
          {/* Mock Results */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Risk Assessment</h3>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Low Risk
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Transactions</p>
                  <p className="font-semibold">1,247</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Chains</p>
                  <p className="font-semibold">3</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Age</p>
                  <p className="font-semibold">2.4 years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Flagged Activity</p>
                  <p className="font-semibold">None</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-3">Cross-Chain Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ethereum</span>
                  <span className="font-medium">847 txns</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Polygon</span>
                  <span className="font-medium">312 txns</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Arbitrum</span>
                  <span className="font-medium">88 txns</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
