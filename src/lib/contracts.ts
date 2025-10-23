export const VAULT_ABI = [
  "function getPrice(address _token) public view returns (uint256)",
  "function stockList(address) public view returns (string memory name, uint256 pricingFactor, uint256 currentSupply, bool isSupported)",
  "function userStockBalances(address token, address user) public view returns (uint256)",
  "function owner() public view returns (address)",
  "function PYUSD_DECIMALS() public view returns (uint8)",
  "function STOCK_DECIMALS() public view returns (uint8)",
];

export const TOKEN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function totalSupply() public view returns (uint256)",
  "function whitelisted(address) public view returns (bool)",
];

export const PYUSD_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function decimals() public pure returns (uint8)",
];