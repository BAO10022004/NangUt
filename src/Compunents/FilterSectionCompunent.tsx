import React from 'react';
import type { StatusTransaction } from '../models/TypeTransaction';
import type { TypeTransactionLevel } from '../models/TypeTransaction';

function FilterSectionComponent(
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    startDate: string,
    setStartDate: React.Dispatch<React.SetStateAction<string>>,
    endDate: string,
    setEndDate: React.Dispatch<React.SetStateAction<string>>,
    selectedType: string,
    setSelectedType: React.Dispatch<React.SetStateAction<string>>,
    selectedStatus: string,
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>,
    typeTransactionLevels: TypeTransactionLevel[],
    clearFilters: () => void    

) {

    return (
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
    )
}
export default FilterSectionComponent;