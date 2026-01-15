import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Transaction } from '../models/Transaction';
import type { StatusTransaction } from '../models/TypeTransaction';
import { logCreate, logUpdate, logDelete } from './HistoryService';
import { Auth } from '../Auth';

const his = new Auth();
const TRANSACTION_COLLECTION = 'transactions_nangut';

//////////=================== Add Single Transaction ======================================== //////////
export const addTransaction = async (
  transaction: Omit<Transaction, 'id'>
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, TRANSACTION_COLLECTION),
      {
        ...transaction,
        createdAt: Timestamp.now()
      }
    );
    
    logCreate(
      his.getUsername() || 'Unknown',
      `Thêm giao dịch: ${transaction.description} - ${transaction.amount.toLocaleString('vi-VN')} đ`
    );
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

//////////=================== Add Multiple Transactions ======================================== //////////
export const addMultipleTransactions = async (
  transactions: Omit<Transaction, 'id'>[]
): Promise<string[]> => {
  try {
    const batch = writeBatch(db);
    const docIds: string[] = [];
    
    for (const transaction of transactions) {
      const docRef = doc(collection(db, TRANSACTION_COLLECTION));
      batch.set(docRef, {
        ...transaction,
        createdAt: Timestamp.now()
      });
      docIds.push(docRef.id);
    }
    
    await batch.commit();
    
    logCreate(
      his.getUsername() || 'Unknown',
      `Thêm ${transactions.length} giao dịch`
    );
    
    return docIds;
  } catch (error) {
    console.error('Error adding multiple transactions:', error);
    throw error;
  }
};

//////////=================== Update Transaction ======================================== //////////
export const updateTransaction = async (
  id: string,
  data: Partial<Omit<Transaction, 'id'>>
): Promise<void> => {
  try {
    const docRef = doc(db, TRANSACTION_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    
    logUpdate(
      his.getUsername() || 'Unknown',
      `Cập nhật giao dịch ID: ${id}`
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

//////////=================== Delete Transaction ======================================== //////////
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, TRANSACTION_COLLECTION, id);
    await deleteDoc(docRef);
    
    logDelete(
      his.getUsername() || 'Unknown',
      `Xóa giao dịch ID: ${id}`
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

//////////=================== Get All Transactions ======================================== //////////
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, TRANSACTION_COLLECTION));
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  } catch (error) {
    console.error('Error getting all transactions:', error);
    throw error;
  }
};

//////////=================== Search Transactions ======================================== //////////
export interface SearchTransactionParams {
  description?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const searchTransactions = async (
  params: SearchTransactionParams
): Promise<Transaction[]> => {
  try {
    let transactions = await getAllTransactions();
    
    // Tìm kiếm theo mô tả (description)
    if (params.description) {
      const searchTerm = params.description.toLowerCase();
      transactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Lọc theo khoảng số tiền
    if (params.minAmount !== undefined) {
      transactions = transactions.filter(t => t.amount >= params.minAmount!);
    }
    
    if (params.maxAmount !== undefined) {
      transactions = transactions.filter(t => t.amount <= params.maxAmount!);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error searching transactions:', error);
    throw error;
  }
};

//////////=================== Filter By Date Range ======================================== //////////
export const filterTransactionsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Transaction[]> => {
  try {
    const transactions = await getAllTransactions();
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return transactionDate >= start && transactionDate <= end;
    });
  } catch (error) {
    console.error('Error filtering transactions by date range:', error);
    throw error;
  }
};

//////////=================== Filter By Type ======================================== //////////
export const filterTransactionsByType = async (
  typeTransactionId: string
): Promise<Transaction[]> => {
  try {
    const transactions = await getAllTransactions();
    
    return transactions.filter(t =>
      t.typeTransaction.id === typeTransactionId
    );
  } catch (error) {
    console.error('Error filtering transactions by type:', error);
    throw error;
  }
};

//////////=================== Filter By Status ======================================== //////////
export const filterTransactionsByStatus = async (
  status: StatusTransaction
): Promise<Transaction[]> => {
  try {
    const q = query(
      collection(db, TRANSACTION_COLLECTION),
      where('status', '==', status)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  } catch (error) {
    console.error('Error filtering transactions by status:', error);
    throw error;
  }
};

//////////=================== Advanced Filter ======================================== //////////
export interface FilterTransactionParams {
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  typeTransactionId?: string;
  status?: StatusTransaction;
}

export const filterTransactions = async (
  params: FilterTransactionParams
): Promise<Transaction[]> => {
  try {
    let transactions = await getAllTransactions();
    
    // Lọc theo mô tả
    if (params.description) {
      const searchTerm = params.description.toLowerCase();
      transactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Lọc theo khoảng số tiền
    if (params.minAmount !== undefined) {
      transactions = transactions.filter(t => t.amount >= params.minAmount!);
    }
    
    if (params.maxAmount !== undefined) {
      transactions = transactions.filter(t => t.amount <= params.maxAmount!);
    }
    
    // Lọc theo khoảng ngày
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    
    // Lọc theo loại giao dịch
    if (params.typeTransactionId) {
      transactions = transactions.filter(t =>
        t.typeTransaction.id === params.typeTransactionId
      );
    }
    
    // Lọc theo trạng thái
    if (params.status) {
      transactions = transactions.filter(t => t.status === params.status);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error filtering transactions:', error);
    throw error;
  }
};

//////////=================== Get Transaction By ID ======================================== //////////
export const getTransactionById = async (
  id: string
): Promise<Transaction | null> => {
  try {
    const transactions = await getAllTransactions();
    return transactions.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error getting transaction by id:', error);
    throw error;
  }
};

//////////=================== Get Transaction Statistics ======================================== //////////
export interface TransactionStatistics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
}

export const getTransactionStatistics = async (
  startDate?: string,
  endDate?: string
): Promise<TransactionStatistics> => {
  try {
    let transactions = await getAllTransactions();
    
    // Lọc theo khoảng ngày nếu có
    if (startDate && endDate) {
      transactions = await filterTransactionsByDateRange(startDate, endDate);
    }
    
    const stats: TransactionStatistics = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: transactions.length,
      pendingTransactions: 0,
      completedTransactions: 0
    };
    
    transactions.forEach(t => {
      if (t.typeTransaction.type === 'thu') {
        stats.totalIncome += t.amount;
      } else {
        stats.totalExpense += t.amount;
      }
      
      if (t.status === 'pending') {
        stats.pendingTransactions++;
      } else {
        stats.completedTransactions++;
      }
    });
    
    stats.balance = stats.totalIncome - stats.totalExpense;
    
    return stats;
  } catch (error) {
    console.error('Error getting transaction statistics:', error);
    throw error;
  }
};