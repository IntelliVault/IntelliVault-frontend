// src/lib/readers.ts

import { ethers } from "ethers";
import { CONFIG } from "@/config/constants";
import { VAULT_ABI, TOKEN_ABI, PYUSD_ABI } from "./contracts";

// Initialize provider
export const getProvider = () => {
  return new ethers.JsonRpcProvider(CONFIG.RPC_URL);
};

// Get contract instances
export const getContracts = (provider: ethers.Provider) => {
  return {
    vault: new ethers.Contract(CONFIG.VAULT_ADDRESS, VAULT_ABI, provider),
    pyusd: new ethers.Contract(CONFIG.PYUSD_ADDRESS, PYUSD_ABI, provider),
    getToken: (address: string) =>
      new ethers.Contract(address, TOKEN_ABI, provider),
  };
};

// Fetch user portfolio data
export const fetchUserPortfolio = async (userAddress: string) => {
  const provider = getProvider();
  const { vault, pyusd, getToken } = getContracts(provider);

  // Get PYUSD balance
  const pyusdBalance = await pyusd.balanceOf(userAddress);
  const pyusdFormatted = ethers.formatUnits(pyusdBalance, 6);

  // Fetch holdings for each token
  const holdings = [];
  let totalValueUSD = 0;

  for (const tokenAddress of CONFIG.STOCK_TOKENS) {
    try {
      const token = getToken(tokenAddress);

      const [balance, stockInfo, price, decimals, symbol, name] =
        await Promise.all([
          token.balanceOf(userAddress),
          vault.stockList(tokenAddress),
          vault.getPrice(tokenAddress).catch(() => 0n),
          token.decimals(),
          token.symbol(),
          token.name(),
        ]);

      if (balance > 0n) {
        const balanceFormatted = ethers.formatUnits(balance, decimals);
        const priceFormatted = ethers.formatUnits(price, 6);
        const valueUSD =
          parseFloat(balanceFormatted) * parseFloat(priceFormatted);

        totalValueUSD += valueUSD;

        holdings.push({
          address: tokenAddress,
          name: name || stockInfo.name || "Unknown",
          symbol: symbol || "???",
          balance: balanceFormatted,
          price: priceFormatted,
          valueUSD: valueUSD.toFixed(2),
          isSupported: stockInfo.isSupported,
        });
      }
    } catch (error) {
      console.error(`Error fetching token ${tokenAddress}:`, error);
    }
  }

  return {
    pyusdBalance: pyusdFormatted,
    holdings,
    totalValueUSD: totalValueUSD.toFixed(2),
    activeAssets: holdings.length,
  };
};

// Fetch vault analytics data
export const fetchVaultAnalytics = async () => {
  const provider = getProvider();
  const { vault, pyusd, getToken } = getContracts(provider);

  // Get PYUSD liquidity
  const pyusdBalance = await pyusd.balanceOf(CONFIG.VAULT_ADDRESS);
  const pyusdFormatted = ethers.formatUnits(pyusdBalance, 6);

  const assets = [];
  let totalValueUSD = 0;
  let activeCount = 0;

  for (const tokenAddress of CONFIG.STOCK_TOKENS) {
    try {
      const token = getToken(tokenAddress);

      const [stockInfo, price, decimals, symbol, name] = await Promise.all([
        vault.stockList(tokenAddress),
        vault.getPrice(tokenAddress).catch(() => 0n),
        token.decimals(),
        token.symbol(),
        token.name(),
      ]);

      if (stockInfo.isSupported) {
        activeCount++;

        const supplyInVault = ethers.formatUnits(
          stockInfo.currentSupply,
          decimals
        );
        const priceFormatted = ethers.formatUnits(price, 6);
        const marketCap =
          parseFloat(supplyInVault) * parseFloat(priceFormatted);

        totalValueUSD += marketCap;

        // Mock 24h volume (5% of market cap)
        const volume24h = marketCap * 0.05;

        // Mock holders count
        const holders = Math.floor(Math.random() * 5000) + 100;

        assets.push({
          address: tokenAddress,
          name: name || stockInfo.name || "Unknown Asset",
          symbol: symbol || "???",
          price: priceFormatted,
          supplyInVault,
          marketCap: marketCap.toFixed(2),
          volume24h: volume24h.toFixed(2),
          holders,
          isSupported: stockInfo.isSupported,
        });
      }
    } catch (error) {
      console.error(`Error fetching token ${tokenAddress}:`, error);
    }
  }

  return {
    totalVaultValue: totalValueUSD.toFixed(2),
    pyusdLiquidity: pyusdFormatted,
    activeAssets: activeCount,
    assets,
  };
};
