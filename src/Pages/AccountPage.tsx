// AccountManagement.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key, X, Save, Eye, EyeOff } from 'lucide-react';
import {
  getAllAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  changePassword
} from '../services/AccountService';
import type { Account } from '../models/Account';
import '../assets/AccountPage.css';

export default function AccountPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'password'>('add');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    personName: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      alert('Lỗi khi tải danh sách tài khoản!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'add' | 'edit' | 'password', account?: Account) => {
    setModalType(type);
    setSelectedAccount(account || null);
    
    if (type === 'edit' && account) {
      setFormData({
        username: account.username,
        password: account.password,
        personName: account.personName
      });
    } else if (type === 'password' && account) {
      setFormData({
        username: account.username,
        password: '',
        personName: account.personName
      });
    } else {
      setFormData({ username: '', password: '', personName: '' });
    }
    
    setShowModal(true);
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
    setFormData({ username: '', password: '', personName: '' });
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.personName.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if ((modalType === 'add' || modalType === 'password') && !formData.password.trim()) {
      alert('Vui lòng nhập mật khẩu!');
      return;
    }

    try {
      if (modalType === 'add') {
        await createAccount(formData);
        alert('Tạo tài khoản thành công!');
      } else if (modalType === 'edit' && selectedAccount) {
        await updateAccount(selectedAccount.id!, {
          username: formData.username,
          personName: formData.personName
        });
        alert('Cập nhật tài khoản thành công!');
      } else if (modalType === 'password' && selectedAccount) {
        await changePassword(selectedAccount.id!, formData.password);
        alert('Đổi mật khẩu thành công!');
      }
      
      handleCloseModal();
      loadAccounts();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (account: Account) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${account.username}"?`)) {
      try {
        await deleteAccount(account.id!);
        alert('Xóa tài khoản thành công!');
        loadAccounts();
      } catch (error) {
        alert('Lỗi khi xóa tài khoản!');
      }
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'add': return 'Thêm Tài Khoản Mới';
      case 'edit': return 'Chỉnh Sửa Tài Khoản';
      case 'password': return 'Đổi Mật Khẩu';
      default: return '';
    }
  };

  return (
    <div className="account-management">
      {/* Animated Background */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      {/* Main Content */}
      <div className="content-wrapper">
        <h1 className="page-title">Quản Lý Tài Khoản</h1>
        
        <button 
          className="btn btn-primary btn-add"
          onClick={() => handleOpenModal('add')}
        >
          <Plus size={20} />
          Thêm Tài Khoản
        </button>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-info">
                  <h3 className="account-username">{account.username}</h3>
                  <p className="account-name">{account.personName}</p>
                </div>
                
                <div className="account-actions">
                  <button
                    className="btn btn-edit btn-icon"
                    onClick={() => handleOpenModal('edit', account)}
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button
                    className="btn btn-edit btn-icon"
                    onClick={() => handleOpenModal('password', account)}
                    title="Đổi mật khẩu"
                  >
                    <Key size={18} />
                  </button>
                  
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDelete(account)}
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{getModalTitle()}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Nhập username"
                  disabled={modalType === 'password'}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tên Người Dùng</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.personName}
                  onChange={(e) => setFormData({...formData, personName: e.target.value})}
                  placeholder="Nhập tên người dùng"
                  disabled={modalType === 'password'}
                  required
                />
              </div>

              {(modalType === 'add' || modalType === 'password') && (
                <div className="form-group">
                  <label className="form-label">
                    {modalType === 'password' ? 'Mật Khẩu Mới' : 'Mật Khẩu'}
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}