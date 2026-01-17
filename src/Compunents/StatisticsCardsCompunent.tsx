import type { TransactionStatistics } from '../services/TransactionService';
import '../assets/StatisticsCardsCompunent.css';
interface StatisticsCardsProps {
  formatCurrency: (value: number) => string;
  stats: TransactionStatistics;
}

function StatisticsCardsComponent({ formatCurrency, stats }: StatisticsCardsProps) {
  return (
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
  );
}

export default StatisticsCardsComponent;