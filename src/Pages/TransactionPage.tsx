import React, { useState, useEffect } from 'react';
import '../assets/TransactionPage.css';
import StatisticsCardsComponent from '../Compunents/StatisticsCardsCompunent';
import {
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  filterTransactions,
  type FilterTransactionParams,
  type TransactionStatistics
} from '../services/TransactionService';
import { getAllTypeTransactionLevel } from '../services/TypeTransactionLevelService';
import type { TypeTransactionLevel, StatusTransaction } from '../models/TypeTransaction';
import type { Transaction } from '../models/Transaction';

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [typeTransactionLevels, setTypeTransactionLevels] = useState<TypeTransactionLevel[]>([]);
  const [statistics, setStatistics] = useState<TransactionStatistics>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | ''>('');

  // Form states
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    description: '',
    status: 'pending' as StatusTransaction,
    typeTransactionId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, selectedType, selectedStatus, transactions]);

  useEffect(() => {
    calculateStatistics();
  }, [filteredTransactions]);

  //////////=================== Load Data ======================================== //////////
  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, typesData] = await Promise.all([
        getAllTransactions(),
        getAllTypeTransactionLevel()
      ]);
      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
      setTypeTransactionLevels(typesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  //////////=================== Calculate Statistics ======================================== //////////
  const calculateStatistics = () => {
    const stats: TransactionStatistics = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: filteredTransactions.length,
      pendingTransactions: 0,
      completedTransactions: 0
    };

    filteredTransactions.forEach(transaction => {
      // Calculate income and expense
      if (transaction.typeTransaction.type === 'thu') {
        stats.totalIncome += transaction.amount;
      } else {
        stats.totalExpense += transaction.amount;
      }

      // Count by status
      if (transaction.status === 'pending') {
        stats.pendingTransactions++;
      } else {
        stats.completedTransactions++;
      }
    });

    // Calculate balance
    stats.balance = stats.totalIncome - stats.totalExpense;

    setStatistics(stats);
  };

  //////////=================== Apply Filters ======================================== //////////
  const applyFilters = async () => {
    try {
      const filters: FilterTransactionParams = {
        description: searchTerm || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        typeTransactionId: selectedType || undefined,
        status: selectedStatus || undefined
      };

      const filtered = await filterTransactions(filters);
      setFilteredTransactions(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  //////////=================== Handle Add/Edit/Delete ======================================== //////////
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTypeLevel = typeTransactionLevels.find(t => t.id === formData.typeTransactionId);
    if (!selectedTypeLevel) {
      alert('Vui lòng chọn loại giao dịch!');
      return;
    }

    const date = new Date(formData.date);
    const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];

    try {
      await addTransaction({
        date: formData.date,
        dayOfWeek,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status,
        typeTransaction: selectedTypeLevel
      });

      alert('Thêm giao dịch thành công!');
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Lỗi khi thêm giao dịch!');
    }
  };

  const handleEditTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTransaction?.id) return;

    const selectedTypeLevel = typeTransactionLevels.find(t => t.id === formData.typeTransactionId);
    if (!selectedTypeLevel) {
      alert('Vui lòng chọn loại giao dịch!');
      return;
    }

    const date = new Date(formData.date);
    const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];

    try {
      await updateTransaction(editingTransaction.id, {
        date: formData.date,
        dayOfWeek,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status,
        typeTransaction: selectedTypeLevel
      });

      alert('Cập nhật giao dịch thành công!');
      setShowEditModal(false);
      setEditingTransaction(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Lỗi khi cập nhật giao dịch!');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;

    try {
      await deleteTransaction(id);
      alert('Xóa giao dịch thành công!');
      loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Lỗi khi xóa giao dịch!');
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      amount: transaction.amount.toString(),
      description: transaction.description,
      status: transaction.status,
      typeTransactionId: transaction.typeTransaction.id || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      amount: '',
      description: '',
      status: 'pending',
      typeTransactionId: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedType('');
    setSelectedStatus('');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="transaction-management-container">
      <div className="animated-box box-outer"></div>
      <div className="animated-box box-inner"></div>

      <div className="transaction-content">
        <h1 className="page-title">Quản Lý Giao Dịch</h1>

        {/* Statistics Cards */}
        <StatisticsCardsComponent 
          formatCurrency={formatCurrency}
          stats={statistics}
        />

        <button className="add-transaction-btn" onClick={() => setShowAddModal(true)}>
          + Thêm Giao Dịch
        </button>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm theo nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-item">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-item">
              <label>Loại giao dịch:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                {typeTransactionLevels.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.type === 'thu' ? 'Thu' : 'Chi'})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Trạng thái:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as StatusTransaction | '')}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="pending">Đang chờ</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            <button className="clear-filter-btn" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="transaction-grid">
          <div className="grid-header">
            <div>Ngày</div>
            <div>Loại</div>
            <div>Số tiền</div>
            <div>Nội dung</div>
            <div>Trạng thái</div>
            <div>Thao tác</div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="no-data">Không có giao dịch nào</div>
          ) : (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="grid-row">
                <div>{new Date(transaction.date).toLocaleDateString('vi-VN')}</div>
                <div>
                  <span className={`type-badge ${transaction.typeTransaction.type}`}>
                    {transaction.typeTransaction.name}
                  </span>
                </div>
                <div className={`amount ${transaction.typeTransaction.type}`}>
                  {transaction.typeTransaction.type === 'thu' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="description">{transaction.description}</div>
                <div>
                  <span className={`status-badge ${transaction.status}`}>
                    {transaction.status === 'pending' ? 'Đang chờ' : 'Hoàn thành'}
                  </span>
                </div>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(transaction)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTransaction(transaction.id!)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Thêm Giao Dịch Mới</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Ngày:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại giao dịch:</label>
                <select
                  value={formData.typeTransactionId}
                  onChange={(e) => setFormData({...formData, typeTransactionId: e.target.value})}
                  required
                >
                  <option value="">Chọn loại giao dịch</option>
                  {typeTransactionLevels.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.type === 'thu' ? 'Thu' : 'Chi'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Số tiền:</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Nhập số tiền"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Nhập nội dung giao dịch"
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as StatusTransaction})}
                  required
                >
                  <option value="pending">Đang chờ</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Thêm</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Chỉnh Sửa Giao Dịch</h2>
            <form onSubmit={handleEditTransaction}>
              <div className="form-group">
                <label>Ngày:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại giao dịch:</label>
                <select
                  value={formData.typeTransactionId}
                  onChange={(e) => setFormData({...formData, typeTransactionId: e.target.value})}
                  required
                >
                  <option value="">Chọn loại giao dịch</option>
                  {typeTransactionLevels.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.type === 'thu' ? 'Thu' : 'Chi'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Số tiền:</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Nhập số tiền"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Nhập nội dung giao dịch"
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as StatusTransaction})}
                  required
                >
                  <option value="pending">Đang chờ</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Cập nhật</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowEditModal(false); setEditingTransaction(null); resetForm(); }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;