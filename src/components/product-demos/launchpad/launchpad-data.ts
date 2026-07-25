export const DUMMY_WALLET_ADDRESS = "0x8a9F...3b42";
export const DUMMY_CONTRACT_ADDRESS = "0x44C2...9d1A";
export const NETWORK_NAME = "Binance Smart Chain";

export function formatNumber(val: string): string {
  const num = parseFloat(val);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}
