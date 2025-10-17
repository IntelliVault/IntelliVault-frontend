import { useState } from "react";
import { ArrowLeft, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Mock data
  const vaultBalance = "125,450.00";
  const totalValue = "142,890.50";
  const profitLoss = "+13.9%";

  const holdings = [
    { asset: "US Treasury 10Y", symbol: "UST10Y", amount: "50,000", value: "52,340.00", apy: "4.5%" },
    { asset: "Apple Inc. Stock", symbol: "AAPL", amount: "100", value: "45,230.00", apy: "2.8%" },
    { asset: "Tesla Inc. Stock", symbol: "TSLA", amount: "75", value: "28,450.50", apy: "3.2%" },
    { asset: "Corporate Bond AAA", symbol: "CORP-AAA", amount: "25,000", value: "16,870.00", apy: "5.1%" },
  ];

  const transactions = [
    { type: "Deposit", asset: "PYUSD", amount: "25,000", date: "2025-10-15", status: "Completed" },
    { type: "Buy", asset: "UST10Y", amount: "50,000", date: "2025-10-14", status: "Completed" },
    { type: "Buy", asset: "AAPL", amount: "100", date: "2025-10-12", status: "Completed" },
    { type: "Withdraw", asset: "PYUSD", amount: "5,000", date: "2025-10-10", status: "Completed" },
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm font-mono">
              0x742d...4e89
            </Badge>
            <Button variant="outline" size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Overview */}
        <section>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Your Vault
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription>PYUSD Balance</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">
                  ${vaultBalance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available for trading</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription>Total Portfolio Value</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  ${totalValue}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold text-success">{profitLoss}</span>
                  <span className="text-sm text-muted-foreground">vs. initial</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription>Average APY</CardDescription>
                <CardTitle className="text-3xl font-bold text-accent">
                  3.9%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Weighted by holdings</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Holdings */}
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Tokenized real-world assets in your vault</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value (PYUSD)</TableHead>
                      <TableHead>APY</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.symbol}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{holding.asset}</p>
                            <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{holding.amount}</TableCell>
                        <TableCell className="font-semibold">${holding.value}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-success border-success/30">
                            {holding.apy}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Trade</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent vault activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.type === "Deposit" && <ArrowDownLeft className="h-4 w-4 text-success" />}
                            {tx.type === "Withdraw" && <ArrowUpRight className="h-4 w-4 text-destructive" />}
                            {tx.type === "Buy" && <DollarSign className="h-4 w-4 text-primary" />}
                            <span className="font-medium">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{tx.asset}</TableCell>
                        <TableCell>${tx.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-success border-success/30">
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Deposit/Withdraw */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Funds</CardTitle>
                <CardDescription>Deposit or withdraw PYUSD</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="deposit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposit">Deposit</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="deposit" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Amount (PYUSD)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Wallet balance: $50,000.00
                      </p>
                    </div>
                    <Button className="w-full" size="lg">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Deposit to Vault
                    </Button>
                  </TabsContent>

                  <TabsContent value="withdraw" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount">Amount (PYUSD)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Available: ${vaultBalance}
                      </p>
                    </div>
                    <Button className="w-full" variant="outline" size="lg">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Withdraw from Vault
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Vault Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Smart Contract</span>
                  <span className="font-mono text-xs">0x1a2b...3c4d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Settlement Token</span>
                  <span className="font-medium">PYUSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total TVL</span>
                  <span className="font-semibold">$45.2M</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Vault;
