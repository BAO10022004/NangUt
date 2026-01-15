export type TypeTransaction = "thu" | "chi" ;
export type StatusTransaction = "pending" | "completed" ;
export interface TypeTransactionLevel {
  id?: string;
  name: string;
  type: TypeTransaction;
}