import { FC, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronDown } from 'react-icons/fi';
import { Range } from 'react-range';

const FilterSidebar: FC<{setOpenFilter: (open: boolean) => void}> = ({setOpenFilter}) => {
  const [priceRange, setPriceRange] = useState([790, 105190]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const flowerOptions = ['Розы', 'Пионы', 'Тюльпаны', 'Хризантемы', 'Герберы', 'Лилии', 'Орхидеи', 'Гвоздики', 'Альстромерии', 'Ирисы'];
  const packagingOptions = ['Коробка', 'Пленка', 'Бумага', 'Корзина', 'Шляпная коробка', 'Фетр', 'Джут', 'Мешковина', 'Сетка'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(item => item !== filter)
        : [...prev, filter]
    );
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(prev => prev === dropdownName ? null : dropdownName);
  };

  const applyFilters = () => {
    setOpenFilter(false)
    console.log('Applied filters:', { priceRange, selectedFilters });
    // Здесь будет логика применения фильтров
  };

  const resetFilters = () => {
    setPriceRange([790, 105190]);
    setSelectedFilters([]);
  };

  // Закрытие dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest('.filter-option')) {
        setOpenDropdown(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <FilterContainer>
      <FilterSection>
        <FilterDropdown ref={dropdownRef}>
          <FilterLabel>Цветы</FilterLabel>
          <SelectButton onClick={() => toggleDropdown('flowers')}>
            ВЫБРАТЬ <FiChevronDown />
          </SelectButton>
          <DropdownContent isOpen={openDropdown === 'flowers'}>
            {flowerOptions.map(option => (
              <FilterOption key={option} className="filter-option">
                <Checkbox
                  type="checkbox"
                  checked={selectedFilters.includes(option)}
                  onChange={() => toggleFilter(option)}
                />
                <span>{option}</span>
              </FilterOption>
            ))}
          </DropdownContent>
        </FilterDropdown>

        <FilterDropdown ref={dropdownRef}>
          <FilterLabel>Упаковка</FilterLabel>
          <SelectButton onClick={() => toggleDropdown('packaging')}>
            ВЫБРАТЬ <FiChevronDown />
          </SelectButton>
          <DropdownContent isOpen={openDropdown === 'packaging'}>
            {packagingOptions.map(option => (
              <FilterOption key={option}>
                <Checkbox
                  type="checkbox"
                  checked={selectedFilters.includes(option)}
                  onChange={() => toggleFilter(option)}
                />
                <span>{option}</span>
              </FilterOption>
            ))}
          </DropdownContent>
        </FilterDropdown>
      </FilterSection>

      <PriceFilter>
        <FilterLabel>Цена</FilterLabel>
        <Range
          step={1000}
          min={790}
          max={105190}
          values={priceRange}
          onChange={values => setPriceRange(values)}
          renderTrack={({ props, children }) => (
            <PriceTrack {...props}>
              {children}
              <PriceValues>
                <span>{priceRange[0].toLocaleString()} ₽</span>
                <span>{priceRange[1].toLocaleString()} ₽</span>
              </PriceValues>
            </PriceTrack>
          )}
          renderThumb={({ props }) => <PriceThumb {...props} />}
        />
      </PriceFilter>

      <ActionButtons>
        <ApplyButton onClick={applyFilters}>ПРИМЕНИТЬ</ApplyButton>
        <ResetButton onClick={resetFilters}>СБРОСИТЬ</ResetButton>
      </ActionButtons>
    </FilterContainer>
  );
};

// Обновленные стили
const FilterContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 280px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const FilterDropdown = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
  margin-top: 5px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  scrollbar-width: thin;
  scrollbar-color: #8a4baf #f5f5f5;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #8a4baf;
    border-radius: 3px;
  }
`;




const FilterSection = styled.div`
  margin-bottom: 25px;
`;



const FilterLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
`;

const SelectButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;


const FilterOption = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f9f9f9;
  }

  span {
    margin-left: 8px;
  }
`;

const Checkbox = styled.input`
  margin: 0;
`;

const PriceFilter = styled.div`
  margin-bottom: 25px;
`;

const PriceTrack = styled.div`
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 20px 0;
  position: relative;
`;

const PriceThumb = styled.div`
  height: 16px;
  width: 16px;
  background: #8a4baf;
  border-radius: 50%;
  outline: none;
`;

const PriceValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #8a4baf;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #7d3a98;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #8a4baf;
    color: #8a4baf;
  }
`;

export default FilterSidebar;