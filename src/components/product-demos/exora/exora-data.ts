import { Asset, Transaction, UserData } from "./types";

export const EXORA_USER: UserData = {
  name: "Alex Dev",
  avatar: "AD",
  portfolioBalance: 12450.75,
  dailyProfitLoss: 342.50,
  dailyProfitLossPct: 2.8,
  inrBalance: 50000.00,
  kycStatus: "verified",
  twoFactorEnabled: true,
};

export const EXORA_ASSETS: Asset[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 64230.50,
    change24h: 2.4,
    chartData: [40, 45, 42, 50, 48, 55, 60],
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3450.20,
    change24h: 4.2,
    chartData: [30, 35, 40, 38, 45, 42, 50],
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 145.80,
    change24h: -1.8,
    chartData: [60, 55, 50, 45, 48, 42, 40],
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 590.40,
    change24h: 0.5,
    chartData: [40, 42, 41, 43, 42, 45, 44],
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    price: 0.58,
    change24h: 1.2,
    chartData: [20, 22, 21, 24, 23, 26, 25],
  }
];

export const EXORA_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "buy",
    asset: "ETH",
    amount: 0.5,
    date: "2026-07-25T10:30:00Z",
    status: "completed",
  },
  {
    id: "tx-2",
    type: "deposit",
    asset: "INR",
    amount: 10000,
    date: "2026-07-24T15:45:00Z",
    status: "completed",
  },
  {
    id: "tx-3",
    type: "sell",
    asset: "SOL",
    amount: 10,
    date: "2026-07-23T09:15:00Z",
    status: "completed",
  },
];

export function formatCurrency(value: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
