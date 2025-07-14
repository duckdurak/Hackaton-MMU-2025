import { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiFilter } from 'react-icons/fi';
import FilterSidebar from '../../features/auth/ui/filterSidebar/FilterSidebar';

const FilterComponent = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <FilterContainer>
      <FilterButton 
        ref={buttonRef}
        onClick={() => setOpenFilter(!openFilter)}
      >
        <FiFilter /> ФИЛЬТРЫ
      </FilterButton>
      
      {openFilter && buttonRef.current && (
        <FilterDropdown $top={buttonRef.current.offsetHeight}>
          <FilterSidebar setOpenFilter={setOpenFilter}/>
        </FilterDropdown>
      )}
    </FilterContainer>
  );
};

// Типы для пропсов
interface FilterDropdownProps {
  $top: number;
}

const FilterContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
  }
`;

const FilterDropdown = styled.div<FilterDropdownProps>`
  position: absolute;
  top: ${props => props.$top}px;
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  overflow: hidden;
`;

export default FilterComponent;