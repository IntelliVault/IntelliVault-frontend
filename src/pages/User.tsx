import { ArrowLeft, Wallet, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const User = () => {
  // User-specific mock data
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e4e89";
  const portfolioValue = "142,890.50";
  const pyusdBalance = "125,450.00";
  const activeAssets = "4";
  const reputationScore = 850;
  const riskLevel = "Low";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/vault" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Vault</span>
          </Link>
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* User Header */}
        <section>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="font-mono text-sm">
              {walletAddress}
            </Badge>
          </div>
          
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription>Total Portfolio Value</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">
                  ${portfolioValue}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold text-success">+13.9%</span>
                  <span className="text-sm text-muted-foreground">vs. initial</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardDescription>PYUSD Balance</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  ${pyusdBalance}
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
                  {activeAssets}
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
                  {reputationScore}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(reputationScore / 1000) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Assessment Card */}
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
                  <Badge variant="outline" className="text-success border-success/30">
                    {riskLevel}
                  </Badge>
                </div>
                <Progress value={15} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  Your wallet shows low risk indicators with strong transaction history
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">Transaction History</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {">"}2 years of verified transactions
                  </p>
                </div>

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">Verified Assets</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All holdings are legitimate RWAs
                  </p>
                </div>

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">No Red Flags</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Clean transaction patterns detected
                  </p>
                </div>

                <div className="p-4 bg-muted/50 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Diversification</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider adding more assets
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-card border border-border/50 rounded-lg">
                <h4 className="font-semibold mb-2">Reputation Breakdown</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Account Age</span>
                      <span className="font-medium">95/100</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Transaction Volume</span>
                      <span className="font-medium">88/100</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Wallet Activity</span>
                      <span className="font-medium">82/100</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
                <Button variant="outline" className="w-full" size="lg">
                  Transaction History
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Transactions</span>
                  <span className="font-medium">147</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <Badge variant="outline" className="text-success border-success/30">
                    Verified
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">Ethereum</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;
