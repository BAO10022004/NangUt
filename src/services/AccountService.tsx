import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Account } from '../models/Account';
import { logCreate, logLogin, logUpdate } from './HistoryService';
import { Auth } from '../Auth';
const ACCOUNTS_COLLECTION = 'accounts_nangut';
const his =new Auth();
//////////=================== Create Account======================================== //////////
export const createAccount = async (accountData: Omit<Account, 'id'>): Promise<string> => {
  try {
    const usernameQuery = query(
      collection(db, ACCOUNTS_COLLECTION),
      where('username', '==', accountData.username)
    );
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
      throw new Error(`Username "${accountData.username}" đã tồn tại!`);
    }
    const newAccount: Omit<Account, 'id'> = {
      username: accountData.username,
      password: accountData.password,
      personName: accountData.personName,
    };
    const docRef = await addDoc(
        collection(db, ACCOUNTS_COLLECTION), 
        newAccount
    );
    logCreate(his.getUsername()||'Unknown', `Tạo tài khoản ${accountData.username}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

//////////=================== Update Account======================================== //////////
export const updateAccount = async (
  accountId: string,
  accountData: Partial<Omit<Account, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, ACCOUNTS_COLLECTION, accountId);
    if (accountData.username) {
      const usernameQuery = query(
        collection(db, ACCOUNTS_COLLECTION),
        where('username', '==', accountData.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      const duplicateAccount = usernameSnapshot.docs.find(doc => doc.id !== accountId);
      if (duplicateAccount) {
        throw new Error(`Username "${accountData.username}" đã tồn tại!`);
      }
    }
    await updateDoc(docRef, accountData);
    logUpdate(his.getUsername()||'Unknown', `Cập nhật tài khoản ${accountData.username || accountId}`);
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};
//////////=================== Get Accounts======================================== //////////
export const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const q = query(collection(db, ACCOUNTS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Account));
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};
//////////=================== Get All Accounts======================================== //////////
export const getAccountByUsername = async (username: string): Promise<Account | null> => {
  try {
    const q = query(
      collection(db, ACCOUNTS_COLLECTION),
      where('username', '==', username)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Account;
    }
    return null;
  } catch (error) {
    console.error('Error getting account by username:', error);
    throw error;
  }
};
//////////=================== Change Password======================================== //////////
export const changePassword = async (accountId: string, newPassword: string): Promise<void> => {
  try {
    const docRef = doc(db, ACCOUNTS_COLLECTION, accountId);
    await updateDoc(docRef, {
      password: newPassword
    });
    logUpdate(his.getUsername()||'Unknown', `Đổi mật khẩu cho tài khoản ID: ${accountId}`);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
//////////=================== Delete Account======================================== //////////
export const deleteAccount = async (accountId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ACCOUNTS_COLLECTION, accountId));
    logUpdate(his.getUsername()||'Unknown', `Xóa tài khoản ID: ${accountId}`);
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
//////////=================== Login Account======================================== //////////
export const authenticateAccount = async (
  username: string,
  password: string
): Promise<Account | null> => {
  try {
    const account = await getAccountByUsername(username);
    
    if (account && account.password === password) {
      logLogin(username);
      return account;
    }
    return null;
  } catch (error) {
    console.error('Error authenticating account:', error);
    throw error;
  }
};
