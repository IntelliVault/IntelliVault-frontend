// src/hooks/use-token-balances.ts
import { useAccount, useBalance } from 'wagmi';
import { TOKEN_ADDRESSES } from '@/config/web3';
import { formatUnits } from 'viem';

export const useTokenBalances = () => {
  const { address, chain } = useAccount();

  // ETH Balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // PYUSD Balance
  const { data: pyusdBalance } = useBalance({
    address,
    token: chain?.id === 1 
      ? TOKEN_ADDRESSES.PYUSD.mainnet as `0x${string}`
      : TOKEN_ADDRESSES.PYUSD.sepolia as `0x${string}`,
  });

  // USDC Balance
  const { data: usdcBalance } = useBalance({
    address,
    token: chain?.id === 1 
      ? TOKEN_ADDRESSES.USDC.mainnet as `0x${string}`
      : TOKEN_ADDRESSES.USDC.sepolia as `0x${string}`,
  });

  return {
    eth: ethBalance ? {
      formatted: parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(4),
      symbol: ethBalance.symbol,
      value: ethBalance.value
    } : null,
    pyusd: pyusdBalance ? {
      formatted: parseFloat(formatUnits(pyusdBalance.value, pyusdBalance.decimals)).toFixed(2),
      symbol: 'PYUSD',
      value: pyusdBalance.value
    } : null,
    usdc: usdcBalance ? {
      formatted: parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2),
      symbol: usdcBalance.symbol,
      value: usdcBalance.value
    } : null,
  };
};