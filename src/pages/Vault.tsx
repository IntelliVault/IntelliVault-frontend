import { ArrowLeft, TrendingUp, Users, BarChart3 } from "lucide-react";
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

const Vault = () => {
  // Vault-wide mock data
  const totalVaultValue = "45,234,890.50";
  const pyusdLiquidity = "12,450,000.00";
  const activeAssets = "24";

  const assets = [
    { name: "US Treasury 10Y Bond", symbol: "UST10Y", price: "$1,046.80", volume24h: "$2,450,000", holders: 1243 },
    { name: "Apple Inc. Stock", symbol: "AAPL", price: "$452.30", volume24h: "$8,920,000", holders: 3842 },
    { name: "Tesla Inc. Stock", symbol: "TSLA", price: "$379.34", volume24h: "$6,780,000", holders: 2951 },
    { name: "Corporate Bond AAA", symbol: "CORP-AAA", price: "$674.80", volume24h: "$1,230,000", holders: 845 },
    { name: "Real Estate REIT", symbol: "REIT-US", price: "$1,234.50", volume24h: "$3,450,000", holders: 1567 },
    { name: "Gold ETF", symbol: "GOLD", price: "$2,048.90", volume24h: "$5,670,000", holders: 2234 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Link to="/user">
            <Badge variant="outline" className="text-sm font-mono hover:bg-accent cursor-pointer">
              View My Portfolio
            </Badge>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Vault Analytics Overview */}
        <section>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Vault Analytics
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Vault Value (TVL)
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">
                  ${totalVaultValue}
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
                  ${pyusdLiquidity}
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
                  {activeAssets}
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
                    <TableCell className="font-semibold">{asset.price}</TableCell>
                    <TableCell className="text-muted-foreground">{asset.volume24h}</TableCell>
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
                <span className="font-mono text-sm">0x1a2b...3c4d</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Network</span>
                <Badge>Ethereum</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Settlement Token</span>
                <Badge variant="outline">PYUSD</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">8,742</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Vault;
