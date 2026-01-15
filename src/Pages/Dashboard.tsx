import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Dashboard.css';
import {
  getAllTransactions,
  getTransactionStatistics,
  type TransactionStatistics
} from '../services/TransactionService';
import type { Transaction } from '../models/Transaction';

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<TransactionStatistics>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get statistics
      const statsData = await getTransactionStatistics();
      setStats(statsData);

      // Get recent transactions (last 5)
      const allTransactions = await getAllTransactions();
      const sortedTransactions = allTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecentTransactions(sortedTransactions);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-title">Tổng Quan Tài Chính</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card income-card">
          <div className="stat-header">
            <span className="stat-title">Tổng Thu</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalIncome)}</div>
          <div className="stat-change positive">
            <span>↑</span>
            <span>Tổng thu nhập</span>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-header">
            <span className="stat-title">Tổng Chi</span>
            <span className="stat-icon">💸</span>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalExpense)}</div>
          <div className="stat-change negative">
            <span>↓</span>
            <span>Tổng chi tiêu</span>
          </div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-header">
            <span className="stat-title">Số Dư</span>
            <span className="stat-icon">💵</span>
          </div>
          <div className="stat-value">{formatCurrency(stats.balance)}</div>
          <div className={`stat-change ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
            <span>{stats.balance >= 0 ? '↑' : '↓'}</span>
            <span>{stats.balance >= 0 ? 'Dương' : 'Âm'}</span>
          </div>
        </div>

        <div className="stat-card transaction-card">
          <div className="stat-header">
            <span className="stat-title">Giao Dịch</span>
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-details">
            <span className="detail-item pending">
              {stats.pendingTransactions} đang chờ
            </span>
            <span className="detail-item completed">
              {stats.completedTransactions} hoàn thành
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Giao Dịch Gần Đây</h2>
          <Link to="/transaction" className="view-all-link">
            Xem tất cả →
          </Link>
        </div>

        <div className="recent-transactions">
          {recentTransactions.length === 0 ? (
            <div className="no-transactions">
              <span className="empty-icon">📭</span>
              <p>Chưa có giao dịch nào</p>
              <Link to="/transaction" className="add-transaction-link">
                Thêm giao dịch đầu tiên
              </Link>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.typeTransaction.type === 'thu' ? '📥' : '📤'}
                </div>
                <div className="transaction-info">
                  <p className="transaction-description">{transaction.description}</p>
                  <p className="transaction-type">{transaction.typeTransaction.name}</p>
                </div>
                <div className="transaction-right">
                  <p className={`transaction-amount ${transaction.typeTransaction.type}`}>
                    {transaction.typeTransaction.type === 'thu' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Thao Tác Nhanh</h2>
        <div className="actions-grid">
          <Link to="/transaction" className="action-card">
            <span className="action-icon">➕</span>
            <h3 className="action-title">Thêm Giao Dịch</h3>
            <p className="action-description">Ghi nhận thu chi mới</p>
          </Link>

          <Link to="/type-transaction" className="action-card">
            <span className="action-icon">🏷️</span>
            <h3 className="action-title">Quản Lý Loại</h3>
            <p className="action-description">Phân loại giao dịch</p>
          </Link>

          <Link to="/transaction" className="action-card">
            <span className="action-icon">📈</span>
            <h3 className="action-title">Xem Báo Cáo</h3>
            <p className="action-description">Phân tích chi tiết</p>
          </Link>

          <Link to="/account" className="action-card">
            <span className="action-icon">⚙️</span>
            <h3 className="action-title">Cài Đặt</h3>
            <p className="action-description">Quản lý tài khoản</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;