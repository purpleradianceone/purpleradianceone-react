
const StockRulesCard = ({ availableStock } : {
    availableStock : number | boolean 
}) => {
  //rules 
  const rules = [
    {
      description: 'You may select any available serial numbers from the list. It is not required to select the exact count matching the entered quantity.',
      color: 'text-green-600 bg-green-50',
    },
    {
      description: 'If fewer serial numbers are selected, the system will automatically allocate additional serial numbers for the remaining quantity.',
      color: 'text-red-600 bg-red-50',
    },
    {
      description: 'If more serial numbers are selected, the system will consider only the required quantity as per the entered value.',
      color: 'text-red-600 bg-red-50',
    },
    {
      description: 'If sufficient stock is not available, the product cannot be mapped to the account.',
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className=" max-w-full
      bg-white space-y-1">

      {/* Rules List */}
      <div className="space-y-0.5 pt-1">
      <p className="table-header-custom">📌 Please note the following instructions while selecting serial numbers :</p>
        {rules.map((rule, index) => (
          <div key={index} className="">
            
            <ul className="list-disc pl-6 ">
              <li className="caption-custom">{rule.description}</li>
            </ul>
          </div>
        ))}
      </div>

      {/* Available Stock Display (Conditional) */}
      {availableStock  && (
        <div className="">
          <p className="pl-5  text-blue-700  text-xs  p-1  flex items-center">
             Current available stock: {availableStock}
          </p>
        </div>
      )}
    </div>
  );
};

export default StockRulesCard;