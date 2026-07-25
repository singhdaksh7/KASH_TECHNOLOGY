export type ExoraScreen = "home" | "markets" | "trade" | "wallet" | "profile";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  chartData: number[];
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "buy" | "sell";
  asset: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface UserData {
  name: string;
  avatar: string;
  portfolioBalance: number;
  dailyProfitLoss: number;
  dailyProfitLossPct: number;
  inrBalance: number;
  kycStatus: "verified" | "pending" | "unverified";
  twoFactorEnabled: boolean;
}
