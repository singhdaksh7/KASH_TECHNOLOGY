import { LaunchpadFormState } from "./types";

export function validateTokenStep(state: LaunchpadFormState): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!state.tokenName) errors.tokenName = "Token name is required";
  if (!state.tokenSymbol) errors.tokenSymbol = "Token symbol is required";
  else if (!/^[A-Z0-9]+$/i.test(state.tokenSymbol)) errors.tokenSymbol = "Alphanumeric only";
  
  const supply = parseFloat(state.totalSupply);
  if (isNaN(supply) || supply <= 0) errors.totalSupply = "Supply must be greater than 0";
  
  const dec = parseInt(state.decimals);
  if (isNaN(dec) || dec < 0 || dec > 18) errors.decimals = "Must be between 0 and 18";

  return errors;
}

export function validatePresaleStep(state: LaunchpadFormState): Record<string, string> {
  const errors: Record<string, string> = {};
  
  const supply = parseFloat(state.totalSupply) || 0;
  const alloc = parseFloat(state.presaleAllocation);
  if (isNaN(alloc) || alloc <= 0) errors.presaleAllocation = "Allocation is required";
  else if (alloc > supply) errors.presaleAllocation = "Cannot exceed total supply";

  const price = parseFloat(state.tokenPrice);
  if (isNaN(price) || price <= 0) errors.tokenPrice = "Invalid price";

  const minC = parseFloat(state.minimumContribution);
  const maxC = parseFloat(state.maximumContribution);
  if (isNaN(minC) || minC <= 0) errors.minimumContribution = "Invalid minimum";
  if (isNaN(maxC) || maxC <= 0) errors.maximumContribution = "Invalid maximum";
  else if (maxC < minC) errors.maximumContribution = "Max must be >= min";

  const soft = parseFloat(state.softCap);
  const hard = parseFloat(state.hardCap);
  if (isNaN(soft) || soft <= 0) errors.softCap = "Invalid soft cap";
  if (isNaN(hard) || hard <= 0) errors.hardCap = "Invalid hard cap";
  else if (hard < soft) errors.hardCap = "Hard cap must be >= soft cap";

  if (!state.startDate) errors.startDate = "Start date required";
  if (!state.endDate) errors.endDate = "End date required";
  else if (new Date(state.endDate) <= new Date(state.startDate)) errors.endDate = "End date must be after start date";

  return errors;
}
