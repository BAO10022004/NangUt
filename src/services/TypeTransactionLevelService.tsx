import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import type { TypeTransactionLevel, TypeTransaction } from '../models/TypeTransaction';
import { logCreate, logUpdate, logDelete } from './HistoryService';
import { Auth } from '../Auth';
const his = new Auth();
const TYPE_TRANSACTION_LEVEL_COLLECTION = 'type_transaction_level';

//////////=================== Add TypeTransactionLevel ======================================== //////////
export const addTypeTransactionLevel = async (
  name: string,
  type: TypeTransaction
): Promise<string> => {
  try {
    const newTypeTransactionLevel: Omit<TypeTransactionLevel, 'id'> = {
      name,
      type
    };

    const docRef = await addDoc(
      collection(db, TYPE_TRANSACTION_LEVEL_COLLECTION),
      newTypeTransactionLevel
    );
    logCreate(his.getUsername()||'Unknown', `Thêm loại giao dịch ${name} - ${type}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding type transaction level:', error);
    throw error;
  }
};

//////////=================== Update TypeTransactionLevel ======================================== //////////
export const updateTypeTransactionLevel = async (
  id: string,
  data: Partial<Omit<TypeTransactionLevel, 'id'>>
): Promise<void> => {
  try {
    const docRef = doc(db, TYPE_TRANSACTION_LEVEL_COLLECTION, id);
    await updateDoc(docRef, data);
    logUpdate(his.getUsername()||'Unknown', `Cập nhật loại giao dịch ID: ${id}`);
  } catch (error) {
    console.error('Error updating type transaction level:', error);
    throw error;
  }
};

//////////=================== Delete TypeTransactionLevel ======================================== //////////
export const deleteTypeTransactionLevel = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, TYPE_TRANSACTION_LEVEL_COLLECTION, id);
    await deleteDoc(docRef);
    logDelete(his.getUsername()||'Unknown', `Xóa loại giao dịch ID: ${id}`);
  } catch (error) {
    console.error('Error deleting type transaction level:', error);
    throw error;
  }
};

//////////=================== Get All TypeTransactionLevel ======================================== //////////
export const getAllTypeTransactionLevel = async (): Promise<TypeTransactionLevel[]> => {
  try {
    const q = query(collection(db, TYPE_TRANSACTION_LEVEL_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TypeTransactionLevel));
  } catch (error) {
    console.error('Error getting all type transaction level:', error);
    throw error;
  }
};

//////////=================== Get TypeTransactionLevel By Type ======================================== //////////
export const getTypeTransactionLevelByType = async (
  type: TypeTransaction
): Promise<TypeTransactionLevel[]> => {
  try {
    const q = query(
      collection(db, TYPE_TRANSACTION_LEVEL_COLLECTION),
      where('type', '==', type)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TypeTransactionLevel));
  } catch (error) {
    console.error('Error getting type transaction level by type:', error);
    throw error;
  }
};

//////////=================== Get TypeTransactionLevel By ID ======================================== //////////
export const getTypeTransactionLevelById = async (
  id: string
): Promise<TypeTransactionLevel | null> => {
  try {
    const allLevels = await getAllTypeTransactionLevel();
    return allLevels.find(level => level.id === id) || null;
  } catch (error) {
    console.error('Error getting type transaction level by id:', error);
    throw error;
  }
};