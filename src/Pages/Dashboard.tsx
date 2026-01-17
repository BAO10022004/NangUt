import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Dashboard.css';
import {
  getAllTransactions,
  getTransactionStatistics,
  type TransactionStatistics
} from '../services/TransactionService';
import type { Transaction } from '../models/Transaction';
import StatisticsCardsComponent from '../Compunents/StatisticsCardsCompunent';
import RecentTransactionsCompunent from '../Compunents/RecentTransactions';
import { LoadingForm } from '../Compunents/LoadingForm';




const DashboardHome: React.FC = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStatistics>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);
  //////////=================== Load Dashboard Data ======================================== //////////
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
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
      <LoadingForm message="Đang tải tổng quan tài chính..." />
    );
  }

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-title">Tổng Quan Tài Chính</h1>

      <StatisticsCardsComponent
        formatCurrency={formatCurrency}
        stats={stats}
      />
      <RecentTransactionsCompunent 
        recentTransactions={recentTransactions}
        formatCurrency={formatCurrency}
      />

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