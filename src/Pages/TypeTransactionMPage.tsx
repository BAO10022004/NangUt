import React, { useState, useEffect } from 'react';
import '../assets/TypeTransactionPage.css';
import { type TypeTransactionLevel } from '../models/TypeTransaction';
import {type TypeTransaction} from '../models/TypeTransaction';
import {
  addTypeTransactionLevel,
  updateTypeTransactionLevel,
  deleteTypeTransactionLevel,
  getAllTypeTransactionLevel
} from '../services/TypeTransactionLevelService';

const TypeTransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TypeTransactionLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'thu' | 'chi'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'thu' as 'thu' | 'chi' });

  // Load data from Firebase when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllTypeTransactionLevel();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filterType === 'all'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', type: 'thu' });
    setShowModal(true);
  };

  const handleEdit = (transaction: TypeTransactionLevel) => {
    setEditingId(transaction.id!);
    setFormData({ name: transaction.name, type: transaction.type });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại giao dịch này?')) {
      try {
        setLoading(true);
        await deleteTypeTransactionLevel(id);
        // Update local state after successful deletion
        setTransactions(transactions.filter(t => t.id !== id));
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Không thể xóa. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên loại giao dịch!');
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Update existing transaction
        await updateTypeTransactionLevel(editingId, formData);
        // Update local state
        setTransactions(transactions.map(t =>
          t.id === editingId ? { ...t, ...formData } : t
        ));
        alert('Cập nhật thành công!');
      } else {
        // Add new transaction
        const newId = await addTypeTransactionLevel(formData.name, formData.type);
        // Update local state with new transaction
        setTransactions([...transactions, {
          id: newId,
          ...formData
        }]);
        alert('Thêm mới thành công!');
      }

      setShowModal(false);
      setFormData({ name: '', type: 'thu' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Không thể lưu dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', type: 'thu' });
    setEditingId(null);
  };

  return (
    <div className="transaction-management-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Animated Background Boxes */}
      <div className="animated-box box-outer"></div>
      <div className="animated-box box-inner"></div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <h1 className="page-title">QUẢN LÝ LOẠI GIAO DỊCH</h1>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="add-button" onClick={handleAdd} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm loại giao dịch
          </button>

          <div className="filter-group">
            <span className="filter-label">Lọc:</span>
            <button
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
              disabled={loading}
            >
              Tất cả
            </button>
            <button
              className={`filter-button ${filterType === 'thu' ? 'active' : ''}`}
              onClick={() => setFilterType('thu')}
              disabled={loading}
            >
              Thu
            </button>
            <button
              className={`filter-button ${filterType === 'chi' ? 'active' : ''}`}
              onClick={() => setFilterType('chi')}
              disabled={loading}
            >
              Chi
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="data-grid-container">
          <div className="grid-header">
            <div className="grid-header-cell">TÊN LOẠI GIAO DỊCH</div>
            <div className="grid-header-cell">LOẠI</div>
            <div className="grid-header-cell center">THAO TÁC</div>
          </div>

          <div className="grid-body">
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                {loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'}
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <div key={transaction.id} className="grid-row">
                  <div className="grid-cell">{transaction.name}</div>
                  <div className="grid-cell">
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type === 'thu' ? 'Thu' : 'Chi'}
                    </span>
                  </div>
                  <div className="grid-cell center">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(transaction)}
                      title="Sửa"
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(transaction.id!)}
                      title="Xóa"
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? 'Sửa loại giao dịch' : 'Thêm loại giao dịch'}
              </h2>
              <button className="close-button" onClick={handleCloseModal} disabled={loading}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên loại giao dịch</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên loại giao dịch"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Loại</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      value="thu"
                      checked={formData.type === 'thu'}
                      onChange={() => setFormData({ ...formData, type: 'thu' })}
                      disabled={loading}
                    />
                    <span>Thu</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      value="chi"
                      checked={formData.type === 'chi'}
                      onChange={() => setFormData({ ...formData, type: 'chi' })}
                      disabled={loading}
                    />
                    <span>Chi</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal} disabled={loading}>
                  Hủy
                </button>
                <button type="submit" className="submit-button" disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeTransactionPage;