import React from 'react';
import { Pagination } from 'antd';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize?: number) => void; // Function type for onChange
}

const CustomPagination: React.FC<PaginationProps> = ({ current, total, pageSize, onChange }) => {
  // ... rest of your custom pagination component logic

  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      // ... other pagination options
    />
  );
};

export default CustomPagination;