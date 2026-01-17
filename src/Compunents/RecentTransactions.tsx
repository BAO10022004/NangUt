import { Link } from "react-router-dom";
import { type Transaction } from "../models/Transaction";
interface FormLoginCompunentProps {
  recentTransactions: Transaction[];
  formatCurrency: (amount: number) => string;

}
function RecentTransactionsCompunent(
    { recentTransactions, formatCurrency }: FormLoginCompunentProps
) {
  return (
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
  );
}
export default RecentTransactionsCompunent;