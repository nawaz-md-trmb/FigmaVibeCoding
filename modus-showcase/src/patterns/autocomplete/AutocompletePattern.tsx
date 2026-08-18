// @ts-nocheck
import { useRef, useEffect } from 'react';
import { ModusWcAutocomplete } from '@trimble-oss/moduswebcomponents-react';

export function Autocomplete() {
  const autocompleteRef = useRef(null);
  const initializedRef = useRef(false);

  const initialFruits = [
    { label: 'Apple', value: 'apple', visibleInMenu: true, selected: false },
    { label: 'Banana', value: 'banana', visibleInMenu: true, selected: true },
    { label: 'Blueberry', value: 'blueberry', visibleInMenu: true, selected: false },
    { label: 'Cherry', value: 'cherry', visibleInMenu: true, selected: true },
    { label: 'Grape', value: 'grape', visibleInMenu: true, selected: false },
    { label: 'Lemon', value: 'lemon', visibleInMenu: true, selected: false },
    { label: 'Mango', value: 'mango', visibleInMenu: true, selected: false },
    { label: 'Orange', value: 'orange', visibleInMenu: true, selected: false },
    { label: 'Peach', value: 'peach', visibleInMenu: true, selected: false },
    { label: 'Pear', value: 'pear', visibleInMenu: true, selected: false },
    { label: 'Pineapple', value: 'pineapple', visibleInMenu: true, selected: false },
    { label: 'Strawberry', value: 'strawberry', visibleInMenu: true, selected: false },
    { label: 'Watermelon', value: 'watermelon', visibleInMenu: true, selected: false }
  ];

  useEffect(() => {
    if (autocompleteRef.current && !initializedRef.current) {
      autocompleteRef.current.items = initialFruits;
      initializedRef.current = true;
    }
  }, []);

  const handleInputChange = (e) => {
    const searchValue = e.detail?.target?.value || '';
    
    if (autocompleteRef.current && autocompleteRef.current.items) {
      const currentItems = autocompleteRef.current.items;
      const updatedItems = currentItems.map(fruit => ({
        ...fruit,
        visibleInMenu: !searchValue || fruit.label.toLowerCase().includes(searchValue.toLowerCase())
      }));
      autocompleteRef.current.items = updatedItems;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <ModusWcAutocomplete
        ref={autocompleteRef}
        aria-label="Fruit autocomplete"
        placeholder="Search for fruits..."
        includeSearch={true}
        includeClear={true}
        showMenuOnFocus={true}
        multiSelect={true}
        leaveMenuOpen={true}
        minChars={0}
        maxChips={4}
        onInputChange={handleInputChange}
      />
    </div>
  );
}

export default Autocomplete;
