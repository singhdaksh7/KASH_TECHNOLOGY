export type LaunchpadStep = "wallet" | "token" | "presale" | "review" | "published" | "public_preview";

export interface LaunchpadFormState {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: string;
  presaleAllocation: string;
  tokenPrice: string;
  minimumContribution: string;
  maximumContribution: string;
  softCap: string;
  hardCap: string;
  startDate: string;
  endDate: string;
}

export const INITIAL_FORM_STATE: LaunchpadFormState = {
  tokenName: "",
  tokenSymbol: "",
  totalSupply: "",
  decimals: "18",
  presaleAllocation: "",
  tokenPrice: "",
  minimumContribution: "",
  maximumContribution: "",
  softCap: "",
  hardCap: "",
  startDate: "",
  endDate: "",
};
