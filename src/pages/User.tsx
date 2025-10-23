// src/pages/User.tsx

import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, TrendingUp, ShieldCheck, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAccount } from "wagmi";
import { fetchUserPortfolio } from "@/lib/readers";
import { CONFIG, NETWORK } from "@/config/constants";
import { Header } from "@/components/Header";

const User = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    portfolioValue: "0.00",
    pyusdBalance: "0.00",
    activeAssets: 0,
    totalValueUSD: 0,
  });
  const [holdings, setHoldings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const calculateReputationScore = () => {
    const baseScore = 500;
    const valueBonus = Math.min(300, portfolioData.totalValueUSD / 100);
    const assetBonus = portfolioData.activeAssets * 50;
    return Math.floor(baseScore + valueBonus + assetBonus);
  };

  const getRiskLevel = () => {
    if (portfolioData.activeAssets === 0) return "None";
    if (portfolioData.activeAssets === 1) return "High";
    if (portfolioData.activeAssets === 2) return "Medium";
    return "Low";
  };

  const fetchData = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserPortfolio(address);
      setPortfolioData({
        portfolioValue: parseFloat(data.totalValueUSD).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        pyusdBalance: parseFloat(data.pyusdBalance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        activeAssets: data.activeAssets,
        totalValueUSD: parseFloat(data.totalValueUSD),
      });
      setHoldings(data.holdings);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to fetch portfolio data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchData();
    }
  }, [isConnected, address]);

  const reputationScore = calculateReputationScore();
  const riskLevel = getRiskLevel();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto mt-24 px-4 py-8 space-y-8">
        {!isConnected ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view your portfolio and track your holdings
              </p>
              <p className="text-sm text-muted-foreground">
                Use the "Connect Wallet" button in the header to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <section>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                My Portfolio
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="font-mono text-sm">
                  {formatAddress(address)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {NETWORK.NAME}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardDescription>Total Portfolio Value</CardDescription>
                    <CardTitle className="text-3xl font-bold text-primary">
                      ${loading ? "..." : portfolioData.portfolioValue}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-semibold text-success">Live Data</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardDescription>PYUSD Balance</CardDescription>
                    <CardTitle className="text-3xl font-bold text-foreground">
                      ${loading ? "..." : portfolioData.pyusdBalance}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Available for trading</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardDescription>Active Assets</CardDescription>
                    <CardTitle className="text-3xl font-bold text-accent">
                      {loading ? "..." : portfolioData.activeAssets}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Tokenized holdings</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardDescription>Reputation Score</CardDescription>
                    <CardTitle className="text-3xl font-bold text-success">
                      {loading ? "..." : reputationScore}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(reputationScore / 1000) * 100} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </section>

            {error && (
              <Card className="bg-destructive/10 border-destructive/50">
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {holdings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Holdings</CardTitle>
                  <CardDescription>Your current token positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {holdings.map((holding, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-card border border-border/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{holding.name}</span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {holding.symbol}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Balance: {parseFloat(holding.balance).toFixed(4)} {holding.symbol}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${parseFloat(holding.valueUSD).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            @ ${parseFloat(holding.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-success" />
                    Address Risk Assessment
                  </CardTitle>
                  <CardDescription>Your wallet security and reputation analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge variant="outline" className={
                        riskLevel === "Low" ? "text-success border-success/30" :
                        riskLevel === "Medium" ? "text-warning border-warning/30" :
                        riskLevel === "High" ? "text-destructive border-destructive/30" :
                        "text-muted-foreground border-border"
                      }>
                        {riskLevel}
                      </Badge>
                    </div>
                    <Progress 
                      value={
                        riskLevel === "Low" ? 15 :
                        riskLevel === "Medium" ? 50 :
                        riskLevel === "High" ? 85 : 0
                      } 
                      className="h-3" 
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {riskLevel === "Low" && "Well-diversified portfolio with multiple assets"}
                      {riskLevel === "Medium" && "Consider adding more assets for better diversification"}
                      {riskLevel === "High" && "Portfolio concentrated in single asset"}
                      {riskLevel === "None" && "No active positions"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">Connected</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Wallet successfully connected
                      </p>
                    </div>

                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">Live Data</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Real-time blockchain data
                      </p>
                    </div>

                    {portfolioData.activeAssets >= 2 ? (
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">Diversified</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Holdings across {portfolioData.activeAssets} assets
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Diversification</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Consider adding more assets
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">Network</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {NETWORK.NAME} Testnet
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-card border border-border/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Reputation Breakdown</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Portfolio Value</span>
                          <span className="font-medium">{Math.min(100, Math.floor(portfolioData.totalValueUSD / 10))}/100</span>
                        </div>
                        <Progress value={Math.min(100, portfolioData.totalValueUSD / 10)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Asset Diversity</span>
                          <span className="font-medium">{Math.min(100, portfolioData.activeAssets * 25)}/100</span>
                        </div>
                        <Progress value={Math.min(100, portfolioData.activeAssets * 25)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Wallet Activity</span>
                          <span className="font-medium">75/100</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/vault">
                      <Button className="w-full" size="lg">
                        View All Assets
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg" onClick={fetchData} disabled={loading}>
                      {loading ? "Refreshing..." : "Refresh Data"}
                    </Button>
                    <a 
                      href={`${NETWORK.EXPLORER}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        View on Explorer
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet Address</span>
                      <span className="font-mono font-medium">
                        {formatAddress(address)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Holdings</span>
                      <span className="font-medium">{portfolioData.activeAssets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="text-success border-success/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">{NETWORK.NAME}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default User;