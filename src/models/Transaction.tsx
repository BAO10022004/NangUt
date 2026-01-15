import type { StatusTransaction, TypeTransactionLevel } from "./TypeTransaction";

export interface Transaction {
  id?: string;
  date: string;
  dayOfWeek: string;
  amount: number;
  description: string;
  status: StatusTransaction;
  typeTransaction: TypeTransactionLevel;
}