export const CONFIG = {
  VAULT_ADDRESS: import.meta.env.VITE_VAULT_ADDRESS,
  PYUSD_ADDRESS: import.meta.env.VITE_PYUSD_ADDRESS,
  RPC_URL: import.meta.env.VITE_RPC_URL,
  STOCK_TOKENS: (import.meta.env.VITE_STOCK_TOKENS || "").split(",").filter(Boolean),
};

export const NETWORK = {
  NAME: "Sepolia",
  CHAIN_ID: 11155111,
  EXPLORER: "https://eth-sepolia.blockscout.com/",
};