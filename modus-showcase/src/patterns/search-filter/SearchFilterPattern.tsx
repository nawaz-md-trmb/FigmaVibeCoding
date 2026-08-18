// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcTextInput, ModusWcBadge, ModusWcCheckbox, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  const toggleFilter = (option) => {
    setSelectedFilters(prev =>
      prev.includes(option)
        ? prev.filter(f => f !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="grid gap-3">
      <ModusWcTextInput
        value={searchQuery}
        onInputChange={(e) => setSearchQuery(e.detail?.target?.value || '')}
        placeholder="Search..."
        includeSearchIcon={true}
      />
      
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h5" size="sm" weight="semibold" label="Filters" />
        <div className="grid gap-1">
          {filterOptions.map((option) => (
            <ModusWcCheckbox
              key={option}
              value={selectedFilters.includes(option)}
              onInputChange={() => toggleFilter(option)}
              label={option}
            />
          ))}
        </div>
      </ModusWcCard>

      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <ModusWcBadge key={filter} variant="filled" color="primary">
              {filter}
            </ModusWcBadge>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
