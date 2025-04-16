import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Delete,  } from 'lucide-react';
import DateRangeFilterDropdownProps from '../../@types/ui/DateRangeFilterDropdown';

function DateRangeFilterDropdown(props: DateRangeFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Filter");
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleOptionClick = (dateId : number, dateName : string) => {
      props.handleDateIdChange!(dateId);
      setSelectedOption(dateName)
      setIsOpen(false);
    };
  
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          className={`
            bg-white
            border border-gray-300
            text-gray-700
            py-2 px-4
            rounded-lg
            shadow-sm
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            min-w-[160px]
            transition-colors
            hover:border-gray-400
            flex items-center justify-between
          `}
          onClick={() => setIsOpen(!isOpen)}
          disabled={props.dropdownOptions.length === 0}
        >
          <span className="truncate">{selectedOption}</span>
          <ChevronDown 
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>
  
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="py-1 max-h-60 overflow-auto">
              <button
              id = "0"
                className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onClick={() => handleOptionClick(0,"Filter")}
              >
                <div className='flex gap-2 text-start'><Delete></Delete>
                Clear Filter</div>
                
              </button>
              {props.dropdownOptions.map((option) => (
                <button
                  key={option.id}
                  id = {option.search_date_range_id?.toString()}
                  className={`
                    w-full px-4 py-2 text-left
                    ${selectedOption === option.date_range
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-800 hover:bg-gray-50'}
                    focus:outline-none focus:bg-gray-50
                  `}
                  onClick={() => handleOptionClick(option.search_date_range_id,option.date_range)}
                >
                  {option.date_range}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default DateRangeFilterDropdown;