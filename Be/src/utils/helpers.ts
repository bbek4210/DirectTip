export const formatError = (error: any) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const parseAmount = (amount: string | number): number => {
  const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(parsed)) throw new Error('Invalid amount');
  return parsed;
};

export const shortenWallet = (wallet: string): string => {
  if (!wallet || wallet.length < 8) return wallet;
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};

export const validateWalletAddress = (wallet: string): boolean => {
  // Basic Solana wallet validation (44 chars, base58)
  return wallet.length === 44 && /^[1-9A-HJ-NP-Z]+$/.test(wallet);
};
