// src/pages/Vault.tsx

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, BarChart3, RefreshCw, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchVaultAnalytics } from "@/lib/readers";
import { CONFIG, NETWORK } from "@/config/constants";
import { Header } from "@/components/Header";

const Vault = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vaultData, setVaultData] = useState({
    totalVaultValue: "0.00",
    pyusdLiquidity: "0.00",
    activeAssets: 0,
  });
  const [assets, setAssets] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVaultAnalytics();
      console.log('data', data)
      setVaultData({
        totalVaultValue: parseFloat(data.totalVaultValue).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        pyusdLiquidity: parseFloat(data.pyusdLiquidity).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        activeAssets: data.activeAssets,
      });
      setAssets(data.assets);
    } catch (err) {
      console.error("Error fetching vault data:", err);
      setError("Failed to fetch vault data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatVolume = (volume: string | number) => {
    const numVolume = typeof volume === 'string' ? parseFloat(volume) : volume;
    if (numVolume >= 1000000) {
      return `$${(numVolume / 1000000).toFixed(2)}M`;
    } else if (numVolume >= 1000) {
      return `$${(numVolume / 1000).toFixed(2)}K`;
    }
    return `$${numVolume.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto mt-24 px-4 py-8 space-y-8">
        {/* Vault Analytics Overview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Vault Analytics
            </h1>
            <Button
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Vault Value (TVL)
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">
                  ${vaultData.totalVaultValue}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Across all tokenized assets</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  PYUSD Liquidity
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  ${vaultData.pyusdLiquidity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available for trading</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Assets
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-accent">
                  {vaultData.activeAssets}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Tokenized RWAs</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Asset Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tokenized Real-World Assets</CardTitle>
            <CardDescription>All available RWAs in the vault</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading assets...</span>
              </div>
            ) : assets.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No assets found in the vault</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Volume</TableHead>
                    <TableHead>Holders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.symbol}>
                      <TableCell>
                        <p className="font-medium">{asset.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {asset.symbol}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatPrice(asset.price)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatVolume(asset.volume24h)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{asset.holders.toLocaleString()}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Vault Information */}
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle>Vault Information</CardTitle>
            <CardDescription>Smart contract and network details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Smart Contract</span>
                <span className="font-mono text-sm">{formatAddress(CONFIG.VAULT_ADDRESS)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Network</span>
                <Badge>{NETWORK.NAME} Testnet</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Settlement Token</span>
                <Badge variant="outline">PYUSD</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Total Assets</span>
                <span className="font-semibold">{assets.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Vault;