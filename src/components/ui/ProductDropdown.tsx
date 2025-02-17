import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Delete,  } from 'lucide-react';
import { BOOLEAN_VALUES, NUMBER_VALUES } from '../../constants/AppConstants';

type Product = {
  productName : string,
  itemCode : string,
  description : string,
  price : number,
  HSN : string,
  SAC : string,
  
}

type ProductDropdownList = {

    product :Product[],


}

function ProductDropdownList(props: ProductDropdownList ) {
    const [isOpen, setIsOpen] = useState(BOOLEAN_VALUES.FALSE);
    const [selectedOption, setSelectedOption] = useState("Select Product");
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(BOOLEAN_VALUES.FALSE);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleOptionClick = (productCode?: string, dateName? : string) => {
     if(dateName!=null){
      setSelectedOption(dateName)
      setIsOpen(BOOLEAN_VALUES.FALSE);
    }
  }
  
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
          disabled={props.product.length === NUMBER_VALUES.ZERO}
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
                onClick={() => handleOptionClick("0","Select Product")}
              >
                <div className='flex gap-2 text-start'><Delete></Delete>
                Select Product</div>
                
              </button>
              {props.product.map((option) => (
                <button
                  key={option.itemCode}
                  id = {option.itemCode?.toString()}
                  className={`
                    w-full px-4 py-2 text-left
                    ${selectedOption === option.productName
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-800 hover:bg-gray-50'}
                    focus:outline-none focus:bg-gray-50
                  `}
                  onClick={() => handleOptionClick(option.itemCode,option.productName)}
                >
                  {option.productName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default ProductDropdownList;